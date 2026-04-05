
"use server";

import * as z from "zod";
import { saveSubmission } from './submissions';
import { sendContactFormNotification, sendOrderFormNotification } from './email';

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
      // Send email notification
      if (parsedData.type === 'contact') {
        await sendContactFormNotification({
          name: parsedData.name,
          email: parsedData.email,
          phone: parsedData.phone,
          message: parsedData.message,
        });
      } else if (parsedData.type === 'order') {
        await sendOrderFormNotification({
          name: parsedData.name,
          company: parsedData.company,
          phone: parsedData.phone,
          email: parsedData.email,
          riceType: parsedData.riceType,
          quantity: parsedData.quantity,
          message: parsedData.message,
        });
      }

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
