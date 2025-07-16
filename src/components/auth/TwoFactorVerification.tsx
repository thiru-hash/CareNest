"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
  EyeOff,
  Clock,
  Lock
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TwoFactorVerificationProps {
  user: {
    id: string;
    username: string;
    email: string;
  };
  isFirstTimeSetup: boolean;
  onVerificationComplete: (success: boolean) => void;
  onCancel: () => void;
}

export function TwoFactorVerification({ 
  user, 
  isFirstTimeSetup, 
  onVerificationComplete, 
  onCancel 
}: TwoFactorVerificationProps) {
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [qrCode, setQrCode] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [showSecret, setShowSecret] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<Date | null>(null);

  // Generate QR code and secret key on component mount for first-time setup
  useEffect(() => {
    if (isFirstTimeSetup) {
      generateTwoFactorSecret();
    }
  }, [isFirstTimeSetup]);

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
        setAttempts(0);
        toast({
          title: "2FA Setup Complete",
          description: "Two-factor authentication has been successfully set up.",
        });
        onVerificationComplete(true);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          setIsLocked(true);
          setLockoutTime(new Date(Date.now() + 15 * 60 * 1000)); // 15 minutes
          toast({
            title: "Account Temporarily Locked",
            description: "Too many failed attempts. Please try again in 15 minutes.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Invalid Code",
            description: `The verification code is incorrect. ${3 - newAttempts} attempts remaining.`,
            variant: "destructive"
          });
        }
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

  const isLockoutExpired = () => {
    if (!lockoutTime) return false;
    return new Date() > lockoutTime;
  };

  if (isLocked && !isLockoutExpired()) {
    const remainingMinutes = Math.ceil((lockoutTime!.getTime() - new Date().getTime()) / (1000 * 60));
    
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Lock className="h-5 w-5" />
            Account Temporarily Locked
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Too many failed verification attempts. Your account is temporarily locked.
            </AlertDescription>
          </Alert>
          
          <div className="text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              You can try again in <strong>{remainingMinutes} minutes</strong>
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isSetupComplete) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Two-Factor Authentication Enabled
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Two-factor authentication has been successfully set up for your account.
            </AlertDescription>
          </Alert>
          
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>What happens next:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>You'll be redirected to the dashboard</li>
              <li>On future logins, you'll need to enter a 6-digit code</li>
              <li>Keep your authenticator app secure</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => onVerificationComplete(true)} className="flex-1">
              Continue to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isFirstTimeSetup) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Set Up Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 'setup' ? (
            <>
              <Alert>
                <Smartphone className="h-4 w-4" />
                <AlertDescription>
                  Two-factor authentication adds an extra layer of security to your account.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Step 1: Install an Authenticator App</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Download one of these apps on your mobile device:
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">Google Authenticator</Badge>
                    <Badge variant="outline">Microsoft Authenticator</Badge>
                    <Badge variant="outline">Authy</Badge>
                    <Badge variant="outline">1Password</Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Step 2: Scan QR Code or Enter Secret Key</Label>
                  <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                    <div className="text-center">
                      <div className="w-48 h-48 mx-auto bg-white border rounded-lg flex items-center justify-center">
                        <QrCode className="h-32 w-32 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">QR Code (Mock)</p>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Secret Key:</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type={showSecret ? "text" : "password"}
                            value={secretKey}
                            readOnly
                            className="font-mono text-sm"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowSecret(!showSecret)}
                          >
                            {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={copySecretKey}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={copyQrCode}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy QR URL
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={generateTwoFactorSecret}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Generate New
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Step 3: Verify Setup</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Once you've scanned the QR code or entered the secret key in your authenticator app, 
                    click the button below to proceed to verification.
                  </p>
                  <Button 
                    onClick={() => setStep('verify')} 
                    className="mt-2"
                  >
                    Proceed to Verification
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Enter the 6-digit code from your authenticator app to verify the setup.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="text-center text-lg font-mono tracking-widest"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the 6-digit code displayed in your authenticator app
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleVerifyCode} 
                    disabled={verificationCode.length !== 6 || isVerifying}
                    className="flex-1"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify Code'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setStep('setup')}
                  >
                    Back
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    <strong>Demo Mode:</strong> Use code <code className="bg-gray-100 px-1 rounded">123456</code> to simulate successful verification
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  // Regular 2FA verification (not first-time setup)
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Two-Factor Authentication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Smartphone className="h-4 w-4" />
          <AlertDescription>
            Please enter the 6-digit code from your authenticator app to continue.
          </AlertDescription>
        </Alert>

        <div>
          <Label htmlFor="verificationCode">Verification Code</Label>
          <Input
            id="verificationCode"
            type="text"
            placeholder="Enter 6-digit code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            className="text-center text-lg font-mono tracking-widest"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the 6-digit code displayed in your authenticator app
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleVerifyCode} 
            disabled={verificationCode.length !== 6 || isVerifying}
            className="flex-1"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify & Continue'
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            <strong>Demo Mode:</strong> Use code <code className="bg-gray-100 px-1 rounded">123456</code> to simulate successful verification
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 