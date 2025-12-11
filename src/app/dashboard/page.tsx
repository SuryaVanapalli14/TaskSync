"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import withAuth from "@/components/withAuth"
import { useUser } from "@/firebase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalyticsView } from "./analytics-view";
import { MainView } from "./main-view";

function DashboardPage() {
  const { user } = useUser();
  const [greeting, setGreeting] = useState("Hello");

  // This is a mock verification status. In a real app, you'd fetch this from your backend/database.
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);


  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {greeting}, {user?.displayName?.split(' ')[0] || 'welcome back'}!
        </h1>
        <p className="text-muted-foreground">Here's a summary of your activity.</p>
      </div>
      
      {!isVerified && (
        <Alert className="mb-8" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Verification Required</AlertTitle>
          <AlertDescription>
            Your account is not yet verified. Please complete your profile to access all features.
            <Button asChild variant="link" className="p-0 h-auto ml-2">
              <Link href="/profile">Go to Profile</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <MainView />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsView />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default withAuth(DashboardPage);
