/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { AppLanguage, DonationItem, UserProfile } from '../types';
import { 
  Building, Calendar, Clock, Heart, HelpCircle, MapPin, Phone, Plus, Search, 
  Sparkles, Filter, ChevronRight, X, AlertCircle, Compass, CheckCircle, Info 
} from 'lucide-react';
import { createPickupRequest, updatePickupStatus } from '../lib/api';

interface NgoDashboardProps {
  currentLang: AppLanguage;
  user: UserProfile;
  donations: DonationItem[];
  setDonations: (items: DonationItem[]) => void;
  triggerNotification: (type: string, title: string, message: string, donationId?: string) => void;
  setActivePage: (page: any) => void;
  setTrackingDonationId: (id: string | null) => void;
}

export default function NgoDashboard({
  currentLang,
  user,
  donations,
  setDonations,
  triggerNotification,
  setActivePage,
  setTrackingDonationId
}: NgoDashboardProps) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const [activeTab, setActiveTab] = useState<'discover' | 'claimed'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState<'all' | 'Veg' | 'Non-Veg'>('all');
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);

  // Filter lists based on status and inputs
  const availableList = donations.filter(item => {
    const matchesSearch = item.foodName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.pickupAddress.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiet = dietFilter === 'all' || item.vegNonVeg === dietFilter;
    const isAvailable = item.status === 'Available';
    return isAvailable && matchesSearch && matchesDiet;
  });

  // Claimed tasks (Assigned to this NGO)
  const claimedList = donations.filter(item => 
    item.assignedNgoId === user.email || (item.assignedNgoId === 'ngo1' && user.email === 'ngo@foodbridge.org')
  );

  const handleClaimPickup = async (itemId: string) => {
    const updated = donations.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status: 'Requested' as const,
          assignedNgoId: user.email,
          assignedNgoName: user.name || user.orgName || 'Hope Wellness Kitchens'
        };
      }
      return item;
    });

    setDonations(updated);
    setSelectedDonation(null);
    
    const targetItem = donations.find(item => item.id === itemId);
    if (targetItem) {
      // Create pickup request in backend
      try {
        await createPickupRequest(itemId, user.email);
      } catch (err) {
        console.warn('Could not create pickup request on backend:', err);
      }
      triggerNotification(
        'Pickup Request',
        'Pickup Request Broadcasted',
        `NGO "${user.name}" filed a pickup request for ${targetItem.foodName}.`,
        itemId
      );
    }
  };

  const handleTransitionStatus = (itemId: string, nextStatus: any) => {
    const updated = donations.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status: nextStatus
        };
      }
      return item;
    });

    setDonations(updated);

    const targetItem = donations.find(item => item.id === itemId);
    if (targetItem) {
      triggerNotification(
        'Accepted Donation',
        `Listing status: ${nextStatus}`,
        `Your donation "${targetItem.foodName}" shifted progress timeline to: ${nextStatus}.`,
        itemId
      );
    }
  };

  const handleTrackTask = (itemId: string) => {
    setTrackingDonationId(itemId);
    setActivePage('tracking');
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 w-full select-none animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Dynamic Sidebar Control Deck */}
        <div className="lg:col-span-3 glass-light dark:glass-dark p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-md space-y-2">
          
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Authenticated Alliance</h3>
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
            <span className="text-[10px] inline-flex items-center gap-1 font-semibold text-blue-500 bg-blue-500/10 rounded-full px-2 py-0.5 mt-1">
              <CheckCircle className="w-3 h-3 text-blue-500" /> Verified NGO Agency
            </span>
          </div>

          <div className="space-y-1 pt-3">
            <button
              onClick={() => setActiveTab('discover')}
              className={`w-full text-left px-4.5 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center justify-between ${
                activeTab === 'discover'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>🧭 {t.ngo_sidebar_avail}</span>
              <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] font-mono font-bold">
                {donations.filter(d => d.status === 'Available').length}
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('claimed')}
              className={`w-full text-left px-4.5 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center justify-between ${
                activeTab === 'claimed'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>✅ {t.ngo_sidebar_pickups}</span>
              <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] font-mono font-bold">
                {claimedList.length}
              </div>
            </button>

            <hr className="border-slate-100 dark:border-slate-800 my-2" />

            <button
              onClick={() => setActivePage('tracking')}
              className="w-full text-left px-4.5 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              🛰️ <span>{t.donor_sidebar_track}</span>
            </button>
            <button
              onClick={() => setActivePage('notifications')}
              className="w-full text-left px-4.5 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span>🔔 {t.donor_sidebar_notif}</span>
            </button>
            <button
              onClick={() => setActivePage('map')}
              className="w-full text-left px-4.5 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              🗺️ <span>{t.donor_sidebar_map}</span>
            </button>
            <button
              onClick={() => setActivePage('profile')}
              className="w-full text-left px-4.5 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              👤 <span>{t.donor_sidebar_profile}</span>
            </button>
          </div>

        </div>

        {/* Dynamic Panels Right */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Header & Integrated Search Bar */}
          <div className="glass-light dark:glass-dark p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                {t.ngo_title}
                <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">Locate nearby kitchens and claim fresh surplus meals.</p>
            </div>

            {/* Quick search input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.ngo_search_placeholder}
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Tab 1: DISCOVER AVAILABLE FLOATING FOOD LISTS */}
          {activeTab === 'discover' && (
            <div className="space-y-6">
              
              {/* Regional selection filters row */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-150 border-slate-200/60 dark:border-slate-800/60">
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                  <button
                    onClick={() => setDietFilter('all')}
                    className={`px-3 py-1.5 rounded-lg border font-bold capitalize transition-colors ${
                      dietFilter === 'all' 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    🍛 {t.filter_all}
                  </button>
                  <button
                    onClick={() => setDietFilter('Veg')}
                    className={`px-3 py-1.5 rounded-lg border font-bold capitalize transition-colors ${
                      dietFilter === 'Veg' 
                        ? 'bg-emerald-600 text-white border-emerald-600' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    🟢 {t.filter_veg}
                  </button>
                  <button
                    onClick={() => setDietFilter('Non-Veg')}
                    className={`px-3 py-1.5 rounded-lg border font-bold capitalize transition-colors ${
                      dietFilter === 'Non-Veg' 
                        ? 'bg-rose-600 text-white border-rose-600' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    🔴 {t.filter_nonveg}
                  </button>
                </div>

                <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-bold">
                  <Compass className="w-3.5 h-3.5" /> Filtering 5 km Local Grid
                </div>
              </div>

              {/* Donation Cards Grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableList.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-md overflow-hidden flex flex-col group hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {/* Food cover */}
                    <div className="h-44 relative w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                      <img 
                        src={item.imageUrl} 
                        alt={item.foodName} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 flex gap-1.5">
                        <span className="bg-slate-900/85 text-white text-[9px] font-black uppercase tracking-wider font-mono px-2.5 py-1 rounded-full border border-white/10 shadow-md">
                          {item.category}
                        </span>
                        <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full font-mono border shadow-md ${
                          item.vegNonVeg === 'Veg' ? 'bg-emerald-500 text-white border-emerald-400/20' : 'bg-rose-500 text-white border-rose-400/20'
                        }`}>
                          {item.vegNonVeg}
                        </span>
                      </div>

                      {/* Expiration warning indicator */}
                      <div className="absolute bottom-4 left-4 right-4 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center justify-between font-mono text-[10px] text-white">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> {t.item_expiry_label}</span>
                        <span className="font-bold text-amber-400">
                          {new Date(item.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* Card details */}
                    <div className="p-5 flex-grow space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          <p className="flex items-center gap-1 text-xs truncate"><Building className="w-3.5 h-3.5 opacity-60" /> {item.donorName}</p>
                          <span className="font-mono text-emerald-500 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-0.5 font-bold">🗺️ {item.distance}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-blue-500 transition-colors">{item.foodName}</h4>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Volume: <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{item.quantity}</span></p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 font-light leading-relaxed">{item.notes || 'No special handling noted.'}</p>
                      </div>

                      {/* Bottom actions */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <button
                          onClick={() => setSelectedDonation(item)}
                          className="w-1/2 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all text-center cursor-pointer"
                        >
                          {t.btn_view_details}
                        </button>
                        <button
                          onClick={() => handleClaimPickup(item.id)}
                          className="w-1/2 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md cursor-pointer"
                        >
                          {t.btn_request_pickup.split(' ')[0]}
                        </button>
                      </div>
                    </div>

                  </div>
                ))}

                {availableList.length === 0 && (
                  <div className="col-span-2 py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/30">
                    <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2.5 animate-bounce" />
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">Grid Clean & Safe</h5>
                    <p className="text-xs text-slate-400 mt-0.5">No matching active food donation postings nearby at this exact moment.</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Tab 2: CLAIMED TASKS WORKSPACE */}
          {activeTab === 'claimed' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-md space-y-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">Claimed Logistics Action Desk</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Manage claim pathways, verify handovers with donors, and complete deliveries.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 font-mono py-3">
                      <th className="pb-3 px-2">Task ID</th>
                      <th className="pb-3 px-2">{t.table_food}</th>
                      <th className="pb-3 px-2">Donor Source</th>
                      <th className="pb-3 px-2">Task Milestones</th>
                      <th className="pb-3 px-2 text-right">Coordination Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800/50">
                    {claimedList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                        <td className="py-3.5 px-2 font-mono font-bold text-slate-400 dark:text-slate-500">{item.id}</td>
                        <td className="py-3.5 px-2">
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{item.foodName}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{item.quantity} • {item.vegNonVeg}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-2">
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-300">{item.donorName}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-40">{item.pickupAddress}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                            <span className="font-mono font-bold uppercase text-[9px] px-2 py-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/10 rounded">
                              {item.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            <button
                              onClick={() => handleTrackTask(item.id)}
                              className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-300 rounded border border-slate-200"
                            >
                              🛰️ Track
                            </button>

                            {/* Milestone Shifters */}
                            {item.status === 'Requested' && (
                              <button
                                onClick={() => handleTransitionStatus(item.id, 'Accepted')}
                                className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-blue-600 text-white rounded hover:opacity-90 cursor-pointer"
                              >
                                Accept Claim
                              </button>
                            )}

                            {item.status === 'Accepted' && (
                              <button
                                onClick={() => handleTransitionStatus(item.id, 'Picked Up')}
                                className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-purple-600 text-white rounded hover:opacity-90 cursor-pointer"
                              >
                                Pick Up Done
                              </button>
                            )}

                            {item.status === 'Picked Up' && (
                              <button
                                onClick={() => handleTransitionStatus(item.id, 'Delivered')}
                                className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-emerald-600 text-white rounded hover:opacity-90 cursor-pointer"
                              >
                                Deliver Done
                              </button>
                            )}

                            {item.status === 'Delivered' && (
                              <span className="text-[10px] font-bold text-slate-400 italic font-mono uppercase bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded">
                                Completed 🎉
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {claimedList.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-slate-500">
                          <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-bounce" />
                          <p className="text-xs">No food rescues assigned currently. Explore the 'Discover Food' tab to claim available items.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* 4. DETAIL POPUP PROFILE MODAL */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-250">
            
            <button
              onClick={() => setSelectedDonation(null)}
              className="absolute top-4 right-4 p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <img 
              src={selectedDonation.imageUrl} 
              alt={selectedDonation.foodName} 
              className="h-56 w-full object-cover" 
              referrerPolicy="no-referrer"
            />

            <div className="p-6 space-y-4">
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-blue-500/10 text-blue-500 text-[10px] px-2.5 py-0.5 rounded font-bold font-mono uppercase">{selectedDonation.category}</span>
                <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2.5 py-0.5 rounded font-bold font-mono uppercase">{selectedDonation.vegNonVeg}</span>
                <span className="bg-amber-500/10 text-amber-500 text-[10px] px-2.5 py-0.5 rounded font-bold font-mono uppercase flex items-center gap-0.5 font-mono">⏱️ Fading: {new Date(selectedDonation.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 font-mono">Donation Listing #{selectedDonation.id}</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{selectedDonation.foodName}</h3>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Rescuable Volume: <span className="text-emerald-500 font-mono">{selectedDonation.quantity}</span></p>
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 select-none">
                
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-400 text-[10px] uppercase">Donor Pickup Address</h5>
                    <p className="text-slate-700 dark:text-slate-300">{selectedDonation.pickupAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-400 text-[10px] uppercase">{t.modal_contact_details}</h5>
                    <p className="text-slate-700 dark:text-slate-300">{selectedDonation.contactNumber} ({selectedDonation.donorName})</p>
                  </div>
                </div>

                {selectedDonation.notes && (
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-slate-400 text-[10px] uppercase">{t.modal_notes}</h5>
                      <p className="text-slate-600 dark:text-slate-400 italic">"{selectedDonation.notes}"</p>
                    </div>
                  </div>
                )}

              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="w-1/2 py-3 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-center cursor-pointer"
                >
                  {t.modal_btn_close}
                </button>
                <button
                  onClick={() => handleClaimPickup(selectedDonation.id)}
                  className="w-1/2 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md text-center cursor-pointer"
                >
                  Confirm Claim Pickup
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
