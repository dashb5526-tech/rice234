
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

// The following functions (add, update, delete) would typically be implemented
// by making API calls to corresponding serverless functions or a backend API.
// For this example, they are not fully implemented.

export async function addTestimonial(testimonial: Omit<Testimonial, 'id'>): Promise<Testimonial> {
  // This is a placeholder implementation.
  console.log("Adding testimonial (placeholder):", testimonial);
  const newTestimonial = { ...testimonial, id: `testimonial-${Date.now()}` };
  return testimonialSchema.parse(newTestimonial);
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | null> {
  // This is a placeholder implementation.
  console.log(`Updating testimonial ${id} (placeholder):`, updates);
  const testimonials = await fetchTestimonials();
  const index = testimonials.findIndex(t => t.id === id);
  if (index === -1) return null;

  const updatedTestimonial = { ...testimonials[index], ...updates };
  return testimonialSchema.parse(updatedTestimonial);
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  // This is a placeholder implementation.
  console.log(`Deleting testimonial ${id} (placeholder)`);
  return true;
}
