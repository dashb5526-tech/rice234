
"use client";

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useRef, useState, WheelEvent } from 'react';
import { getCertificates, Certificate } from '@/lib/certificates';
import { getCertificatesSectionContent, CertificatesSectionContent } from '@/lib/certificates-section';
import Autoplay from "embla-carousel-autoplay";
import { X, ZoomIn, ZoomOut } from "lucide-react";

function getDistance(touches: React.TouchList | TouchList) {
  return Math.hypot(
    touches[0].pageX - touches[1].pageX,
    touches[0].pageY - touches[1].pageY
  );
}

function CertificateLightbox({
  isOpen,
  setIsOpen,
  imageUrl,
  imageName,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  imageUrl: string;
  imageName: string;
}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastDistance = useRef<number | null>(null);
  const touchStartPos = useRef<{x: number, y: number} | null>(null);


  useEffect(() => {
    // Reset zoom and position when the dialog opens
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      lastDistance.current = null;
      touchStartPos.current = null;
    }
  }, [isOpen]);

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const newScale = Math.max(1, Math.min(scale - e.deltaY * 0.001, 5));
    setScale(newScale);

    if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 5));
  };
  
  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.2, 1);
    setScale(newScale);
     if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
    }
  };
  
   const clampPosition = (pos: {x: number, y: number}, currentScale: number) => {
    if (imgRef.current && containerRef.current) {
        const imgRect = imgRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        const scaledImgWidth = imgRef.current.offsetWidth * currentScale;
        const scaledImgHeight = imgRef.current.offsetHeight * currentScale;

        const maxX = Math.max(0, (scaledImgWidth - containerRect.width) / (2 * currentScale));
        const maxY = Math.max(0, (scaledImgHeight - containerRect.height) / (2 * currentScale));
        
        return {
            x: Math.max(-maxX, Math.min(pos.x, maxX)),
            y: Math.max(-maxY, Math.min(pos.y, maxY)),
        };
    }
    return pos;
  };


  const handleDragStart = (e: React.MouseEvent<HTMLImageElement>) => {
    if (scale <= 1) return;
    e.preventDefault();
    const startX = e.pageX - position.x;
    const startY = e.pageY - position.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      let newPos = {
        x: moveEvent.pageX - startX,
        y: moveEvent.pageY - startY,
      };
      setPosition(clampPosition(newPos, scale));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleTouchStart = (e: React.TouchEvent<HTMLImageElement>) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      lastDistance.current = getDistance(e.touches);
    } else if (e.touches.length === 1 && scale > 1) {
      e.preventDefault();
      touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLImageElement>) => {
    if (e.touches.length === 2 && lastDistance.current !== null) {
      e.preventDefault();
      const newDist = getDistance(e.touches);
      const scaleChange = newDist / lastDistance.current;
      const newScale = Math.max(1, Math.min(scale * scaleChange, 5))
      setScale(newScale);
       if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      lastDistance.current = newDist;
    } else if (e.touches.length === 1 && touchStartPos.current && scale > 1) {
      e.preventDefault();
      const deltaX = e.touches[0].clientX - touchStartPos.current.x;
      const deltaY = e.touches[0].clientY - touchStartPos.current.y;
      
      let newPos = {
        x: position.x + deltaX,
        y: position.y + deltaY
      };
      
      setPosition(clampPosition(newPos, scale));
      touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent<HTMLImageElement>) => {
    lastDistance.current = null;
    touchStartPos.current = null;
    if (scale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLImageElement>) => {
      if (scale > 1) {
          setScale(1);
          setPosition({ x: 0, y: 0 });
      } else {
          setScale(2);
      }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="max-w-5xl w-full h-[90vh] bg-transparent border-none shadow-none flex items-center justify-center p-0"
        onWheel={handleWheel}
      >
        <DialogTitle className="sr-only">{imageName}</DialogTitle>
        <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <Image
                ref={imgRef}
                src={imageUrl}
                alt={imageName}
                fill
                className={scale > 1 ? 'cursor-grab' : 'cursor-default'}
                style={{
                  transform: `scale(${scale}) translateX(${position.x}px) translateY(${position.y}px)`,
                  transition: 'transform 0.1s linear',
                  objectFit: 'contain',
                  touchAction: 'none'
                }}
                onMouseDown={handleDragStart}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onDoubleClick={handleDoubleClick}
            />
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-background/80 p-2 shadow-md">
            <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={scale <= 1}><ZoomOut/></Button>
            <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={scale >= 5}><ZoomIn/></Button>
        </div>
        <DialogClose className="absolute right-4 top-4 rounded-full p-2 bg-background/80 opacity-100 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [sectionContent, setSectionContent] = useState<CertificatesSectionContent | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{url: string, name: string} | null>(null);
  
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  useEffect(() => {
    getCertificates().then(setCertificates);
    getCertificatesSectionContent().then(setSectionContent);
  }, []);
  
  const openLightbox = (cert: Certificate) => {
    setSelectedImage({ url: cert.imageUrl, name: cert.name });
    setLightboxOpen(true);
  }

  if (certificates.length === 0) {
    return null; // Don't render the section if there are no certificates
  }

  return (
    <>
    <section id="certificates" className="bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {sectionContent?.title || "Our Certifications"}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {sectionContent?.description || "We are committed to quality and safety, backed by industry-standard certifications."}
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
              {certificates.map((cert) => (
                <CarouselItem key={cert.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="p-2">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                         <button type="button" onClick={() => openLightbox(cert)} className="relative aspect-[4/3] w-full block">
                            <Image
                                src={cert.imageUrl}
                                alt={cert.name}
                                fill
                                className="object-contain p-4 transition-transform duration-300 hover:scale-105"
                            />
                        </button>
                      </CardContent>
                      <CardHeader className="p-4 pt-0 text-center">
                        <CardTitle className="font-headline text-lg">{cert.name}</CardTitle>
                      </CardHeader>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 sm:-left-12"/>
            <CarouselNext className="right-2 sm:-right-12"/>
          </Carousel>
        </div>
      </div>
    </section>
    {selectedImage && (
        <CertificateLightbox 
          isOpen={lightboxOpen}
          setIsOpen={setLightboxOpen}
          imageUrl={selectedImage.url}
          imageName={selectedImage.name}
        />
    )}
    </>
  );
}
    
