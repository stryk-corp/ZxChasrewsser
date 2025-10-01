
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { getGeminiKeyManager } from './geminiKeyManager';

const MODEL = 'googleai/gemini-2.5-flash';

function createGenkitInstance(apiKey: string) {
  return genkit({
    plugins: [googleAI({ apiKey })],
    model: MODEL,
  });
}

const keyManager = getGeminiKeyManager();

async function withRetry(fn: (instance: any) => any) {
  const triedKeys: string[] = [];
  let lastErr: any = null;
  const totalKeys = keyManager ? Math.max(1, keyManager.keyCount()) : 1;
  // Try up to number of keys available
  for (let attempt = 0; attempt < totalKeys; attempt++) {
    const key = keyManager.getKey();
    if (!key) break;
    if (triedKeys.includes(key)) break;
    triedKeys.push(key);

    // Try each key a few times for transient network errors
    const MAX_TRIES_PER_KEY = 2;
    let perKeyAttempt = 0;
    while (perKeyAttempt < MAX_TRIES_PER_KEY) {
      perKeyAttempt++;
      const instance = createGenkitInstance(key);
      try {
        const res = await fn(instance);
        return res;
      } catch (err: any) {
        lastErr = err;
        const msg = String(err?.message || err || '').toLowerCase();
        const masked = (k: string) => (k.length > 8 ? k.slice(0,4) + '...' + k.slice(-4) : k);
        console.error(`[genkit] key ${masked(key)} attempt ${perKeyAttempt} failed:`, err?.message || err);

        // If rate limit or explicit expired/quota errors, expire key immediately and break to next key
        if (msg.includes('429') || msg.includes('rate limit') || msg.includes('api key expired') || msg.includes('quota')) {
          try { keyManager.expireKey(key); } catch (e) {}
          break; // move to next key
        }

        // Transient network issues: try again on same key up to MAX_TRIES_PER_KEY
        if (msg.includes('fetch failed') || msg.includes('network') || msg.includes('econnrefused') || msg.includes('enotfound') || msg.includes('timeout') || msg.includes('socket hang up')) {
          if (perKeyAttempt < MAX_TRIES_PER_KEY) {
            // small backoff
            await new Promise(r => setTimeout(r, 200 * perKeyAttempt));
            continue; // retry same key
          } else {
            // give up on this key for now
            try { keyManager.expireKey(key); } catch (e) {}
            break;
          }
        }

        // Unknown error: do not silently swallow — rethrow
        throw err;
      }
    }
    // continue to next key
  }
  throw lastErr || new Error('No active Gemini API keys available');
}

// Proxy object that forwards common genkit methods with key rotation
export const ai: any = {
  definePrompt: (opts: any) => {
    // return a wrapper that will execute using withRetry when called
    const promptWrapper = (...args: any[]) => withRetry(async (instance: any) => {
      const prompt = instance.definePrompt(opts);
      // If prompt is invoked as a function, call it with args
      if (typeof prompt === 'function') return await prompt(...args);
      return prompt;
    });
    // Attach original-like properties for compatibility
    return promptWrapper as any;
  },
  defineFlow: (opts: any, fn: any) => {
    // genkit flows are typically created server-side; create flow with current key
    // We'll return a function that runs the flow using withRetry
    const flowWrapper = async (input: any) => withRetry(async (instance: any) => {
      const flow = instance.defineFlow(opts, fn);
      if (typeof flow === 'function') {
        return await flow(input);
      }
      return flow;
    });
    return flowWrapper as any;
  },
  // Fallback: allow dynamic calls for other methods
  __raw: (methodName: string, ...args: any[]) => withRetry((instance: any) => (instance as any)[methodName](...args)),
};