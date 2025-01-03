"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { messageSchema } from "@/schemas/messageSchema";
import axios, { AxiosError } from "axios";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";

export default function ProfileForm() {
  const { toast } = useToast();
  const pathname = usePathname();
  const username = pathname.split("/")[2]; // Extract username from the path.

  // Initialize the form with validation and default values.
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });

  const { isSubmitting } = form.formState; // Track submission state.

  // Handle form submission.
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post("/api/send-message", {
        username,
        content: data.content,
      });

      toast({
        title: "Message Sent",
        description: response.data.message,
      });

      // Reset the form after successful submission.
      form.reset({ content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-2 md:p-10 flex justify-center items-center">
      <div className="py-20 w-full max-w-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col px-6"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your message here..."
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
