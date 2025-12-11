'use client';

import withAuth from '@/components/withAuth';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function ProfilePage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="container py-12">
        <div className="mx-auto max-w-lg">
          <Card>
            <CardHeader className="items-center">
              <Skeleton className="h-24 w-24 rounded-full" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-6 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
              <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Or a message indicating user not found
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-lg">
        <Card>
          <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
              <AvatarFallback className="text-3xl">
                {user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl font-headline">{user.displayName || 'No display name'}</CardTitle>
            <p className="text-muted-foreground">{user.email}</p>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="grid gap-2">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">User ID</span>
                    <span className="font-mono text-xs">{user.uid}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Email Verified</span>
                    <span>{user.emailVerified ? 'Yes' : 'No'}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Created</span>
                    <span>{user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Signed In</span>
                    <span>{user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : 'N/A'}</span>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default withAuth(ProfilePage);
