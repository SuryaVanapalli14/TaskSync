'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  AuthError,
} from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const formSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
    email: z.string().email('Invalid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string(),
    agreement: z
      .boolean()
      .refine((val) => val === true, {
        message: 'You must accept the user agreement and license.',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof formSchema>;

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.6 1.6-4.66 1.6-3.86 0-6.99-3.14-6.99-7s3.13-7 6.99-7c2.09 0 3.63.79 4.61 1.75l2.76-2.76C19.33 3.79 16.38 3 12.48 3 7.03 3 3 7.03 3 12s4.03 9 9.48 9c2.82 0 5.12-1.02 6.82-2.72 1.77-1.75 2.34-4.25 2.34-6.49 0-.67-.05-1.32-.16-1.96h-9.18z"/>
    </svg>
);


export default function RegisterPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreement: false,
    },
  });

  const handleRegister = async (values: FormValues) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      await updateProfile(userCredential.user, {
        displayName: `${values.firstName} ${values.lastName}`,
      });
      
      toast({
        title: 'Registration Successful',
        description: "Welcome! You can now log in.",
      });
      form.reset();
      router.push('/login');
    } catch (error: any) {
      let description = 'An unexpected error occurred. Please try again.';
      if (error instanceof AuthError) {
        if (error.code === 'auth/email-already-in-use') {
          description = 'This email address is already in use. Please use a different email or log in.';
        }
      }
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: description,
      });
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Sign Up Successful',
        description: 'Welcome! Please complete your profile verification.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign Up Failed',
        description: 'There was a problem signing up with Google. Please try again.',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="mx-auto max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-xl font-headline">Create an Account</CardTitle>
          <CardDescription>
            Join TaskSync today to find help or get work done.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegister)} className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreement"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                     <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Agree to our terms and conditions
                      </FormLabel>
                      <FormDescription>
                        You agree to our User Agreement, Privacy Policy, and License.
                      </FormDescription>
                       <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating account...' : 'Create an account'}
              </Button>
            </form>
          </Form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignUp}>
            <GoogleIcon />
            Sign up with Google
          </Button>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
