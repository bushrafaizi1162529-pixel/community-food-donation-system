/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { AppLanguage, DonationItem, DonationStatus } from '../types';
import { Clock, Search, ShieldCheck, MapPin, Phone, CheckCircle, Package, Truck, Smile, Compass, AlertCircle, Sparkles } from 'lucide-react';

interface TrackingPageProps {
  currentLang: AppLanguage;
  donations: DonationItem[];
  trackingDonationId: string | null;
  setTrackingDonationId: (id: string | null) => void;
}

const MILESTONES: { status: DonationStatus; icon: string; title: string; desc: string }[] = [
  { status: 'Available', icon: '🥗', title: 'Post Published', desc: 'Donor submitted listing; waiting for NGO matching.' },
  { status: 'Requested', icon: '📩', title: 'Pickup Claimed', desc: 'A verified NGO requested to claim this surplus.' },
  { status: 'Accepted', icon: '🛡️', title: 'Claim Approved', desc: 'Logistics authorized; donor approved NGO credentials.' },
  { status: 'Picked Up', icon: '🚚', title: 'En-route Transport', desc: 'Driver collected cargo; en-route to community kitchen.' },
  { status: 'Delivered', icon: '💝', title: 'Nourished Delivered', desc: 'Food safely distributed to shelter homes. Audit completed!' }
];

