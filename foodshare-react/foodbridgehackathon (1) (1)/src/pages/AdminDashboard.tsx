/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { AppLanguage, UserProfile } from '../types';
import { 
  Building, Calendar, Check, ShieldCheck, Trash2, ShieldAlert, Sparkles, AlertCircle, 
  Search, Filter, ChevronLeft, ChevronRight, UserPlus, Info, CheckCircle 
} from 'lucide-react';

interface AdminDashboardProps {
  currentLang: AppLanguage;
  triggerNotification: (type: string, title: string, message: string, donationId?: string) => void;
}

interface DirectoryUser {
  id: string;
  name: string;
  email: string;
  role: 'Donor' | 'NGO' | 'Admin';
  phone: string;
  address: string;
  licensed: boolean;
  status: 'Active' | 'Suspended';
}

const INITIAL_USERS: DirectoryUser[] = [
  { id: 'U-301', name: 'Grand Marriott Resto Hub', email: 'foodsafety@marriott.com', role: 'Donor', phone: '+91 94220 18833', address: 'Banjara Hills Rd, Hyderabad', licensed: true, status: 'Active' },
  { id: 'U-302', name: 'Hope Wellness Kitchens', email: 'volunteer@hopewellness.org', role: 'NGO', phone: '+91 94119 33440', address: 'Hitech City Sector 2, Hyderabad', licensed: true, status: 'Active' },
  { id: 'U-303', name: 'PVR Inox Cinemas Banquet', email: 'concessions@pvr.com', role: 'Donor', phone: '+91 90055 22001', address: 'Nexus Mall, Kukatpally, Hyd', licensed: false, status: 'Active' },
  { id: 'U-304', name: 'Swachh Foundation Hyd', email: 'dispatch@swachhngo.org', role: 'NGO', phone: '+91 80234 44550', address: 'Gachibowli Stadium Road, Hyd', licensed: true, status: 'Active' },
  { id: 'U-305', name: 'Devi Multiplex Canteen', email: 'devi.canteen@yahoo.com', role: 'Donor', phone: '+91 97701 54432', address: 'RTC X Roads, Hyderabad', licensed: false, status: 'Suspended' }
];

export default function AdminDashboard({
  currentLang,
  triggerNotification
}: AdminDashboardProps) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const [dirUsers, setDirUsers] = useState<DirectoryUser[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  // Filter lists
  const filteredUsers = dirUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleVerifyLicense = (userId: string) => {
    const updated = dirUsers.map(u => {
      if (u.id === userId) {
        const nextState = !u.licensed;
        triggerNotification(
          'Accepted Donation',
          nextState ? 'Compliance Authorized' : 'Credential Lifted',
          `Corporate legal compliance status modified for ${u.name}.`
        );
        return { ...u, licensed: nextState };
      }
      return u;
    });

    setDirUsers(updated);
  };

  const handleToggleFreeze = (userId: string) => {
    const updated = dirUsers.map(u => {
      if (u.id === userId) {
        const nextState = u.status === 'Active' ? 'Suspended' as const : 'Active' as const;
        triggerNotification(
          'New Donation',
          nextState === 'Suspended' ? 'Profile Suspended' : 'Profile Restored',
          `Security clearances changed for ${u.name} safety desk.`
        );
        return { ...u, status: nextState };
      }
      return u;
    });

    setDirUsers(updated);
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 w-full select-none animate-in fade-in duration-300">
      <div className="space-y-6">
        
        {/* Statistics Impact Deck */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-slate-900 border border-slate-800 text-white p-5 rounded-2xl shadow flex items-center gap-4 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-lg select-none">📊</div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Total Operations Registered</span>
              <p className="text-xl font-black font-mono text-white mt-0.5">85,240</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 text-white p-5 rounded-2xl shadow flex items-center gap-4 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg select-none">🏢</div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">NGO Fleet Alliances</span>
              <p className="text-xl font-black font-mono text-white mt-0.5">42 Active</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 text-white p-5 rounded-2xl shadow flex items-center gap-4 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg select-none">🌱</div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Landfill Methane Avoided</span>
              <p className="text-xl font-black font-mono text-white mt-0.5">14,350 kg</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 text-white p-5 rounded-2xl shadow flex items-center gap-4 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg select-none">🛰️</div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">State Dispatch Sentry</span>
              <p className="text-xl font-black font-mono text-white mt-0.5">99.8% SLA</p>
            </div>
          </div>

        </div>

        {/* Directory Card Sentry */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-md space-y-4">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-orange-500" /> Operational User Sentry
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Audit authorized corporate donor facilities and NGO dispatch permits.</p>
            </div>

            {/* Quick search & Filters row */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0 w-full sm:w-52">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter users..."
                  className="w-full text-[11px] pl-8.5 pr-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-[11px] font-bold p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none"
              >
                <option value="all">All Roles Directory</option>
                <option value="Donor">Corporation Donors</option>
                <option value="NGO">Registered NGOs</option>
              </select>
            </div>
          </div>

          {/* Directory Listings Table */}
          <div className="overflow-x-auto select-none">
            <table className="w-full text-left font-sans">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 font-mono py-3">
                  <th className="pb-3 px-2">Account ID</th>
                  <th className="pb-3 px-2">Operator Identity</th>
                  <th className="pb-3 px-2">Assigned Sentry Role</th>
                  <th className="pb-3 px-2">Clearance Permits Code</th>
                  <th className="pb-3 px-2">Regulatory Clearance</th>
                  <th className="pb-3 px-2 text-right">Emergency Sentry Action</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="py-3.5 px-2 font-mono font-bold text-slate-400 dark:text-slate-500">{u.id}</td>
                    <td className="py-3.5 px-2">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{u.email} • {u.phone}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className={`text-[10px] uppercase font-mono font-black border px-2.5 py-0.5 rounded-full ${
                        u.role === 'Donor' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' : 'bg-blue-500/10 text-blue-600 border-blue-500/10'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 font-medium text-slate-500 dark:text-slate-300 max-w-44 truncate">{u.address}</td>
                    <td className="py-3.5 px-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${u.licensed ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                        <span className="font-semibold text-slate-700 dark:text-gray-300">
                          {u.licensed ? 'FSSAI Approved ✅' : 'Verification Pending ⏳'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleVerifyLicense(u.id)}
                          className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded transition-colors bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-200 dark:border-slate-700"
                        >
                          Verify Permit
                        </button>
                        <button
                          onClick={() => handleToggleFreeze(u.id)}
                          className={`px-2 py-1 text-[10px] font-mono font-bold uppercase rounded transition-colors ${
                            u.status === 'Active' 
                              ? 'bg-rose-50 border border-rose-200 text-rose-500 hover:bg-rose-100' 
                              : 'bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          {u.status === 'Active' ? 'Freeze' : 'Restore'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono font-bold text-slate-400">
            <span>SHOWING 1 TO {filteredUsers.length} OF {filteredUsers.length} REGISTRIES</span>
            <div className="flex gap-1.5">
              <button className="p-1.5 rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-not-allowed text-slate-300"><ChevronLeft className="w-3.5 h-3.5" /></button>
              <button className="p-1.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 text-slate-600"><ChevronRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
