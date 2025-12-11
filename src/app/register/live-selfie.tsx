'use client';

import { useState } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LiveSelfieProps {
  onSelfieTaken: (file: File | null) => void;
}

export function LiveSelfie({ onSelfieTaken }: LiveSelfieProps) {
  const [selfie, setSelfie] = useState<string | null>(null);

  // This is a dummy function for now.
  // In a real implementation, this would use navigator.mediaDevices.getUserMedia
  // to access the camera and capture an image.
  const handleTakeSelfie = () => {
    // Using a placeholder image for the dummy implementation
    const placeholderImageUrl = 'https://picsum.photos/seed/selfie/400/300';
    setSelfie(placeholderImageUrl);

    // We can't create a real File object from a remote URL due to security restrictions.
    // For the dummy implementation, we'll pass null to the parent.
    // In a real implementation, you would create a Blob from the canvas and a File object.
    onSelfieTaken(null); 
  };

  const handleRetake = () => {
    setSelfie(null);
    onSelfieTaken(null);
  };

  return (
    <Card className="p-4 bg-secondary/50">
      <div className="aspect-video w-full rounded-md bg-background flex items-center justify-center overflow-hidden border">
        {selfie ? (
          <Image
            src={selfie}
            alt="User selfie"
            width={400}
            height={300}
            className="object-cover"
          />
        ) : (
          <div className="text-center text-muted-foreground p-4">
            <Camera className="h-10 w-10 mx-auto mb-2" />
            <p className="text-sm">Your live selfie will appear here.</p>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {selfie ? (
          <Button type="button" variant="outline" onClick={handleRetake}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retake
          </Button>
        ) : (
          <Button type="button" onClick={handleTakeSelfie}>
            <Camera className="mr-2 h-4 w-4" />
            Take Selfie
          </Button>
        )}
      </div>
    </Card>
  );
}
