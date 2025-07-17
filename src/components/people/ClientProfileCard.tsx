"use client";
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Plus, ChevronRight, Camera } from "lucide-react";

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

  const currentImage = selectedImage || client.photo;
  const shortNote = client.notes.length > 100 ? client.notes.substring(0, 100) + '...' : client.notes;
  const displayNote = showFullNote ? client.notes : shortNote;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-4 sm:space-y-6">
        {/* Profile Picture Section */}
        <div className="text-center">
          <div className="relative mx-auto mb-3 group">
            <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 24 xl:h-24 rounded-2xl bg-purple-100 dark:bg-purple-900/20 p-1 shadow-lg">
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
                  <AvatarFallback className="text-sm sm:text-base lg:text-lg xl:text-xl font-semibold bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-700 text-purple-800 dark:text-purple-200">
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
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-8 lg:w-8 xl:h-10 xl:w-10 p-0 shadow-lg cursor-pointer"
                  onClick={handlePhotoChange}
                  aria-label="Change profile photo"
                >
                  <Camera className="h-4 w-4 sm:h-5 sm:w-5 lg:h-4 lg:w-4 xl:h-5" />
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
          
          <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{client.name}</h2>
          <p className="text-sm sm:text-base lg:text-sm xl:text-base text-gray-500 dark:text-gray-400">Client</p>
        </div>

        {/* Contact Information */}
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <span className="text-gray-500 dark:text-gray-400 mb-1">Email</span>
              <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline break-all max-w-full sm:max-w-[60%]">
                {client.email}
              </a>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <span className="text-gray-500 dark:text-gray-400 mb-1">Phone</span>
              <a href={`tel:${client.phone}`} className="text-blue-600 hover:underline font-medium">
                {client.phone}
              </a>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <span className="text-gray-500 dark:text-gray-400 mb-1">Date of birth</span>
              <span className="font-medium">{client.dateOfBirth}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <span className="text-gray-500 dark:text-gray-400 mb-1 sm:mb-0">Home address</span>
              <span className="font-medium text-right max-w-full sm:max-w-[60%]">{client.address}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <span className="text-gray-500 dark:text-gray-400 sm:mb-0">Insurance</span>
              <span className="font-medium">{client.insurance}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-medium">Tags</span>
            {mode === 'edit' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                aria-label="Add new tag"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {client.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs sm:text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
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
            <span className="text-sm sm:text-base font-medium">Assigned experts</span>
            {mode === 'edit' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                aria-label="Edit assigned experts"
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
          <div className="flex items-center text-sm sm:text-base text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>View assigned experts</span>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-medium">Notes</span>
            {mode === 'edit' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                aria-label="Edit notes"
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
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
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <span>{client.noteAuthor}</span>
              <span>{client.noteDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 