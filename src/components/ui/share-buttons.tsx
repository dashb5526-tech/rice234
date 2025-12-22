"use client";

import { Button } from "@/components/ui/button";
import { Facebook, Twitter, MessageCircle, Linkedin, Pin, Instagram, Youtube, Send } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
}

export function ShareButtons({ url, title, description, imageUrl }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || title);
  const encodedImage = imageUrl ? encodeURIComponent(imageUrl) : '';

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    pinterest: imageUrl ? `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedDescription}` : null,
    instagram: `https://www.instagram.com/?url=${encodedUrl}`, // Instagram doesn't have direct sharing, opens app/website
    youtube: `https://www.youtube.com/share?url=${encodedUrl}&title=${encodedTitle}&description=${encodedDescription}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    const link = shareLinks[platform];
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('facebook')}
        className="flex items-center gap-2"
      >
        <Facebook className="h-4 w-4" />
        Facebook
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('twitter')}
        className="flex items-center gap-2"
      >
        <Twitter className="h-4 w-4" />
        Twitter
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('whatsapp')}
        className="flex items-center gap-2"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('linkedin')}
        className="flex items-center gap-2"
      >
        <Linkedin className="h-4 w-4" />
        LinkedIn
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('telegram')}
        className="flex items-center gap-2"
      >
        <Send className="h-4 w-4" />
        Telegram
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('instagram')}
        className="flex items-center gap-2"
      >
        <Instagram className="h-4 w-4" />
        Instagram
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('youtube')}
        className="flex items-center gap-2"
      >
        <Youtube className="h-4 w-4" />
        YouTube
      </Button>
      {imageUrl && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('pinterest')}
          className="flex items-center gap-2"
        >
          <Pin className="h-4 w-4" />
          Pinterest
        </Button>
      )}
    </div>
  );
}