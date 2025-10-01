
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export function Step3() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6 max-w-md mx-auto">
       <FormField
        control={control}
        name="numberOfChapters"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Chapters</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select how many chapters to generate" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {[1, 2, 3, 4].map(num => (
                        <SelectItem key={num} value={String(num)}>
                            {num} {num > 1 ? 'Chapters' : 'Chapter'}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <FormDescription>
              The AI will generate content for this many chapters based on your paper topic.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
