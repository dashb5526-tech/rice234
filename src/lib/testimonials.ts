import { Testimonial } from '@/lib/types';
import testimonialsData from '@/lib/data/testimonials.json';

export type { Testimonial };


export async function getTestimonials(): Promise<Testimonial[]> {
    try {
        const baseUrl = typeof window === 'undefined' ? (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:9002') : '';
        const response = await fetch(`${baseUrl}/api/testimonials`);
        if (!response.ok) {
            return testimonialsData as Testimonial[];
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching testimonials, falling back to local data', error);
        return testimonialsData as Testimonial[];
    }
}

async function saveAllTestimonials(testimonials: Testimonial[]): Promise<void> {
    await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonials),
    });
}


export async function saveTestimonial(testimonial: Testimonial): Promise<void> {
    const allTestimonials = await getTestimonials();
    const index = allTestimonials.findIndex(t => t.id === testimonial.id);
    if (index !== -1) {
        allTestimonials[index] = testimonial;
    } else {
        allTestimonials.push(testimonial);
    }
    await saveAllTestimonials(allTestimonials);
}

export async function deleteTestimonial(testimonialId: string): Promise<void> {
    const allTestimonials = await getTestimonials();
    const updatedTestimonials = allTestimonials.filter(t => t.id !== testimonialId);
    await saveAllTestimonials(updatedTestimonials);
}
