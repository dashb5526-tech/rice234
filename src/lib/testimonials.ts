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