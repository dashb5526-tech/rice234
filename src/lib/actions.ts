
"use server";

import * as z from "zod";
import { saveSubmission } from './submissions';

const contactSchema = z.object({
  type: z.literal("contact"),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string(),
});

const orderSchema = z.object({
  type: z.literal("order"),
  name: z.string(),
  company: z.string().optional(),
  phone: z.string(),
  email: z.string().email(),
  riceType: z.string(),
  quantity: z.string(),
  message: z.string().optional(),
});

const formSchema = z.union([contactSchema, orderSchema]);

export async function submitForm(data: z.infer<typeof formSchema>) {
  try {
    const parsedData = formSchema.parse(data);
    
    const result = await saveSubmission(parsedData);

    if (result.success) {
      return { success: true, message: "Form submitted successfully." };
    } else {
      return { success: false, message: result.message || "An unexpected error occurred." };
    }

  } catch (error) {
    console.error("Form submission error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, message: "Invalid form data.", errors: error.errors };
    }
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
}
