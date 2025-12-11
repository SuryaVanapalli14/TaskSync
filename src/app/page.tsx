import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, BrainCircuit, LayoutDashboard, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const features = [
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Vibrant Marketplace",
    description: "Find tasks that fit your schedule and skills, or post a job and get help from trusted locals.",
    image: PlaceHolderImages.find(p => p.id === 'feature-marketplace')
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: "AI-Powered Pricing",
    description: "Our smart AI suggests the optimal price for your task, ensuring fair rates for everyone.",
    image: PlaceHolderImages.find(p => p.id === 'feature-ai')
  },
  {
    icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
    title: "Analytics Dashboard",
    description: "Track your tasks, earnings, and performance with our intuitive and powerful analytics dashboard.",
    image: PlaceHolderImages.find(p => p.id === 'feature-dashboard')
  },
];

const testimonials = [
  {
    name: "Sarah L.",
    role: "Homeowner",
    avatar: PlaceHolderImages.find(p => p.id === 'testimonial-1'),
    comment: "TaskSync made it so easy to find someone reliable to help with my garden. The AI price suggestion was spot on!",
  },
  {
    name: "Mike R.",
    role: "Freelance Helper",
    avatar: PlaceHolderImages.find(p => p.id === 'testimonial-2'),
    comment: "I love the flexibility. I can pick up jobs whenever I have free time, and the payments are always prompt. A great way to earn extra cash.",
  },
  {
    name: "Jessica P.",
    role: "Small Business Owner",
    avatar: PlaceHolderImages.find(p => p.id === 'testimonial-3'),
    comment: "We use TaskSync for all our odd jobs, from deliveries to office setup. It's been a lifesaver for our small team.",
  },
];

const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="relative w-full pt-12 md:pt-24 lg:pt-32">
            <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="space-y-4">
                            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                Get things done, <span className="text-primary">together</span>.
                            </h1>
                            <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                TaskSync connects you with trusted local helpers for everything from
                                everyday chores to skilled projects. Post a task or find work, all
                                on one platform.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 min-[400px]:flex-row">
                            <Button asChild size="lg">
                                <Link href="/tasks">
                                    Find Work
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link href="/tasks/create">Post a Task</Link>
                            </Button>
                        </div>
                    </div>
                     <div className="relative h-64 sm:h-80 md:h-96 lg:h-full w-full overflow-hidden rounded-xl">
                        {heroImage && (
                          <Image
                            src={heroImage.imageUrl}
                            alt={heroImage.description}
                            data-ai-hint={heroImage.imageHint}
                            fill
                            className="object-cover"
                            priority
                          />
                        )}
                    </div>
                </div>
            </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Everything You Need
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  TaskSync is packed with features to make finding help or work
                  as seamless as possible.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 mt-12">
              {features.map((feature, index) => (
                <Card key={index} className="h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                  <CardHeader className="flex flex-col items-center text-center">
                    {feature.icon}
                    <CardTitle className="font-headline mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                How It Works
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Getting started is as easy as 1, 2, 3.
              </p>
            </div>
            <div className="mx-auto w-full max-w-4xl mt-8">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-bold font-headline">Post Your Task</h3>
                  <p className="text-muted-foreground">
                    Describe what you need done, set your budget, and post it to
                    the marketplace.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-bold font-headline">Choose a Helper</h3>
                  <p className="text-muted-foreground">
                    Review profiles and offers from skilled helpers in your area and
                    choose the best fit.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-bold font-headline">Task Complete</h3>
                  <p className="text-muted-foreground">
                    Your helper gets the job done. Pay securely through the app
                    and leave a review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-5xl font-headline">
              Trusted by our Community
            </h2>
            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-card">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">
                      &quot;{testimonial.comment}&quot;
                    </p>
                    <div className="mt-4 flex items-center space-x-4">
                      {testimonial.avatar && (
                        <Avatar>
                          <AvatarImage 
                            src={testimonial.avatar.imageUrl}
                            alt={testimonial.name}
                            data-ai-hint={testimonial.avatar.imageHint}
                          />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Ready to Join?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Whether you need a hand or want to lend one, TaskSync is the
                place to be. Sign up today and join our growing community.
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/register">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
