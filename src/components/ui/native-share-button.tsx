
"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface NativeShareButtonProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export function NativeShareButton({ url, title, description, className }: NativeShareButtonProps) {
  const { toast } = useToast();

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } catch (error: any) {
        // AbortError is triggered when the user cancels the share dialog.
        // We can safely ignore this, and other permission-denied style errors.
        if (error.name !== 'AbortError' && !error.message.includes('Permission denied')) {
            console.error("Error sharing:", error);
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link Copied!",
          description: "The product link has been copied to your clipboard.",
        });
      } catch (err) {
        toast({
          title: "Failed to Copy",
          description: "Could not copy link to clipboard.",
          variant: "destructive",
        });
        console.error("Failed to copy: ", err);
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleNativeShare}
      className={cn("flex items-center gap-2", className)}
    >
      <Share2 className="h-5 w-5" />
      <span className="sr-only">Share Product</span>
    </Button>
  );
}
