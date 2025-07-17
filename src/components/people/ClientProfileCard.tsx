"use client";
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Plus, ChevronRight, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ClientProfileCardProps {
  client: {
    id: string;
    name: string;
    photo: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    insurance: string;
    tags: string[];
    notes: string;
    noteAuthor: string;
    noteDate: string;
  };
  mode?: 'view' | 'edit';
}

export default function ClientProfileCard({ client, mode = 'view' }: ClientProfileCardProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showFullNote, setShowFullNote] = useState(false);
  const [formData, setFormData] = useState({
    name: client.name,
    email: client.email,
    phone: client.phone,
    dateOfBirth: client.dateOfBirth,
    address: client.address,
    insurance: client.insurance,
    notes: client.notes
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      console.log('File selected:', file);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const currentImage = selectedImage || client.photo;
  const shortNote = client.notes.length > 100 ? client.notes.substring(0, 100) + '...' : client.notes;
  const displayNote = showFullNote ? client.notes : shortNote;

  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <div className="text-center">
        <div className="relative mx-auto mb-3 group">
          <div className="w-20 h-20 rounded-2xl bg-purple-100 dark:bg-purple-900/20 p-1 shadow-lg">
            <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20">
              <Avatar className="h-full w-full rounded-xl border-2 border-white dark:border-gray-700">
                <AvatarImage 
                  src={currentImage} 
                  alt={`Profile photo of ${client.name}`}
                  className="object-cover"
                  onError={(e) => {
                    console.log('Image failed to load:', currentImage);
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', currentImage);
                  }}
                />
                <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-700 text-purple-800 dark:text-purple-200">
                  {client.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          {mode === 'edit' && (
            <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full h-8 w-8 p-0 shadow-lg cursor-pointer"
                onClick={handlePhotoChange}
                aria-label="Change profile photo"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            aria-label="Upload profile photo"
          />
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{client.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Client</p>
      </div>

      {/* Client Information Form - ONE PER LINE */}
      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          {mode === 'view' ? (
            <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.name}</p>
          ) : (
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="Enter full name"
            />
          )}
        </div>

        {/* Email - ONE LINE */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          {mode === 'view' ? (
            <a href={`mailto:${formData.email}`} className="text-sm text-blue-600 hover:underline">
              {formData.email}
            </a>
          ) : (
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              placeholder="Enter email address"
            />
          )}
        </div>

        {/* Phone - ONE LINE */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          {mode === 'view' ? (
            <a href={`tel:${formData.phone}`} className="text-sm text-blue-600 hover:underline font-medium">
              {formData.phone}
            </a>
          ) : (
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              placeholder="Enter phone number"
            />
          )}
        </div>

        {/* Date of Birth - ONE LINE */}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          {mode === 'view' ? (
            <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.dateOfBirth}</p>
          ) : (
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
            />
          )}
        </div>

        {/* Address - ONE LINE */}
        <div className="space-y-2">
          <Label htmlFor="address">Home Address</Label>
          {mode === 'view' ? (
            <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.address}</p>
          ) : (
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              placeholder="Enter full address"
              rows={3}
            />
          )}
        </div>

        {/* Insurance - ONE LINE */}
        <div className="space-y-2">
          <Label htmlFor="insurance">Insurance Status</Label>
          {mode === 'view' ? (
            <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.insurance}</p>
          ) : (
            <Select value={formData.insurance} onValueChange={(value) => handleFieldChange('insurance', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select insurance status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Tags</Label>
            {mode === 'edit' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                aria-label="Add new tag"
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {client.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {tag}
              </Badge>
            ))}
            {mode === 'edit' && (
              <button className="text-sm text-blue-600 hover:underline">
                + Add Tag
              </button>
            )}
          </div>
        </div>

        {/* Assigned Experts */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Assigned Experts</Label>
            {mode === 'edit' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                aria-label="Edit assigned experts"
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">
            <ChevronRight className="h-4 w-4" />
            <span>View assigned experts</span>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Notes</Label>
            {mode === 'edit' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                aria-label="Edit notes"
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            {mode === 'view' ? (
              <>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                  {displayNote}
                  {client.notes.length > 100 && (
                    <button 
                      onClick={() => setShowFullNote(!showFullNote)}
                      className="text-blue-600 hover:underline ml-1"
                    >
                      {showFullNote ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{client.noteAuthor}</span>
                  <span>{client.noteDate}</span>
                </div>
              </>
            ) : (
              <Textarea
                value={formData.notes}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                placeholder="Enter notes about the client"
                rows={4}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 