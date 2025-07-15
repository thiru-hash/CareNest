'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, QrCode, Download, RefreshCw, CheckCircle, AlertTriangle, Smartphone, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TwoFactorPage() {
  const { toast } = useToast();
  const [twoFactorAuth, setTwoFactorAuth] = useState({
    required: 'Authentication App only',
    isEnabled: false,
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    backupCodes: ['12345678', '87654321', '11223344', '44332211', '55667788', '88776655', '99887766', '66778899']
  });

  const [verificationCode, setVerificationCode] = useState('');

  const handleEnableTwoFactor = () => {
    setTwoFactorAuth(prev => ({ ...prev, isEnabled: true }));
    toast({
      title: "Two-Factor Authentication Enabled",
      description: "Your account is now protected with 2FA.",
    });
  };

  const handleDisableTwoFactor = () => {
    setTwoFactorAuth(prev => ({ ...prev, isEnabled: false }));
    toast({
      title: "Two-Factor Authentication Disabled",
      description: "Your account is no longer protected with 2FA.",
    });
  };

  const handleDownloadQRCode = () => {
    toast({
      title: "QR Code Downloaded",
      description: "The QR code has been saved to your device.",
    });
  };

  const handleRefreshQRCode = () => {
    toast({
      title: "QR Code Refreshed",
      description: "A new QR code has been generated.",
    });
  };

  const handleVerifyCode = () => {
    if (verificationCode.length === 6) {
      toast({
        title: "Code Verified",
        description: "Your verification code has been accepted.",
      });
      setVerificationCode('');
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateBackupCodes = () => {
    toast({
      title: "Backup Codes Generated",
      description: "New backup codes have been generated. Please save them securely.",
    });
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="w-full h-full p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-left">Two-Factor Authentication</h1>
          <p className="text-muted-foreground text-left">Secure your account with additional authentication</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Setup Two-Factor Authentication
              </CardTitle>
              <CardDescription>Configure your 2FA preferences and setup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Required Two Factor Authentication:</Label>
                <Select value={twoFactorAuth.required} onValueChange={(value) => setTwoFactorAuth(prev => ({ ...prev, required: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Authentication App only">Authentication App only</SelectItem>
                    <SelectItem value="SMS only">SMS only</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable Two-Factor Authentication:</Label>
                  <p className="text-sm text-muted-foreground">Protect your account with 2FA</p>
                </div>
                <Switch
                  checked={twoFactorAuth.isEnabled}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleEnableTwoFactor();
                    } else {
                      handleDisableTwoFactor();
                    }
                  }}
                />
              </div>

              {twoFactorAuth.isEnabled && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-3">
                      Have you lost or replaced your device? Best enter a new QR code then:
                    </p>
                    <div className="flex justify-center mb-4">
                      <div className="w-32 h-32 bg-white border rounded-lg flex items-center justify-center">
                        <QrCode className="h-24 w-24 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={handleDownloadQRCode}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleRefreshQRCode}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Verify Setup
              </CardTitle>
              <CardDescription>Enter the code from your authenticator app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Verification Code:</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
              
              <Button onClick={handleVerifyCode} className="w-full">
                Verify Code
              </Button>

              {twoFactorAuth.isEnabled && (
                <div className="space-y-4">
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Backup Codes</Label>
                    <p className="text-sm text-muted-foreground">
                      Save these backup codes in a secure location. You can use them to access your account if you lose your device.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {twoFactorAuth.backupCodes.map((code, index) => (
                        <div key={index} className="p-2 bg-muted rounded text-center font-mono text-sm">
                          {code}
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={handleGenerateBackupCodes} className="mt-2">
                      Generate New Backup Codes
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Two-Factor Authentication Status</CardTitle>
            <CardDescription>Current security status of your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {twoFactorAuth.isEnabled ? (
                <>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-600">Two-Factor Authentication Active</h3>
                    <p className="text-sm text-muted-foreground">
                      Your account is protected with {twoFactorAuth.required}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  <div>
                    <h3 className="font-semibold text-yellow-600">Two-Factor Authentication Inactive</h3>
                    <p className="text-sm text-muted-foreground">
                      Enable 2FA to add an extra layer of security to your account
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Set Up Two-Factor Authentication</CardTitle>
            <CardDescription>Follow these steps to secure your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="font-semibold">Download an Authenticator App</h4>
                  <p className="text-sm text-muted-foreground">
                    Install Google Authenticator, Microsoft Authenticator, or any other TOTP app on your mobile device.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="font-semibold">Scan the QR Code</h4>
                  <p className="text-sm text-muted-foreground">
                    Use your authenticator app to scan the QR code displayed above.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="font-semibold">Enter the Verification Code</h4>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code from your authenticator app to verify the setup.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <h4 className="font-semibold">Save Backup Codes</h4>
                  <p className="text-sm text-muted-foreground">
                    Download and securely store your backup codes in case you lose access to your authenticator app.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 