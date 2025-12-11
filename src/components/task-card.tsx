import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Users } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Task } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const image = PlaceHolderImages.find((p) => p.id === task.image);

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
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
        </div>
        <div className="p-4">
            <Badge variant="secondary" className="mb-2">{task.category}</Badge>
            <CardTitle className="font-headline text-lg">
                <Link href={`/tasks/${task.id}`} className="hover:text-primary transition-colors">
                    {task.title}
                </Link>
            </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{task.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{format(new Date(task.date), 'PPP')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 text-primary font-bold">₹</span>
            <span className="font-semibold text-foreground">{task.budget}</span>
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
