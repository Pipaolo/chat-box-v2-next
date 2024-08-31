"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormSchema } from "../_schemas/login-form.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useToast } from "~/components/ui/use-toast";

export function LoginForm() {
  const { toast } = useToast();
  const signInMutation = useMutation({
    mutationKey: ["loginByEmail"],
    mutationFn: async (input: LoginFormSchema) => {
      const response = await signIn("credentials", {
        email: input.email,
        password: input.password,
        redirect: false,
      });

      return response;
    },
  });

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormSchema) => {
    signInMutation.mutate(data, {
      onSuccess: (data) => {
        if (!data) {
          return;
        }
        if (data.error) {
          toast({
            title: "Error",
            description: "Invalid email or password",
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Success",
          description: "You have successfully logged in",
        });
      },
      onError: (error) => {
        toast({
          title: "An error occurred",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, console.error)}
            className="grid gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel> Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="m@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <div className="flex items-center">
                    <FormLabel className="flex items-center">
                      Password
                    </FormLabel>
                    <Link
                      href="#"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={signInMutation.isPending}
              type="submit"
              className="w-full"
            >
              {signInMutation.isPending ? "Loading..." : "Login"}
            </Button>
            <Button
              disabled={signInMutation.isPending}
              variant="outline"
              className="w-full"
            >
              Login with Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
