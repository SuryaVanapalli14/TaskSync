'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import withAuth from '@/components/withAuth';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LiveSelfie } from '../register/live-selfie'; // Re-using the selfie component
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck } from 'lucide-react';


const verificationSchema = z.object({
  legalName: z.string().min(3, "Legal name is required."),
  govId: z.any().refine(file => file, "Government ID is required."),
  userPhoto: z.any().refine(file => file, "Your photo is required."),
  selfie: z.any().refine(file => file, "A live selfie is required."),
  phoneNumber: z.string().min(10, "A valid phone number is required."),
  phoneOtp: z.string().length(6, "OTP must be 6 digits."),
  emailOtp: z.string().length(6, "OTP must be 6 digits."),
  streetAddress: z.string().min(5, "Door/St. name is required."),
  area: z.string().min(3, "Area is required."),
  city: z.string().min(3, "City/Town is required."),
  state: z.string().min(2, "State is required."),
  country: z.string().min(2, "Country is required."),
  pincode: z.string().min(5, "A valid PIN code is required."),
});

type VerificationFormValues = z.infer<typeof verificationSchema>;


function ProfilePage() {
  const { user, loading } = useUser();
  const { toast } = useToast();
  const [isVerified, setIsVerified] = useState(false); // Mock state

  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      legalName: '',
      phoneNumber: '',
      phoneOtp: '',
      emailOtp: '',
      govId: null,
      userPhoto: null,
      selfie: null,
      streetAddress: '',
      area: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
    },
  });

  const onVerificationSubmit = (values: VerificationFormValues) => {
    console.log("Verification data:", values);
    toast({
      title: "Verification Submitted!",
      description: "Your information is being reviewed. This may take a few business days."
    });
    // In a real app, you'd send this to your backend
    setIsVerified(true); // Mocking successful submission
  }


  if (loading) {
    return (
      <div className="container py-12">
        <div className="mx-auto max-w-2xl space-y-8">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl space-y-8">
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

        {isVerified ? (
            <Card className="bg-green-50 border-green-200">
                <CardHeader className="flex-row items-center gap-4">
                    <ShieldCheck className="h-8 w-8 text-green-600" />
                    <div>
                        <CardTitle className="text-green-800 font-headline">You are Verified!</CardTitle>
                        <CardDescription className="text-green-700">You have full access to the TaskSync marketplace.</CardDescription>
                    </div>
                </CardHeader>
            </Card>
        ) : (
            <Card>
            <CardHeader>
                <CardTitle className="font-headline">Internal Verification</CardTitle>
                <CardDescription>
                    To ensure the safety of our community, please complete the following verification steps.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onVerificationSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="legalName"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Legal Full Name</FormLabel>
                          <FormControl>
                              <Input placeholder="Johnathan Doe" {...field} />
                          </FormControl>
                          <FormDescription>As it appears on your government-issued ID.</FormDescription>
                          <FormMessage />
                          </FormItem>
                      )}
                    />
                    
                    <Separator />
                    <FormLabel>Address</FormLabel>
                    <FormField
                      control={form.control}
                      name="streetAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Door no./St. name</FormLabel>
                          <FormControl>
                            <Input placeholder="1234 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid md:grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Area</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Downtown" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City/Town</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Seattle" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                       <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., WA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PIN Code</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 98101" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., USA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>


                    <Separator />
                    <FormLabel>Document & Photo Verification</FormLabel>

                    <div className="grid md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="govId"
                            render={({ field: { onChange, value, ...fieldProps } }) => (
                            <FormItem>
                                <FormLabel>Government-Provided ID</FormLabel>
                                <FormControl>
                                    <Input type="file" accept="image/*,.pdf" onChange={(e) => onChange(e.target.files?.[0])} {...fieldProps} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="userPhoto"
                            render={({ field: { onChange, value, ...fieldProps } }) => (
                            <FormItem>
                                <FormLabel>Your Photo</FormLabel>
                                <FormControl>
                                    <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files?.[0])} {...fieldProps} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    
                    <FormField
                        control={form.control}
                        name="selfie"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Live Selfie Verification</FormLabel>
                                <FormControl>
                                    <LiveSelfie onSelfieTaken={field.onChange} />
                                </FormControl>
                                <FormDescription>This helps us confirm you are who you say you are.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Separator />

                    <CardDescription>We'll send a one-time password to your phone and email to confirm them.</CardDescription>
                    
                     <div className="grid md:grid-cols-2 gap-8 items-start">
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input type="tel" placeholder="(555) 555-5555" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneOtp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone OTP</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Input placeholder="123456" {...field} />
                                        </FormControl>
                                        <Button type="button" variant="secondary">Send OTP</Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                     <div className="grid md:grid-cols-2 gap-8 items-start">
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <Input value={user.email || ''} readOnly disabled />
                        </FormItem>

                        <FormField
                            control={form.control}
                            name="emailOtp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email OTP</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Input placeholder="123456" {...field} />
                                        </FormControl>
                                        <Button type="button" variant="secondary">Send OTP</Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>


                    <Button type="submit" size="lg" className="w-full">
                        Submit for Verification
                    </Button>
                </form>
                </Form>
            </CardContent>
            </Card>
        )}

      </div>
    </div>
  );
}

export default withAuth(ProfilePage);
