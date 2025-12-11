import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Task } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
}

const urgencyClasses = {
  Emergency: "bg-red-500/20 text-red-700 border-red-500/30 hover:bg-red-500/30",
  "Same Day": "bg-yellow-500/20 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/30",
  Flexible: "bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30",
};


export function TaskCard({ task }: TaskCardProps) {
  const image = PlaceHolderImages.find((p) => p.id === task.image);

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-40 w-full">
          {image ? (
            <Image
              src={image.imageUrl}
              alt={task.title}
              data-ai-hint={image.imageHint}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-secondary"></div>
          )}
           <Badge className={cn("absolute top-2 right-2", urgencyClasses[task.urgency])} variant="outline">
            {task.urgency}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="font-headline text-lg mb-2 leading-snug">
            <Link href={`/tasks/${task.id}`} className="hover:text-primary transition-colors">
                {task.title}
            </Link>
        </CardTitle>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{task.distance.toFixed(1)} km away</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl text-foreground">₹{task.budget.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/tasks/${task.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
