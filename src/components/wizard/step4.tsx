'use client';

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export function Step4() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
       <FormField
        control={control}
        name="ackParties"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Parties to Acknowledge</FormLabel>
            <FormControl>
              <Textarea
                placeholder="List people, institutions, or groups you want to thank. E.g., 'My advisor Dr. Smith, the National Science Foundation for funding, my family for their support.'"
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              This will be used to generate the acknowledgements section.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
