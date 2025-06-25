import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Waves } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-primary text-primary-foreground p-3 rounded-full">
              <Waves className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">CareNest Companion</CardTitle>
          <CardDescription>Welcome back! Please sign in to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" asChild>
              <Link href="/dashboard">Login</Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start text-sm text-muted-foreground pt-4">
            <Separator className="mb-4" />
            <p className="font-semibold text-foreground mb-2">Test Credentials</p>
            <p><span className="font-medium">Admin:</span> admin@carenest.com</p>
            <p><span className="font-medium">Support Worker:</span> jane.d@carenest.com</p>
            <p className="mt-2 text-xs">(Password: any)</p>
            <p className="mt-2 text-xs italic">Note: Login is simulated. To switch users, ask me to log you in as the desired role.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
