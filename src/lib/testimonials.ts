
import { z } from 'zod';

const testimonialSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  quote: z.string(),
  rating: z.number(),
  authorImageUrl: z.string(),
});

export type Testimonial = z.infer<typeof testimonialSchema>;

async function fetchTestimonials(): Promise<Testimonial[]> {
  try {
    // In a real application, you would fetch from an API endpoint.
    // For this example, we'll fetch from the local public directory.
    const response = await fetch('/api/testimonials');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return z.array(testimonialSchema).parse(data);
  } catch (error) {
    console.error("Could not fetch testimonials:", error);
    // Return an empty array or handle the error as needed
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return await fetchTestimonials();
}

export async function getTestimonialById(id: string): Promise<Testimonial | undefined> {
  const testimonials = await fetchTestimonials();
  return testimonials.find(t => t.id === id);
}

export const saveAllTestimonials = async (testimonials: Testimonial[]): Promise<void> => {
    try {
        await fetch("/api/testimonials", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(testimonials),
        });
    } catch (error) {
        console.error("Failed to save testimonials", error);
        throw error;
    }
};