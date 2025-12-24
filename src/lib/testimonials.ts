import testimonialsData from "./data/testimonials.json";

export interface Testimonial {
    id: string;
    name: string;
    title: string;
    quote: string;
    rating: number;
    authorImageUrl: string;
}

export const getTestimonials = async (): Promise<Testimonial[]> => {
    return Promise.resolve(testimonialsData as Testimonial[]);
};

export const saveTestimonial = async (testimonial: Testimonial): Promise<void> => {
    // In a real application, you would save the testimonial to a database or file.
    // For this example, we'll just log it to the console.
    console.log("Saving testimonial:", testimonial);
    return Promise.resolve();
};

export const deleteTestimonial = async (id: string): Promise<void> => {
    // In a real application, you would delete the testimonial from a database or file.
    // For this example, we'll just log it to the console.
    console.log("Deleting testimonial with id:", id);
    return Promise.resolve();
};