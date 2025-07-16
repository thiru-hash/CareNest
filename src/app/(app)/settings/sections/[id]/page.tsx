"use client";

import { notFound } from 'next/navigation';
import { mockSections } from '@/lib/data';
import { TabManager } from '@/components/settings/TabManager';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Settings } from 'lucide-react';
import Link from 'next/link';
import { iconMap } from '@/lib/icon-map';
import { cn } from '@/lib/utils';

export default function SectionDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const section = mockSections.find((s) => s.id === id);

  if (!section) {
    notFound();
  }

  const Icon = iconMap[section.iconName];

  return (
    <div className="section-padding">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/settings">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Settings
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-3 mb-2">
          {Icon && <Icon className="h-6 w-6 text-gray-600" />}
          <h1 className="heading-1">{section.name}</h1>
          <Badge 
            variant={section.status === 'Active' ? 'default' : 'secondary'}
            className={cn(
              section.status === 'Active' 
                ? "bg-green-500/20 text-green-700 border-green-500/30" 
                : "bg-gray-500/20 text-gray-700 border-gray-500/30"
            )}
          >
            {section.status}
          </Badge>
        </div>
        <p className="body-text text-gray-600 dark:text-gray-400">
          View and manage section configuration
        </p>
      </div>

      <div className="space-y-6">
        {/* Section Details Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Section Details
                </CardTitle>
                <CardDescription>
                  Basic configuration for this section
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit Section
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Section Name</label>
                <p className="text-sm text-gray-900 dark:text-white mt-1">{section.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Path</label>
                <p className="text-sm text-gray-900 dark:text-white mt-1">{section.path}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Order</label>
                <p className="text-sm text-gray-900 dark:text-white mt-1">{section.order}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <div className="mt-1">
                  <Badge 
                    variant={section.status === 'Active' ? 'default' : 'secondary'}
                    className={cn(
                      section.status === 'Active' 
                        ? "bg-green-500/20 text-green-700 border-green-500/30" 
                        : "bg-gray-500/20 text-gray-700 border-gray-500/30"
                    )}
                  >
                    {section.status}
                  </Badge>
                </div>
              </div>
            </div>
            {section.description && (
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{section.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tab Management */}
        <TabManager section={section} />
      </div>
    </div>
  );
}
