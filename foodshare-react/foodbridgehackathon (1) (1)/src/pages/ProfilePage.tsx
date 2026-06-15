/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { AppLanguage, UserProfile } from '../types';
import { Sparkles, CheckCircle, ShieldCheck, User, MapPin, Phone, Mail, Award, Lock, Keyboard } from 'lucide-react';

interface ProfilePageProps {
  currentLang: AppLanguage;
  user: UserProfile;
  setUser: (u: UserProfile) => void;
  triggerNotification: (type: string, title: string, message: string, donationId?: string) => void;
}

export default function ProfilePage({
  currentLang,
  user,
  setUser,
  triggerNotification
}: ProfilePageProps) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Local state form variables
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');
  const [fssaiLicense, setFssaiLicense] = useState('FSSAI-88339029');
  const [refrigerated, setRefrigerated] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setUser({
      ...user,
      name,
      email,
      phone,
      address
    });

    triggerNotification(
      'New Donation',
      'Profile Synchronized',
      'Successfully updated your corporate identity profile details.'
    );
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 w-full select-none animate-in fade-in duration-300">
      <div className="space-y-6">
        
        {/* Profile Card Summary Banner */}
        <div className="glass-light dark:glass-dark p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-emerald-500/10">
            {user.name.substring(0, 1)}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
              <span>{user.name}</span>
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </h2>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider font-bold">Authorized Platform {user.role}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light mt-0.5">Secure ID: {user.email}</p>
          </div>
        </div>

        {/* Edit fields grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Edit Form */}
          <div className="md:col-span-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md space-y-6">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">Account Preferences</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Configure your organization contact nodes here.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Organization Title</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Compliance Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Direct Line Mobile</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 944400223"
                      className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Assigned Operational Sentry Role</label>
                  <div className="text-xs p-3 rounded-xl border border-slate-250 bg-slate-100 dark:bg-slate-950 border-slate-205 dark:border-slate-850 text-slate-500 text-center font-bold font-mono capitalize">
                    {user.role} - Verification active
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Headquarters Logistics Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Full corporate postal address..."
                    className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  className="px-8 py-3 text-xs font-bold font-mono uppercase tracking-wide rounded-xl text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  Save Identity Profile
                </button>
              </div>

            </form>
          </div>

          {/* Legal Compliance Side Card */}
          <div className="md:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md space-y-5 select-none text-sans">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-450 text-slate-500">Government Clearances</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Maintain certification licenses for audits.</p>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <Award className="w-4 h-4 animate-shine" />
                  <span>FSSAI License Sentry</span>
                </div>
                <input
                  type="text"
                  value={fssaiLicense}
                  onChange={(e) => setFssaiLicense(e.target.value)}
                  className="w-full text-[10px] font-mono p-1 bg-transparent border-b border-emerald-500/20 text-slate-800 dark:text-white focus:outline-none"
                  placeholder="Insert Registry Key"
                />
                <p className="text-[9px] text-slate-500 leading-tight">Verified license clearance grants priority routing for meals.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 font-mono">Special Logistics Specs</label>
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-150 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <div className="text-[11px]">
                    <p className="font-bold text-slate-800 dark:text-white">Cold Storage Facility</p>
                    <p className="text-[9px] text-slate-400">Refrigeration capability certified</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={refrigerated}
                    onChange={(e) => setRefrigerated(e.target.checked)}
                    className="w-4.5 h-4.5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer"
                  />
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
