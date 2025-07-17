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

  return (
    <div className="space-y-3:space-y-4">
      {/* Profile Picture Section */}
      <div className="text-center">
        <div className="relative mx-auto mb-3 group">
          <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-16 lg:h-16 xl:h-18 rounded-2xl bg-purple-100 dark:bg-purple-900/20 p-1 shadow-lg">
            <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20">
              <Avatar className="h-full w-full rounded-xl border-2 border-white dark:border-gray-700">
                <AvatarImage 
                  src={currentImage} 
                  alt={client.name}
                  className="object-cover"
                  onError={(e) => {
                    console.log('Image failed to load:', currentImage);
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', currentImage);
                  }}
                />
                <AvatarFallback className="text-sm sm:text-base lg:text-sm xl:text-base font-semibold bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-700 text-purple-800 dark:text-purple-200">
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
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full h-6 w-6 sm:h-7 sm:w-7 lg:h-6 lg:w-6 xl:h-7 xl:w-7 p-0 shadow-lg"
                onClick={handlePhotoChange}
              >
                <Camera className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-3 lg:w-3 xl:h-3.5" />
              </Button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
        
        <h2 className="text-base sm:text-lg lg:text-base xl:text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{client.name}</h2>
        <p className="text-xs sm:text-sm lg:text-xs xl:text-sm text-gray-500 dark:text-gray-400">Client</p>
      </div>

      {/* Contact Information */}
      <div className="space-y-2pace-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-gray-500 dark:text-gray-400">Email</span>
            <a href={`mailto:${client.email}`} className="text-xs sm:text-sm lg:text-xs xl:text-sm font-medium text-blue-600 hover:underline break-all max-w-[55%]">
              {client.email}
            </a>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-gray-500 dark:text-gray-400">Phone</span>
            <a href={`tel:${client.phone}`} className="text-xs sm:text-sm lg:text-xs xl:text-sm font-medium text-blue-600 hover:underline">
              {client.phone}
            </a>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-gray-500 dark:text-gray-400">Date of birth</span>
            <span className="text-xs sm:text-sm lg:text-xs xl:text-sm font-medium">{client.dateOfBirth}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-gray-500 dark:text-gray-400">Home address</span>
            <span className="text-xs sm:text-sm lg:text-xs xl:text-sm font-medium text-right max-w-[55%]">{client.address}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-gray-500 dark:text-gray-400">Insurance</span>
            <span className="text-xs sm:text-sm lg:text-xs xl:text-sm font-medium">{client.insurance}</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm lg:text-xs xl:text-sm font-medium">Tags</span>
          {mode === 'edit' && (
            <Button variant="ghost" size="sm" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5 p-0">
              <Plus className="h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-2 lg:w-2 xl:h-2.5" />
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {client.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Assigned Experts */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm lg:text-xs xl:text-sm font-medium">Assigned experts</span>
          {mode === 'edit' && (
            <Button variant="ghost" size="sm" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5 p-0">
              <Edit className="h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-2 lg:w-2 xl:h-2.5" />
            </Button>
          )}
        </div>
        <div className="flex items-center text-xs sm:text-sm lg:text-xs xl:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">
          <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-3 lg:w-3 xl:h-3.5" />
          <span>View assigned experts</span>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm lg:text-xs xl:text-sm font-medium">Notes</span>
          {mode === 'edit' && (
            <Button variant="ghost" size="sm" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5 p-0">
              <Edit className="h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-2 lg:w-2 xl:h-2.5" />
            </Button>
          )}
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 sm:p-2.5 lg:p-2 xl:p-2.5">
          <p className="text-xs sm:text-sm lg:text-xs xl:text-sm text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">{client.notes}</p>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{client.noteAuthor}</span>
            <span>{client.noteDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 