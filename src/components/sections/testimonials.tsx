
"use client";

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';
import { getTestimonials, Testimonial } from '@/lib/testimonials';
import { getPartners, Partner } from '@/lib/partners';
import { getTestimonialsSection, TestimonialsSection } from '@/lib/testimonials-section';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Autoplay from "embla-carousel-autoplay";


export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [sectionContent, setSectionContent] = useState<TestimonialsSection | null>(null);
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  useEffect(() => {
    getTestimonials().then(setTestimonials);
    getPartners().then(setPartners);
    getTestimonialsSection().then(setSectionContent);
  }, []);

  return (
    <section id="testimonials" className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {sectionContent?.title || "Trusted by the Best"}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {sectionContent?.description || "Hear what our valued clients have to say about our products and services."}
          </p>
        </div>

        <div className="mt-16">
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="h-full">
                      <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
                        <p className="mt-4 flex-1 text-lg text-muted-foreground">"{testimonial.quote}"</p>
                        <div className="mt-6">
                            <Avatar className="mx-auto h-16 w-16">
                                <AvatarImage src={testimonial.authorImageUrl || undefined} alt={testimonial.name} />
                                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="mt-4 font-semibold text-foreground">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                            <div className="mt-2 flex justify-center text-accent">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                    key={i} 
                                    className={cn(
                                        "h-5 w-5",
                                        i < testimonial.rating ? "fill-current" : "text-gray-300"
                                    )} 
                                    />
                                ))}
                            </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 sm:-left-12"/>
            <CarouselNext className="right-2 sm:-right-12"/>
          </Carousel>
        </div>
        
        <div className="mt-24">
          <h3 className="text-center text-lg font-semibold text-muted-foreground">
            Our Proud Partners
          </h3>
          <div className="mt-8 flow-root">
            <div className="flex flex-wrap items-center justify-center gap-8">
              {partners.map((partner) => (
                <div key={partner.id} className="flex flex-shrink-0 justify-center">
                  {partner.logoUrl && (
                    <Image
                      className="h-12 w-auto object-contain"
                      src={partner.logoUrl}
                      alt={partner.name}
                      width={158}
                      height={48}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
    
