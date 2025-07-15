import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Waves, Shield, Users } from 'lucide-react';
import { switchUser } from '@/app/actions';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-primary text-primary-foreground p-3 rounded-full">
                <Waves className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">CareNest Platform</CardTitle>
            <CardDescription>Care Management System</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm font-medium text-muted-foreground mb-4">
                Select your role to log in:
              </div>
              
              <form className="space-y-3">
                <Button type="submit" className="w-full" formAction={switchUser.bind(null, 'staff-admin')}>
                  <Shield className="h-4 w-4 mr-2" />
                  👑 System Admin
                </Button>
                
                <Button type="submit" variant="outline" className="w-full" formAction={switchUser.bind(null, 'staff-1')}>
                  <Users className="h-4 w-4 mr-2" />
                  👷 Support Worker
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
