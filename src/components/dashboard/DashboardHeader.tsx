'use client';

import { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

export function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Welcome to CareNest
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
            Your comprehensive care management dashboard
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Date */}
          <div className="flex items-center gap-2 p-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50">
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
              {mounted ? currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'Loading...'}
            </span>
          </div>
          
          {/* Time */}
          <div className="flex items-center gap-2 p-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50">
            <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
              {mounted ? currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: true 
              }) : '--:--:--'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 