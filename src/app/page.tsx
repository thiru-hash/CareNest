import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Waves } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { switchUser } from '@/app/actions';
import { mockStaff } from '@/lib/data';

export default function LoginPage() {
  const adminUser = mockStaff.find(u => u.role === 'System Admin');
  const workerUser = mockStaff.find(u => u.role === 'Support Worker');

  if (!adminUser || !workerUser) {
    return <div>Error: Test users not found.</div>;
  }
  
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
          <CardDescription>Select a role to log in.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Button type="submit" className="w-full" formAction={switchUser.bind(null, adminUser.id)}>
                Login as System Admin
            </Button>
             <Button type="submit" variant="secondary" className="w-full" formAction={switchUser.bind(null, workerUser.id)}>
                Login as Support Worker
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col items-start text-sm text-muted-foreground pt-4">
            <Separator className="mb-4" />
            <p className="text-xs italic">
              Note: Login is simulated using cookies. This allows you to test the application from different user perspectives.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
