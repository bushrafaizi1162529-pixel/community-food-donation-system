/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { AppLanguage, DonationItem, FoodCategory, VegNonVeg, UserProfile } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Building, Calendar, Clock, Heart, HelpCircle, MapPin, Phone, Plus, Trash2, 
  Edit3, Compass, CheckCircle, Leaf, Sparkles, Filter, ChevronRight, AlertTriangle
} from 'lucide-react';
import { createFoodDonation } from '../lib/api';

interface DonorDashboardProps {
  currentLang: AppLanguage;
  user: UserProfile;
  donations: DonationItem[];
  setDonations: (items: DonationItem[]) => void;
  triggerNotification: (type: string, title: string, message: string, donationId?: string) => void;
  setActivePage: (page: any) => void;
  setTrackingDonationId: (id: string | null) => void;
}

const CATEGORY_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#64748b', '#06b6d4'];

export default function DonorDashboard({
  currentLang,
  user,
  donations,
  setDonations,
  triggerNotification,
  setActivePage,
  setTrackingDonationId
}: DonorDashboardProps) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const [activeTab, setActiveTab] = useState<'overview' | 'add-donation' | 'my-donations'>('overview');

  // Form states
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Meal');
  const [vegNonVeg, setVegNonVeg] = useState<VegNonVeg>('Veg');
  const [expiryTime, setExpiryTime] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [pickupAddress, setPickupAddress] = useState(user.address || '');
  const [contactNumber, setContactNumber] = useState(user.phone || '');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600');
  
  // Edit mode
  const [editItemId, setEditItemId] = useState<string | null>(null);

  // Form image selections
  const imagePresets = [
    { title: 'Fresh Grains & Meals', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600' },
    { title: 'Packed Dinner Containers', url: 'https://images.unsplash.com/photo-1626700051175-6518c4793f4f?w=600' },
    { title: 'Fresh Raw Organic Boxes', url: 'https://images.unsplash.com/photo-1566385101042-1a0104524c66?w=600' },
    { title: 'Fresh Baked Bread Loads', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600' }
  ];

  // Filters for table
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter donor's own listings
  const myListings = donations.filter(item => item.donorId === user.email || (item.donorId === 'donor1' && user.email === 'donor@foodbridge.org'));

  // Calculate Donor Stats
  const totalWeightSaved = myListings.reduce((acc, curr) => {
    const numericPart = parseFloat(curr.quantity) || 12;
    return acc + numericPart;
  }, 0);

  const activeDeliveries = myListings.filter(item => item.status !== 'Delivered').length;
  const fulfilledFeeds = myListings.filter(item => item.status === 'Delivered').length;
  const estimatedLives = Math.round(totalWeightSaved * 2);

  // Recharts Monthly Data representation
  const monthlyData = [
    { month: 'Jan', weight: 140, co2: 350 },
    { month: 'Feb', weight: 180, co2: 450 },
    { month: 'Mar', weight: 290, co2: 725 },
    { month: 'Apr', weight: 340, co2: 850 },
    { month: 'May', weight: 420, co2: 1050 },
    { month: 'Jun', weight: totalWeightSaved + 120, co2: Math.round((totalWeightSaved + 120) * 2.5) }
  ];

  // Category counts
  const categoryCounts = myListings.reduce((acc: Record<string, number>, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    value: categoryCounts[cat]
  }));

  const defaultPieData = [
    { name: 'Meal', value: 3 },
    { name: 'Bakery', value: 2 },
    { name: 'Raw Veggies', value: 1 }
  ];

  const handlePublishDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !quantity || !expiryTime || !pickupAddress || !contactNumber) return;

    if (editItemId) {
      // Modify existing item locally — status sync handled by handleUpdateDonations in App.tsx
      const updated = donations.map(item => {
        if (item.id === editItemId) {
          return {
            ...item,
            foodName,
            quantity,
            category,
            vegNonVeg,
            expiryTime,
            pickupTime,
            pickupAddress,
            contactNumber,
            notes,
            imageUrl
          };
        }
        return item;
      });
      setDonations(updated);
      setEditItemId(null);
      triggerNotification(
        'New Donation',
        'Donation Profile Saved',
        `Successfully modified details for ${foodName}.`,
        editItemId
      );
    } else {
      // Post new donation to backend
      try {
        const lat = 17.4480 + (Math.random() - 0.5) * 0.02;
        const lng = 78.3740 + (Math.random() - 0.5) * 0.02;

        const created = await createFoodDonation({
          food_name: foodName,
          quantity,
          description: notes,
          expiry_time: new Date(expiryTime).toISOString(),
          location: pickupAddress,
          latitude: lat,
          longitude: lng,
          donor_id: user.email,
          donor_name: user.name || 'Donor',
          category,
          veg_non_veg: vegNonVeg,
          pickup_time: pickupTime || 'Immediate',
          contact_number: contactNumber,
          image_url: imageUrl,
        });

        // Add returned item (with server-assigned ID) to local state
        if (created && created.length > 0) {
          setDonations([created[0], ...donations]);
        }
        triggerNotification(
          'New Donation',
          'New Donation Posted Successfully!',
          `Your listing of ${foodName} is broadcasted close to nearest NGOs.`,
          created?.[0]?.id
        );
      } catch (err) {
        console.error('Failed to post donation to backend:', err);
        // Fallback: optimistic local update
        const newId = 'FB-9' + Math.floor(100 + Math.random() * 900);
        const newItem: DonationItem = {
          id: newId,
          donorId: user.email,
          donorName: user.name || 'Grand Marriott Resto',
          foodName,
          quantity,
          category,
          vegNonVeg,
          expiryTime: new Date(expiryTime).toISOString(),
          pickupTime: pickupTime || 'Immediate',
          pickupAddress,
          contactNumber,
          imageUrl,
          status: 'Available',
          createdAt: new Date().toISOString(),
          lat: 17.4480 + (Math.random() - 0.5) * 0.02,
          lng: 78.3740 + (Math.random() - 0.5) * 0.02,
          distance: '1.4 km',
          notes
        };
        setDonations([newItem, ...donations]);
        triggerNotification(
          'New Donation',
          'New Donation Posted Successfully!',
          `Your listing of ${foodName} is broadcasted close to nearest NGOs.`,
          newItem.id
        );
      }
    }

    // Reset clean form
    setFoodName('');
    setQuantity('');
    setExpiryTime('');
    setPickupTime('');
    setNotes('');
    
    // Slide tab back
    setActiveTab('my-donations');
  };

  const handleStartEdit = (item: DonationItem) => {
    setEditItemId(item.id);
    setFoodName(item.foodName);
    setQuantity(item.quantity);
    setCategory(item.category);
    setVegNonVeg(item.vegNonVeg);
    
    // Format date string for datetime-local input
    const formattedExpiry = item.expiryTime.substring(0, 16);
    setExpiryTime(formattedExpiry);
    
    setPickupTime(item.pickupTime);
    setPickupAddress(item.pickupAddress);
    setContactNumber(item.contactNumber);
    setNotes(item.notes || '');
    setImageUrl(item.imageUrl);
    
    setActiveTab('add-donation');
  };

  const handleDeleteItem = (itemId: string) => {
    const filtered = donations.filter(item => item.id !== itemId);
    setDonations(filtered);
    triggerNotification(
      'New Donation',
      'Donation Revoked',
      `Donation reference ${itemId} has been removed safely.`
    );
  };

  const handleTrackDonation = (itemId: string) => {
    setTrackingDonationId(itemId);
    setActivePage('tracking');
  };

  const getStatusColorIdx = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Requested': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Accepted': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Picked Up': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'Delivered': return 'bg-slate-400/10 text-slate-500 border-slate-500/10';
      default: return 'bg-slate-500/10 text-slate-500';
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 w-full select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Dynamic Sidebar Control Deck */}
        <div className="lg:col-span-3 glass-light dark:glass-dark p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-md space-y-2">
          
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Authenticated Desk</h3>
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
            <span className="text-[10px] inline-flex items-center gap-1 font-semibold text-emerald-500 capitalize bg-emerald-500/10 rounded-full px-2 py-0.5 mt-1">
              <CheckCircle className="w-3 h-3 text-emerald-500" /> Authorized Donor
            </span>
          </div>

          <div className="space-y-1 pt-3">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-4.5 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center justify-between ${
                activeTab === 'overview'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>📈 {t.donor_sidebar_dash}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
            
            <button
              onClick={() => { setEditItemId(null); setActiveTab('add-donation'); }}
              className={`w-full text-left px-4.5 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center justify-between ${
                activeTab === 'add-donation'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>🥗 {editItemId ? t.action_edit : t.donor_sidebar_add}</span>
              <Plus className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              onClick={() => setActiveTab('my-donations')}
              className={`w-full text-left px-4.5 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center justify-between ${
                activeTab === 'my-donations'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>📦 {t.donor_sidebar_my}</span>
              <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] font-mono font-bold">
                {myListings.length}
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

        {/* Dynamic Panel Right */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Dashboard Header Panel */}
          <div className="glass-light dark:glass-dark p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                {t.donor_title}
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">Manage and audit your real-time community food donations.</p>
            </div>
            
            <button
              onClick={() => { setEditItemId(null); setActiveTab('add-donation'); }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:opacity-90 rounded-xl shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.btn_add_donation}</span>
            </button>
          </div>

          {/* Tab 1: DATA OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Stats Overview Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 p-5 rounded-2xl shadow-sm flex items-center gap-4.5 hover:shadow-xl transition-all">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">📁</div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">{t.card_total_donations}</span>
                    <p className="text-xl font-black text-slate-900 dark:text-white font-mono">{myListings.length}</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 p-5 rounded-2xl shadow-sm flex items-center gap-4.5 hover:shadow-xl transition-all">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">🛰️</div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">{t.card_active_donations}</span>
                    <p className="text-xl font-black text-slate-900 dark:text-white font-mono">{activeDeliveries}</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 p-5 rounded-2xl shadow-sm flex items-center gap-4.5 hover:shadow-xl transition-all">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center font-bold text-lg">🤝</div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">{t.card_completed_donations}</span>
                    <p className="text-xl font-black text-slate-900 dark:text-white font-mono">{fulfilledFeeds}</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 p-5 rounded-2xl shadow-sm flex items-center gap-4.5 hover:shadow-xl transition-all">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">⚖️</div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">{t.card_food_saved}</span>
                    <p className="text-xl font-black text-slate-900 dark:text-white font-mono">{totalWeightSaved} kg</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 p-5 rounded-2xl shadow-sm flex items-center gap-4.5 hover:shadow-xl transition-all">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold text-lg">🍲</div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">{t.card_people_served}</span>
                    <p className="text-xl font-black text-slate-900 dark:text-white font-mono">{estimatedLives}</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 p-5 rounded-2xl shadow-sm flex items-center gap-4.5 hover:shadow-xl transition-all">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-lg">🏢</div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">{t.card_ngos_helped}</span>
                    <p className="text-xl font-black text-slate-900 dark:text-white font-mono">15+</p>
                  </div>
                </div>

              </div>

              {/* Graphical Recharts charts panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Chart 1: Saved weight trend */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">{t.chart_monthly_title}</h3>
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="h-64 h-sm:h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:opacity-10" />
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                        <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                        <Bar dataKey="weight" fill="#16a34a" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Category distribution */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">{t.chart_category_title}</h3>
                    <Leaf className="w-4 h-4 text-green-500 animate-pulse" />
                  </div>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData.length > 0 ? pieData : defaultPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {(pieData.length > 0 ? pieData : defaultPieData).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Sustainability carbon emission reductions index */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800/80 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1.5 text-center md:text-left">
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded-full uppercase">Carbon Avoidance Credits</span>
                  <h3 className="text-base font-bold pt-1">{t.chart_impact_title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xl font-light">
                    Every kilogram of recovered surplus meal avoids roughly 2.5 kilograms of atmospheric carbon emissions in baseline landfills.
                  </p>
                </div>
                <div className="text-center md:text-right bg-white/[0.04] p-4.5 rounded-xl border border-white/5 w-full md:w-auto">
                  <p className="text-3xl font-black font-mono text-emerald-400">{(totalWeightSaved * 2.5).toFixed(1)} kg</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase">Neutralization Score</p>
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: PUBLISH NEW DONATION */}
          {activeTab === 'add-donation' && (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-md space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editItemId ? 'Modify Active Donation Listing' : t.form_btn_submit}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">Please populate the precise details below so nearest verified NGOs can coordinate instant pickup.</p>
              </div>

              <form onSubmit={handlePublishDonation} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.form_food_name}</label>
                    <input
                      type="text"
                      required
                      value={foodName}
                      onChange={(e) => setFoodName(e.target.value)}
                      placeholder={t.form_food_placeholder}
                      className="w-full text-xs p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.form_quantity}</label>
                    <input
                      type="text"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder={t.form_quantity_placeholder}
                      className="w-full text-xs p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.form_category}</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as FoodCategory)}
                      className="w-full text-xs p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Meal">🍛 Meal</option>
                      <option value="Grocery">🍎 Grocery</option>
                      <option value="Raw Veggies">🌽 Raw Veggies</option>
                      <option value="Bakery">🍞 Bakery</option>
                      <option value="Packed Food">📦 Packed Food</option>
                      <option value="Beverages">🧃 Beverages</option>
                      <option value="Other">🍽️ Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.form_veg_nonveg}</label>
                    <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl gap-1">
                      <button
                        type="button"
                        onClick={() => setVegNonVeg('Veg')}
                        className={`w-1/2 py-2 text-xs font-bold rounded-lg transition-colors ${
                          vegNonVeg === 'Veg' 
                            ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400' 
                            : 'text-slate-500'
                        }`}
                      >
                        🟢 {currentLang === 'en' ? 'Veg' : 'శాకాహారం'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setVegNonVeg('Non-Veg')}
                        className={`w-1/2 py-2 text-xs font-bold rounded-lg transition-colors ${
                          vegNonVeg === 'Non-Veg' 
                            ? 'bg-white dark:bg-slate-900 text-rose-500' 
                            : 'text-slate-500'
                        }`}
                      >
                        🔴 {currentLang === 'en' ? 'Non-Veg' : 'మాంసాహారం'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.form_expiry}</label>
                    <input
                      type="datetime-local"
                      required
                      value={expiryTime}
                      onChange={(e) => setExpiryTime(e.target.value)}
                      className="w-full text-xs p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.form_pickup_time}</label>
                    <input
                      type="text"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      placeholder="e.g., Immediate within next 2 hours"
                      className="w-full text-xs p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.form_contact}</label>
                    <input
                      type="tel"
                      required
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="Primary contact phone"
                      className="w-full text-xs p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.form_pickup_address}</label>
                  <input
                    type="text"
                    required
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="Full street address, building floor, landmarks..."
                    className="w-full text-xs p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Preset Image selectors instead of file upload to prevent standard broken file handles  */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.form_image_upload}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {imagePresets.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => setImageUrl(preset.url)}
                        className={`cursor-pointer rounded-xl overflow-hidden border-2 relative select-none transition-all ${
                          imageUrl === preset.url 
                            ? 'border-emerald-500 scale-[1.03] shadow-md shadow-emerald-500/10' 
                            : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={preset.url} alt={preset.title} className="h-16 w-full object-cover" />
                        <p className="text-[9px] font-bold p-1 bg-slate-900/90 text-white truncate text-center uppercase tracking-wider">{preset.title}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.form_notes}</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special storage, allergic indicators, or refrigeration needs details..."
                    className="w-full text-xs p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="submit"
                    className="px-8 py-3.5 text-xs font-bold font-mono uppercase tracking-wide rounded-xl text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:scale-[1.01] transition-all cursor-pointer"
                  >
                    {editItemId ? 'Apply Changes Now' : 'Publish Live Listing'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('my-donations')}
                    className="px-6 py-3.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* Tab 3: MY HISTORICAL DONATIONS */}
          {activeTab === 'my-donations' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-md space-y-4 animate-in fade-in duration-200">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">My Registered Posts</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Audit tracking statuses, modify listings, or claim completions.</p>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="text-[11px] font-bold p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="all">All Food Types</option>
                    <option value="Meal">🍛 Meal Type</option>
                    <option value="Bakery">🍞 Bakery Type</option>
                    <option value="Raw Veggies">🌽 veggies Type</option>
                  </select>
                </div>
              </div>

              {/* Table list */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 font-mono">
                      <th className="py-3 px-2">{t.table_id}</th>
                      <th className="py-3 px-2">{t.table_food}</th>
                      <th className="py-3 px-2">{t.table_qty}</th>
                      <th className="py-3 px-2">{t.table_ngo}</th>
                      <th className="py-3 px-2">{t.table_status}</th>
                      <th className="py-3 px-2 text-right">{t.table_actions}</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800/50">
                    {myListings
                      .filter(item => categoryFilter === 'all' || item.category === categoryFilter)
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                          <td className="py-3.5 px-2 font-mono font-bold text-slate-400 dark:text-slate-500">{item.id}</td>
                          <td className="py-3.5 px-2">
                            <div className="flex items-center gap-2.5">
                              <span className="text-lg">{item.category === 'Meal' ? '🍛' : item.category === 'Bakery' ? '🍞' : '🍎'}</span>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white leading-tight">{item.foodName}</p>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.vegNonVeg === 'Veg' ? '🟢 Pure Veg' : '🔴 Non-Veg'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-2 font-semibold font-mono text-slate-600 dark:text-slate-300">{item.quantity}</td>
                          <td className="py-3.5 px-2 text-slate-500 dark:text-slate-400 font-medium">
                            {item.status === 'Available' ? <span className="text-slate-300 dark:text-slate-700 italic">Assigning...</span> : item.assignedNgoName || 'Verified Swachh Foundation'}
                          </td>
                          <td className="py-3.5 px-2">
                            <span className={`text-[10px] font-black border uppercase px-2.5 py-0.5 rounded-full font-mono ${getStatusColorIdx(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          
                          {/* Actions trigger */}
                          <td className="py-3.5 px-2 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleTrackDonation(item.id)}
                                className="px-2.5 py-1 text-[10px] font-bold font-mono uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-300 rounded-md border border-slate-250 border-slate-200 dark:border-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                              >
                                {t.action_track}
                              </button>
                              
                              <button
                                onClick={() => handleStartEdit(item)}
                                className="p-1 rounded text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                                title="Edit Donation Details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                title="Revoke Post"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))}

                    {myListings.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-500">
                          <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-bounce" />
                          <p className="text-xs">No active listings uploaded in your account. Click 'Post New Donation' to publish meals!</p>
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
    </div>
  );
}
