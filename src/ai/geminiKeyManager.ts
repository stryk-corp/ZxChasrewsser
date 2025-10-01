// geminiKeyManager.ts
// Manages Gemini API keys: rotation, expiration, and reset after 24 hours.

import fs from 'fs';
import path from 'path';

interface GeminiKey {
  key: string;
  expired: boolean;
  expiredAt?: number;
}

class GeminiKeyManager {
  private keys: GeminiKey[] = [];
  private currentIndex = 0;
  private resetInterval = 24 * 60 * 60 * 1000; // 24 hours in ms

  constructor(keys: string[]) {
    this.keys = keys.map(k => ({ key: k.trim(), expired: false }));
    this.loadState();
    setInterval(() => this.resetExpiredKeys(), this.resetInterval);
  }

  getKey(): string | null {
    this.resetExpiredKeys();
    for (let i = 0; i < this.keys.length; i++) {
      const idx = (this.currentIndex + i) % this.keys.length;
      if (!this.keys[idx].expired) {
        this.currentIndex = (idx + 1) % this.keys.length;
        return this.keys[idx].key;
      }
    }
    return null; // No active keys
  }

  expireKey(key: string) {
    const k = this.keys.find(k => k.key === key);
    if (k) {
      k.expired = true;
      k.expiredAt = Date.now();
      this.saveState();
    }
  }

  resetExpiredKeys() {
    const now = Date.now();
    for (const k of this.keys) {
      if (k.expired && k.expiredAt && now - k.expiredAt >= this.resetInterval) {
        k.expired = false;
        k.expiredAt = undefined;
        this.saveState();
      }
    }
  }

  private getStateFilePath() {
    try {
      return path.join(process.cwd(), '.gemini_key_state.json');
    } catch (e) {
      return path.resolve('.gemini_key_state.json');
    }
  }

  private loadState() {
    try {
      const file = this.getStateFilePath();
      if (!fs.existsSync(file)) return;
      const raw = fs.readFileSync(file, 'utf8');
      const state = JSON.parse(raw) as { [key: string]: { expired: boolean; expiredAt?: number } };
      for (const k of this.keys) {
        if (state[k.key]) {
          k.expired = !!state[k.key].expired;
          k.expiredAt = state[k.key].expiredAt;
        }
      }
    } catch (err) {
      // ignore state load errors
    }
  }

  private saveState() {
    try {
      const file = this.getStateFilePath();
      const state: { [key: string]: { expired: boolean; expiredAt?: number } } = {};
      for (const k of this.keys) {
        state[k.key] = { expired: !!k.expired, expiredAt: k.expiredAt };
      }
      fs.writeFileSync(file, JSON.stringify(state, null, 2), 'utf8');
    } catch (err) {
      // ignore save errors
    }
  }

  keyCount() {
    return this.keys.length;
  }
}

// Singleton instance
let manager: GeminiKeyManager | null = null;

export function getGeminiKeyManager(): GeminiKeyManager {
  if (!manager) {
    const envKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '';
    const keys = envKeys.split(',').map(k => k.trim()).filter(Boolean);
    manager = new GeminiKeyManager(keys);
  }
  return manager;
}
