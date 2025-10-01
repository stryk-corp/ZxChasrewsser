"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Step2() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="paperTopic"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Paper Topic</FormLabel>
            <FormControl>
              <Input placeholder="E.g., The Role of Quantum Mechanics in Modern Chemistry" {...field} />
            </FormControl>
            <FormDescription>
              This topic will be used to generate a relevant dedication and other AI content.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="paperHighlights"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Key Highlights & Takeaways</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Summarize the main points, findings, and arguments of your paper. This will be used to generate the conclusion."
                className="min-h-[150px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Provide enough detail for the AI to write a strong summary.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
