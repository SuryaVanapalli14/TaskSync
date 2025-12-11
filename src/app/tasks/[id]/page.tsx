'use client';

import { tasks } from "@/lib/data";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { MapPin, Calendar, Users, UserCheck } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import withAuth from "@/components/withAuth";

function TaskDetailPage() {
  const params = useParams();
  const taskId = Array.isArray(params.id) ? params.id[0] : params.id;
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    notFound();
  }

  const image = PlaceHolderImages.find((p) => p.id === task.image);
  const requesterAvatar = PlaceHolderImages.find(p => p.id === task.requester.avatar);

  return (
    <div className="container py-12">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary">{task.category}</Badge>
            <h1 className="text-4xl font-bold font-headline">{task.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                    {requesterAvatar && (
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={requesterAvatar.imageUrl} alt={task.requester.name} />
                            <AvatarFallback>{task.requester.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    )}
                    <span>Posted by {task.requester.name}</span>
                </div>
            </div>
          </div>

          <div className="relative w-full h-[400px] rounded-lg overflow-hidden border">
            {image && (
              <Image
                src={image.imageUrl}
                alt={task.title}
                data-ai-hint={image.imageHint}
                fill
                className="object-cover"
              />
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold font-headline mb-4">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {task.description}
            </p>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-primary">₹{task.budget}</span>
                <span className="text-sm text-muted-foreground">Budget</span>
              </div>
              <Separator />
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="font-medium text-foreground">Date</span>
                    <p className="text-muted-foreground">{format(new Date(task.date), 'PPPP')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="font-medium text-foreground">Location</span>
                    <p className="text-muted-foreground">{task.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="font-medium text-foreground">Workers Needed</span>
                    <p className="text-muted-foreground">{task.workers}</p>
                  </div>
                </div>
              </div>
              <Button size="lg" className="w-full">
                <UserCheck className="mr-2 h-5 w-5" />
                Apply for this task
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg">Applicants ({task.applicants.length})</CardTitle>
            </CardHeader>
            <CardContent>
                {task.applicants.length > 0 ? (
                    <div className="space-y-4">
                        {task.applicants.map(applicant => {
                            const applicantAvatar = PlaceHolderImages.find(p => p.id === applicant.avatar);
                            return (
                                <div key={applicant.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {applicantAvatar && (
                                            <Avatar>
                                                <AvatarImage src={applicantAvatar.imageUrl} alt={applicant.name} />
                                                <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div>
                                            <p className="font-semibold">{applicant.name}</p>
                                            <p className="text-sm text-muted-foreground">{applicant.role}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">View Profile</Button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Be the first to apply!</p>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


export default withAuth(TaskDetailPage);