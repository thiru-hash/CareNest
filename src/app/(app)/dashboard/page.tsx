import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Calendar, TrendingUp, Users, Activity, ArrowRight, Clock, MapPin, DollarSign, Shield } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard - CareNest',
  description: 'Your CareNest dashboard for managing shifts, notices, and more.',
};

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
      <main className="w-full h-full p-3 sm:p-4 md:p-6 lg:p-8">
        <DashboardHeader />

        <div className="
          grid gap-4 sm:gap-6 md:gap-8 lg:gap-10
          grid-cols-1 
          md:grid-cols-2 
          xl:grid-cols-3 
          2xl:grid-cols-4
          w-full
          auto-rows-fr
        ">
          {/* Upcoming Shifts Card */}
          <div className="w-full h-full group xl:col-span-2 2xl:col-span-1">
            <div className="
              bg-white/90 dark:bg-gray-800/90 backdrop-blur-md
              border border-white/20 dark:border-gray-700/50
              rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50
              hover:shadow-2xl hover:shadow-gray-300/50 dark:hover:shadow-gray-800/50
              transition-all duration-500 ease-out
              h-full overflow-hidden
              relative
            ">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50 dark:from-blue-900/10 dark:via-transparent dark:to-indigo-900/10"></div>
              <div className="relative z-10 h-full p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Shifts</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your next scheduled shifts</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center w-12">
                        <div className="font-bold text-lg text-gray-900 dark:text-white">15</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Dec</div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">Morning Support</p>
                        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4" />
                          <span>08:00 - 16:00</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>Oakwood Residence</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-green-600 dark:text-green-400">JD</span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                      <Clock className="mr-2 h-4 w-4 inline" /> Clock In & Start Shift
                    </button>
                  </div>
                  
                  <div className="p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center w-12">
                        <div className="font-bold text-lg text-gray-900 dark:text-white">16</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Dec</div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">Evening Support</p>
                        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4" />
                          <span>16:00 - 00:00</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>Maple Creek Villa</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-green-600 dark:text-green-400">JD</span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full mt-3 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors">
                      <Clock className="mr-2 h-4 w-4 inline" /> Clock In & Start Shift
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notice Board Card */}
          <div className="w-full h-full group">
            <div className="
              bg-white/90 dark:bg-gray-800/90 backdrop-blur-md
              border border-white/20 dark:border-gray-700/50
              rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50
              hover:shadow-2xl hover:shadow-gray-300/50 dark:hover:shadow-gray-800/50
              transition-all duration-500 ease-out
              h-full overflow-hidden
              relative
            ">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-transparent to-emerald-50/50 dark:from-green-900/10 dark:via-transparent dark:to-emerald-900/10"></div>
              <div className="relative z-10 h-full p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-xl">
                    <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notice Board</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Important announcements</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                        <Activity className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">System Maintenance</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Scheduled maintenance on Dec 20th from 2-4 AM</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                          <span>Admin User</span>
                          <span>•</span>
                          <span>Dec 14, 2024</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                        <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">New Training Module</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Updated safety protocols available for review</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                          <span>HR Manager</span>
                          <span>•</span>
                          <span>Dec 13, 2024</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Finance Overview Card */}
          <div className="w-full h-full group xl:col-span-3 2xl:col-span-2">
            <div className="
              bg-white/90 dark:bg-gray-800/90 backdrop-blur-md
              border border-white/20 dark:border-gray-700/50
              rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50
              hover:shadow-2xl hover:shadow-gray-300/50 dark:hover:shadow-gray-800/50
              transition-all duration-500 ease-out
              h-full overflow-hidden
              relative
            ">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-pink-50/50 dark:from-purple-900/10 dark:via-transparent dark:to-pink-900/10"></div>
              <div className="relative z-10 h-full p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-xl">
                    <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Finance Overview</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Key financial metrics</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Total Invoiced</h4>
                      <DollarSign className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">$45,230</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Across all clients</p>
                  </div>
                  
                  <div className="p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Total Overdue</h4>
                      <DollarSign className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">$3,450</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Invoices &gt;30 days past due</p>
                  </div>
                  
                  <div className="p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Next Payroll</h4>
                      <Users className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">$12,800</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">For pending payroll runs</p>
                  </div>
                  
                  <div className="p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Next Invoice</h4>
                      <Calendar className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">$2,400</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Due on Dec 20</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Renewals Card */}
          <div className="w-full h-full group 2xl:col-span-2">
            <div className="
              bg-white/90 dark:bg-gray-800/90 backdrop-blur-md
              border border-white/20 dark:border-gray-700/50
              rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50
              hover:shadow-2xl hover:shadow-gray-300/50 dark:hover:shadow-gray-800/50
              transition-all duration-500 ease-out
              h-full overflow-hidden
              relative
            ">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-amber-50/50 dark:from-orange-900/10 dark:via-transparent dark:to-amber-900/10"></div>
              <div className="relative z-10 h-full p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-xl">
                    <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Compliance Renewals</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Items needing attention</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-white/50 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                    <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                      <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">JD</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">First Aid Certificate</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Jane Doe</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Dec 20, 2024</p>
                      <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 rounded-full mt-1">Overdue</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-white/50 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
                      <Shield className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">JD</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">CPR Certification</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Jane Doe</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Dec 25, 2024</p>
                      <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 rounded-full mt-1">Expiring Soon</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="w-full h-full group">
            <div className="
              bg-white/90 dark:bg-gray-800/90 backdrop-blur-md
              border border-white/20 dark:border-gray-700/50
              rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50
              hover:shadow-2xl hover:shadow-gray-300/50 dark:hover:shadow-gray-800/50
              transition-all duration-500 ease-out
              h-full overflow-hidden
              relative
            ">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 via-transparent to-cyan-50/50 dark:from-teal-900/10 dark:via-transparent dark:to-cyan-900/10"></div>
              <div className="relative z-10 h-full p-6 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
                <div className="space-y-4 flex-grow flex flex-col justify-around">
                  <Link href="/staff" className="
                    flex items-center justify-between p-4
                    bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20
                    border border-green-200/50 dark:border-green-700/50
                    rounded-2xl hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30
                    transition-all duration-300 ease-out
                    group/item
                    shadow-lg shadow-green-200/50 dark:shadow-green-900/20
                    hover:shadow-xl hover:shadow-green-300/50 dark:hover:shadow-green-900/30
                  ">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-xl group-hover/item:bg-green-200 dark:group-hover/item:bg-green-900/60 transition-colors duration-300 flex-shrink-0">
                        <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">Staff Management</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-green-600 dark:text-green-400 group-hover/item:translate-x-1 transition-transform duration-300 flex-shrink-0 ml-2" />
                  </Link>
                  
                  <Link href="/finance" className="
                    flex items-center justify-between p-4
                    bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20
                    border border-blue-200/50 dark:border-blue-700/50
                    rounded-2xl hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30
                    transition-all duration-300 ease-out
                    group/item
                    shadow-lg shadow-blue-200/50 dark:shadow-blue-900/20
                    hover:shadow-xl hover:shadow-blue-300/50 dark:hover:shadow-blue-900/30
                  ">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl group-hover/item:bg-blue-200 dark:group-hover/item:bg-blue-900/60 transition-colors duration-300 flex-shrink-0">
                        <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">Finance</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover/item:translate-x-1 transition-transform duration-300 flex-shrink-0 ml-2" />
                  </Link>
                  
                  <Link href="/roster" className="
                    flex items-center justify-between p-4
                    bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20
                    border border-purple-200/50 dark:border-purple-700/50
                    rounded-2xl hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30
                    transition-all duration-300 ease-out
                    group/item
                    shadow-lg shadow-purple-200/50 dark:shadow-purple-900/20
                    hover:shadow-xl hover:shadow-purple-300/50 dark:hover:shadow-purple-900/30
                  ">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-xl group-hover/item:bg-purple-200 dark:group-hover/item:bg-purple-900/60 transition-colors duration-300 flex-shrink-0">
                        <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">Roster</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-purple-600 dark:text-purple-400 group-hover/item:translate-x-1 transition-transform duration-300 flex-shrink-0 ml-2" />
                  </Link>
                  
                  <Link href="/people" className="
                    flex items-center justify-between p-4
                    bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20
                    border border-orange-200/50 dark:border-orange-700/50
                    rounded-2xl hover:from-orange-100 hover:to-amber-100 dark:hover:from-orange-900/30 dark:hover:to-amber-900/30
                    transition-all duration-300 ease-out
                    group/item
                    shadow-lg shadow-orange-200/50 dark:shadow-orange-900/20
                    hover:shadow-xl hover:shadow-orange-300/50 dark:hover:shadow-orange-900/30
                  ">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-xl group-hover/item:bg-orange-200 dark:group-hover/item:bg-orange-900/60 transition-colors duration-300 flex-shrink-0">
                        <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">People</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-orange-600 dark:text-orange-400 group-hover/item:translate-x-1 transition-transform duration-300 flex-shrink-0 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* System Status Card */}
          <div className="w-full h-full group">
            <div className="
              bg-white/90 dark:bg-gray-800/90 backdrop-blur-md
              border border-white/20 dark:border-gray-700/50
              rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50
              hover:shadow-2xl hover:shadow-gray-300/50 dark:hover:shadow-gray-800/50
              transition-all duration-500 ease-out
              h-full overflow-hidden
              relative
            ">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-gray-50/50 dark:from-slate-900/10 dark:via-transparent dark:to-gray-900/10"></div>
              <div className="relative z-10 h-full p-6 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">System Status</h3>
                <div className="space-y-4 flex-grow flex flex-col justify-around">
                  <div className="flex items-center justify-between p-3 bg-green-50/50 dark:bg-green-900/20 rounded-2xl border border-green-200/50 dark:border-green-700/50">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">System Online</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Database</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-200/50 dark:border-indigo-700/50">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">API Services</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Running</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Backup</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