export default function TrackingPage({
  currentLang,
  donations,
  trackingDonationId,
  setTrackingDonationId
}: TrackingPageProps) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const [searchId, setSearchId] = useState(trackingDonationId || '');

  // Find target item
  const currentItem = donations.find(item => item.id === (trackingDonationId || searchId));

  const activeIndex = currentItem 
    ? MILESTONES.findIndex(m => m.status === currentItem.status) 
    : -1;

  const handleSearchTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;
    setTrackingDonationId(searchId);
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 w-full select-none animate-in fade-in duration-300">
      <div className="space-y-6">
        
        {/* Banner Headers */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">{t.track_title.split(' ')[0]} Tracking GPS</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-930 dark:text-white mt-1">
            {t.track_title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
            {t.track_subtitle}
          </p>
        </div>

        {/* Floating ID search board */}
        <div className="glass-light dark:glass-dark p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-md">
          <form onSubmit={handleSearchTrigger} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400 font-bold" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder={t.track_search_id_placeholder}
                className="w-full text-xs pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-mono text-slate-900 dark:text-white tracking-widest uppercase focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3.5 text-xs font-bold font-mono uppercase tracking-wider rounded-xl text-white bg-gradient-to-r from-emerald-600 to-green-600 transition-all cursor-pointer"
            >
              Verify Audit
            </button>
          </form>
        </div>

        {/* Audit Tracker Dashboard Frame */}
        {currentItem ? (
          <div className="space-y-6 animate-in slide-in-from-bottom-3 duration-250">
            
            {/* Quick summary card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/50">
                  <img src={currentItem.imageUrl} alt={currentItem.foodName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Target Donation ID #{currentItem.id}</span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight mt-0.5">{currentItem.foodName}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <span>{currentItem.donorName}</span>
                    <span>•</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">{currentItem.quantity}</span>
                  </div>
                </div>
              </div>

              <div className="text-center md:text-right font-mono text-xs w-full md:w-auto bg-slate-50 dark:bg-slate-950 px-4.5 py-3 rounded-xl border border-slate-150 border-slate-200/40 dark:border-slate-800/50">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Current Milestone Verified</p>
                <p className="text-base font-black text-emerald-600 dark:text-emerald-400 uppercase mt-0.5">{currentItem.status}</p>
              </div>
            </div>

            {/* HIGH-FIDELITY HORIZONTAL / VERTICAL TIMELINE GRID */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-md space-y-8">
              
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 animate-pulse" /> Verifiable Audit Timeline
                </h4>
                <p className="text-[10px] font-mono text-slate-400 dark:text-slate-400">Verified Timestamp {new Date().toLocaleDateString()}</p>
              </div>

              {/* Progress Tracker Horizontal connector layout (Hidden on ultra-small mobile) */}
              <div className="hidden md:flex items-center relative py-6">
                
                {/* Horizontal progress background lines */}
                <div className="absolute left-[8%] right-[8%] top-[2.2rem] h-1 bg-slate-100 dark:bg-slate-800/80 rounded z-0"></div>
                <div 
                  className="absolute left-[8%] top-[2.2rem] h-1 bg-gradient-to-r from-emerald-600 to-green-500 rounded z-0 transition-all duration-500"
                  style={{ width: `${activeIndex >= 0 ? (activeIndex / (MILESTONES.length - 1)) * 84 : 0}%` }}
                ></div>

                {MILESTONES.map((milestone, idx) => {
                  const isPassed = idx <= activeIndex;
                  const isActive = idx === activeIndex;

                  return (
                    <div key={milestone.status} className="flex-1 flex flex-col items-center relative z-10 select-none">
                      
                      {/* Circle dot logo indicator */}
                      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg shadow-md transition-all ${
                        isPassed 
                          ? 'border-emerald-500 bg-emerald-500 text-white scale-110' 
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400'
                      } ${isActive ? 'animate-bounce ring-4 ring-emerald-500/20' : ''}`}>
                        {milestone.icon}
                      </div>

                      {/* Title & Desc */}
                      <h5 className={`text-xs font-bold mt-3.5 transition-colors ${isPassed ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                        {milestone.title}
                      </h5>
                      <p className={`text-[9px] text-center max-w-28 mt-1 font-light leading-snug ${isPassed ? 'text-slate-500 dark:text-slate-400' : 'text-slate-300 dark:text-slate-600'}`}>
                        {milestone.desc}
                      </p>

                    </div>
                  );
                })}

              </div>

              {/* Mobile Vertical representation for smaller layouts */}
              <div className="md:hidden space-y-6">
                {MILESTONES.map((milestone, idx) => {
                  const isPassed = idx <= activeIndex;
                  const isActive = idx === activeIndex;

                  return (
                    <div key={milestone.status} className="flex items-start gap-4">
                      <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-sm ${
                        isPassed 
                          ? 'border-emerald-505 border-emerald-500 bg-emerald-500 text-white' 
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400'
                      }`}>
                        {milestone.icon}
                      </div>
                      <div>
                        <h5 className={`text-xs font-bold ${isPassed ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                          {milestone.title}
                        </h5>
                        <p className={`text-[10px] mt-0.5 leading-snug font-light ${isPassed ? 'text-slate-500 dark:text-slate-400' : 'text-slate-300'}`}>
                          {milestone.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Physical Logistics Coordinate Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none font-sans">
              
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm space-y-3.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">🗺️ Logistics Address Coordinates</h4>
                <div className="text-xs text-slate-700 dark:text-slate-300 spacing-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <p className="font-semibold leading-relaxed">{currentItem.pickupAddress}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Phone className="w-4 h-4 text-emerald-500" />
                    <p className="font-semibold font-mono">{currentItem.contactNumber}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm space-y-3.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 text-blue-500">🏠 Claimed Action organization</h4>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {currentItem.status === 'Available' ? (
                    <p className="text-slate-400 italic">Finding appropriate NGO partner near the facility...</p>
                  ) : (
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">{currentItem.assignedNgoName || 'Hope Wellness Alliance'}</p>
                      <p className="text-[10px] text-slate-400">Operating Registry: Registered NGO Partner #NGO-6672</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* Landing list of Active Donor listings if no direct ID is parsed */
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">Select Active Post to Track</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Click on any registered donation listing below to verify its real-time GPS lifecycle status.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {donations.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSearchId(item.id);
                    setTrackingDonationId(item.id);
                  }}
                  className="p-4 rounded-xl border border-slate-150 border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950 hover:bg-emerald-50/20 dark:hover:bg-slate-900/40 hover:border-emerald-500/40 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{item.category === 'Meal' ? '🍛' : '🍞'}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{item.foodName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">ID: {item.id} • {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase font-mono px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded border border-blue-500/10">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
