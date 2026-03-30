"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Kanban, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/60 via-background to-teal-50/30 px-4">
      <div className="fixed top-20 left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-1/4 w-80 h-80 bg-teal-200/15 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md relative rounded-2xl">
        <CardHeader className="text-center pb-2">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-5">
            <div className="w-11 h-11 gradient-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20">
              <Kanban className="w-6 h-6 text-white" />
            </div>
          </Link>
          <CardTitle className="text-2xl font-display">Create your account</CardTitle>
          <CardDescription>Get started with PlanForge for free</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <div className="bg-destructive/5 text-destructive text-sm p-3.5 rounded-xl">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name" className="font-medium">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">Email</Label>
              <Input id="email" name="email" type="email" placeholder="john@example.com" required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Min 6 characters" required minLength={6} className="rounded-xl" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
