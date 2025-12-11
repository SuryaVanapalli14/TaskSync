"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, Search } from "lucide-react"

export function MainView() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
          <Card className="flex flex-col items-center justify-center text-center p-8 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full mb-4">
                <PlusCircle className="h-10 w-10" />
              </div>
              <CardTitle className="font-headline text-2xl">Post a New Task</CardTitle>
              <CardDescription>
                Have something you need done? Post it to our marketplace and find reliable helpers in minutes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" asChild>
                <Link href="/tasks/create">Get Started</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col items-center justify-center text-center p-8 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full mb-4">
                 <Search className="h-10 w-10" />
              </div>
              <CardTitle className="font-headline text-2xl">Find Work</CardTitle>
              <CardDescription>
                Looking to earn extra income? Browse tasks posted by people in your community and apply for jobs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" asChild variant="secondary">
                <Link href="/tasks">Browse Tasks</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
    )
}
