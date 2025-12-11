'use client';

import { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface LiveSelfieProps {
  onSelfieTaken: (file: File | null) => void;
}

export function LiveSelfie({ onSelfieTaken }: LiveSelfieProps) {
  const [selfie, setSelfie] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const handleTakeSelfie = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL('image/png');
    setSelfie(dataUrl);

    canvas.toBlob(blob => {
      if (blob) {
        const file = new File([blob], 'selfie.png', { type: 'image/png' });
        onSelfieTaken(file);
      }
    }, 'image/png');
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
          hasCameraPermission && <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        )}
        {!selfie && hasCameraPermission === false && (
             <Alert variant="destructive" className="m-4">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access to use this feature.
              </AlertDescription>
            </Alert>
        )}
      </div>
       <canvas ref={canvasRef} className="hidden" />
      <div className="mt-4 flex justify-center gap-2">
        {selfie ? (
          <Button type="button" variant="outline" onClick={handleRetake}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retake
          </Button>
        ) : (
          <Button type="button" onClick={handleTakeSelfie} disabled={!hasCameraPermission}>
            <Camera className="mr-2 h-4 w-4" />
            Take Selfie
          </Button>
        )}
      </div>
    </Card>
  );
}