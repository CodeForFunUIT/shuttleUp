"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const { error } = await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || "Failed to create account");
      return;
    }

    toast.success("Account created successfully!");
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.16))] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white">
        <CardHeader className="space-y-2 text-center pb-8 pt-8">
          <CardTitle className="text-3xl font-display font-bold tracking-tight">Create an Account</CardTitle>
          <CardDescription className="text-base">
            Join ShuttleUp to host sessions, manage bookings, and track your ELO.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="h-12"
                        name="name"
                        autoComplete="name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        {...field}
                        className="h-12"
                        type="email"
                        name="email"
                        autoComplete="email"
                        spellCheck={false}
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
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="h-12"
                        name="password"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                    Creating account…
                  </>
                ) : "Create Account"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center pb-8 border-t pt-6 bg-slate-50/50 rounded-b-xl">
          <div className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-500 hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
