"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Users, Shield } from 'lucide-react';

interface ImpersonationBannerProps {
  impersonatedUser: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  onStopImpersonating: () => void;
}

export function ImpersonationBanner({ impersonatedUser, onStopImpersonating }: ImpersonationBannerProps) {
  return (
    <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-orange-600" />
          <div className="flex-1">
            <AlertDescription className="text-orange-800 dark:text-orange-200">
              <span className="font-semibold">Impersonating:</span> {impersonatedUser.name} ({impersonatedUser.email}) - {impersonatedUser.role}
            </AlertDescription>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onStopImpersonating}
          className="text-orange-700 hover:text-orange-800 hover:bg-orange-100 dark:text-orange-300 dark:hover:text-orange-200 dark:hover:bg-orange-900/30"
        >
          <X className="h-4 w-4 mr-2" />
          Stop Impersonating
        </Button>
      </div>
    </Alert>
  );
} 