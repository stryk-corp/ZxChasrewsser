"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function Step1() {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={control}
        name="universityName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>University Name</FormLabel>
            <FormControl>
              <Input placeholder="E.g., University of Excellence" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="faculty"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Faculty</FormLabel>
            <FormControl>
              <Input placeholder="E.g., Faculty of Science" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="department"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Department</FormLabel>
            <FormControl>
              <Input placeholder="E.g., Department of Chemistry" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="courseCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Course Code</FormLabel>
            <FormControl>
              <Input placeholder="E.g., CHEM-101" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="courseTitle"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Course Title</FormLabel>
            <FormControl>
              <Input placeholder="E.g., Introduction to Chemistry" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="studentName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Your Full Name</FormLabel>
            <FormControl>
              <Input placeholder="E.g., John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="studentId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Registration Number / ID</FormLabel>
            <FormControl>
              <Input placeholder="E.g., U/2025/12345" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="lecturerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lecturer's Name</FormLabel>
            <FormControl>
              <Input placeholder="E.g., Prof. Jane Smith" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Submission</FormLabel>
            <FormControl>
              <Input placeholder="E.g., August, 2025" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
