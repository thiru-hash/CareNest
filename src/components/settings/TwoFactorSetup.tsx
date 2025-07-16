"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Shield, 
  Smartphone, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  QrCode,
  RefreshCw,
  Copy,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TwoFactorSetupProps {
  user: {
    id: string;
    username: string;
    email: string;
  };
  onSetupComplete: (enabled: boolean) => void;
  onCancel: () => void;
}

export function TwoFactorSetup({ user, onSetupComplete, onCancel }: TwoFactorSetupProps) {
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [qrCode, setQrCode] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [showSecret, setShowSecret] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  // Generate QR code and secret key on component mount
  useEffect(() => {
    generateTwoFactorSecret();
  }, []);

  const generateTwoFactorSecret = () => {
    // In a real app, this would call an API to generate a secret
    const mockSecret = generateRandomSecret();
    const mockQrCode = `otpauth://totp/CareNest:${user.email}?secret=${mockSecret}&issuer=CareNest`;
    
    setSecretKey(mockSecret);
    setQrCode(mockQrCode);
  };

  const generateRandomSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, this would verify the code with the server
      const isValid = verificationCode === '123456'; // Mock validation
      
      if (isValid) {
        setIsSetupComplete(true);
        toast({
          title: "2FA Setup Complete",
          description: "Two-factor authentication has been successfully enabled.",
        });
        onSetupComplete(true);
      } else {
        toast({
          title: "Invalid Code",
          description: "The verification code is incorrect. Please try again.",
          variant: "destructive"
        });
        setVerificationCode('');
      }
      setIsVerifying(false);
    }, 1000);
  };

  const copySecretKey = () => {
    navigator.clipboard.writeText(secretKey);
    toast({
      title: "Secret Key Copied",
      description: "The secret key has been copied to your clipboard.",
    });
  };

  const copyQrCode = () => {
    navigator.clipboard.writeText(qrCode);
    toast({
      title: "QR Code URL Copied",
      description: "The QR code URL has been copied to your clipboard.",
    });
  };

  if (isSetupComplete) {
    return (
      <>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Two-Factor Authentication Configured
          </DialogTitle>
          <DialogDescription>
            Two-factor authentication has been enabled for {user.username}. The user will complete setup on their next login.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Two-factor authentication has been enabled for {user.username}.
            </AlertDescription>
          </Alert>
          
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>What happens next:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>User will be prompted to set up 2FA on their next login</li>
              <li>They'll need to scan the QR code with their authenticator app</li>
              <li>After setup, they'll enter a 6-digit code for each login</li>
              <li>If they don't complete setup within the grace period, their account may be restricted</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => onSetupComplete(true)} className="flex-1">
              Complete Configuration
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Configure Two-Factor Authentication
        </DialogTitle>
        <DialogDescription>
          Enable 2FA for {user.username}. This will require the user to set up 2FA on their next login.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        <Alert>
          <Smartphone className="h-4 w-4" />
          <AlertDescription>
            <strong>Admin Configuration:</strong> You are enabling 2FA for {user.username}. The user will complete the actual setup process on their next login.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">2FA Method</Label>
            <p className="text-sm text-gray-600 mt-1">
              Choose the 2FA method that will be required for this user:
            </p>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">Authenticator App (Recommended)</Badge>
              <Badge variant="outline">SMS</Badge>
              <Badge variant="outline">Both</Badge>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Enforcement Level</Label>
            <p className="text-sm text-gray-600 mt-1">
              Choose how strictly 2FA will be enforced:
            </p>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <input type="radio" id="required" name="enforcement" value="required" defaultChecked />
                <Label htmlFor="required" className="text-sm">Required - User must set up 2FA on next login</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="optional" name="enforcement" value="optional" />
                <Label htmlFor="optional" className="text-sm">Optional - User can choose to set up 2FA</Label>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Grace Period</Label>
            <p className="text-sm text-gray-600 mt-1">
              Number of days the user has to complete 2FA setup before restrictions apply:
            </p>
            <Input
              type="number"
              defaultValue="7"
              min="1"
              max="30"
              className="mt-2 w-24"
            />
            <span className="text-sm text-gray-500 ml-2">days</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => setIsSetupComplete(true)} 
            className="flex-1"
          >
            Enable 2FA for User
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>

        <Alert className="border-blue-200 bg-blue-50">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Note:</strong> The user will receive an email notification about 2FA setup requirements. 
            They will be guided through the setup process on their next login.
          </AlertDescription>
        </Alert>
      </div>
    </>
  );
} 