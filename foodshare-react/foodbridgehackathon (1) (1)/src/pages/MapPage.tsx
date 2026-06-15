/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { AppLanguage, DonationItem } from '../types';
import { MapPin, Search, Compass, Info, Heart, Building, Phone, AlertCircle, ShieldCheck, Sparkles, Filter } from 'lucide-react';

interface MapPageProps {
  currentLang: AppLanguage;
  donations: DonationItem[];
  setDonations: (items: DonationItem[]) => void;
  triggerNotification: (type: string, title: string, message: string, donationId?: string) => void;
}

export default function MapPage({
  currentLang,
  donations,
  setDonations,
  triggerNotification
}: MapPageProps) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPin, setSelectedPin] = useState<DonationItem | null>(donations[0] || null);
  const [mapEngineLoaded, setMapEngineLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);

  const availablePins = donations.filter(item => 
    item.status === 'Available' && (
      item.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pickupAddress.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  useEffect(() => {
    // Dynamically load Leaflet on client-side safely
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    // Load Leaflet css stylesheet in document head
    let leafletCss = document.getElementById('leaflet-css-rel');
    if (!leafletCss) {
      const link = document.createElement('link');
      link.id = 'leaflet-css-rel';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    import('leaflet').then((L) => {
      if (!mapContainerRef.current) return;
      
      // Clear previous map instance if it existed
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }

      setMapEngineLoaded(true);

      // Initialize map centered around Deccan/Central India
      const map = L.map(mapContainerRef.current).setView([17.4483, 78.3741], 5);
      leafletMapRef.current = map;

      // Mount standard OSM open tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap volunteers and FoodBridge rescue networks'
      }).addTo(map);

      // Custom marker icon creation
      const rescueIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `<div class="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-sm shadow-md animate-bounce">🥗</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      // Add markers dynamically
      availablePins.forEach(pin => {
        const marker = L.marker([pin.lat, pin.lng], { icon: rescueIcon }).addTo(map);
        marker.bindPopup(`
          <div class="p-2 space-y-1 bg-white text-slate-800">
            <h4 class="text-xs font-bold font-sans">${pin.foodName}</h4>
            <p class="text-[10px] text-slate-500 font-sans">${pin.donorName} • ${pin.quantity}</p>
            <p class="text-[9px] text-emerald-600 font-bold font-sans">Distance: ${pin.distance}</p>
          </div>
        `);
        
        marker.on('click', () => {
          setSelectedPin(pin);
        });
      });

    }).catch(err => {
      console.warn('Leaflet map modules load deferred or blocked by iframe headers. Switched to standalone vector display.', err);
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [availablePins.length]);

  const handleClaimFromMap = (itemId: string) => {
    const updated = donations.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status: 'Requested' as const,
          assignedNgoId: 'ngo1',
          assignedNgoName: 'Hope Wellness Kitchens'
        };
      }
      return item;
    });

    setDonations(updated);
    
    // Clear selection
    const claimedItem = donations.find(i => i.id === itemId);
    setSelectedPin(null);
    
    if (claimedItem) {
      triggerNotification(
        'Pickup Request',
        'Pickup Claim Filed',
        `NGO "Hope Wellness Kitchens" claimed your ${claimedItem.foodName} on Map view.`,
        itemId
      );
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 w-full select-none animate-in fade-in duration-350">
      <div className="space-y-6">
        
        {/* Banner header info */}
        <div className="glass-light dark:glass-dark p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
              🗺️
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                {t.map_title}
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">{t.map_subtitle}</p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400 font-bold" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search active food pins on map..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Dual Column: Interactive map container on left, Selected item details card on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Map canvas container */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-md overflow-hidden min-h-[500px] relative flex flex-col">
            
            <div className="bg-slate-100 dark:bg-slate-950 p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1"><Compass className="w-4 h-4 text-emerald-500" /> ACTIVE COORDINATE LOCATOR</span>
              <span>GPS: 17.4483° N, 78.3741° E (Hyderabad District Center)</span>
            </div>

            {/* Map Node mount point */}
            <div 
              ref={mapContainerRef} 
              className="flex-grow w-full h-full relative"
              style={{ zIndex: 5 }}
            >
              {/* Standalone Vector Fallback inside the same container to support seamless experience */}
              {!mapEngineLoaded && (
                <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center z-10 animate-in fade-in duration-300">
                  
                  {/* Styled district grid representation */}
                  <div className="w-full max-w-md aspect-[16/9] border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900 shadow-md flex items-center justify-center relative select-none">
                    <p className="text-[10px] uppercase tracking-widest font-mono text-slate-300 dark:text-slate-700 font-black absolute top-3">MUNICIPAL MATRIX RESCUE GRIDS</p>
                    
                    {/* Simulated visual district pins */}
                    <div className="absolute top-[30%] left-[20%] text-center">
                      <button 
                        onClick={() => setSelectedPin(donations[0])}
                        className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg animate-bounce shadow-md border-2 border-white hover:scale-105"
                      >
                        🍛
                      </button>
                      <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase font-mono">Banquet Hub</p>
                    </div>

                    <div className="absolute top-[60%] left-[70%] text-center">
                      <button 
                        onClick={() => setSelectedPin(donations[4] || donations[0])}
                        className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg animate-bounce shadow-md border-2 border-white hover:scale-105"
                      >
                        🍞
                      </button>
                      <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase font-mono">Bakery Block</p>
                    </div>

                  </div>

                  <div className="mt-6 max-w-sm space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-600 border border-blue-500/10">
                      <ShieldCheck className="w-4 h-4 text-blue-500" /> Vector Grid Approved
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">Active Iframe Clearance</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                      {t.map_no_location}
                    </p>
                  </div>

                </div>
              )}
            </div>

          </div>

          {/* Right Selected details card */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-md p-6 flex flex-col justify-between">
            {selectedPin ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                
                <img 
                  src={selectedPin.imageUrl} 
                  alt={selectedPin.foodName} 
                  className="h-44 w-full object-cover rounded-xl border border-slate-100" 
                  referrerPolicy="no-referrer"
                />

                <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                  <span className="uppercase tracking-wider text-slate-400">Post #{selectedPin.id}</span>
                  <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded flex items-center gap-0.5">🗺️ {selectedPin.distance}</span>
                </div>

                <div className="space-y-1 select-none">
                  <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight">{selectedPin.foodName}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold pt-1">
                    <Building className="w-3.5 h-3.5 opacity-60" />
                    <span>{selectedPin.donorName}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 pt-1">Quantity Available: <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{selectedPin.quantity}</span></p>
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="font-semibold">{selectedPin.pickupAddress}</p>
                  </div>
                  {selectedPin.notes && (
                    <div className="flex items-start gap-1.5">
                      <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="italic">"{selectedPin.notes}"</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleClaimFromMap(selectedPin.id)}
                    className="w-full py-3 text-xs font-bold font-mono uppercase tracking-wide bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md text-center cursor-pointer"
                  >
                    🚀 Claim and Request Pickup
                  </button>
                </div>

              </div>
            ) : (
              <div className="py-20 text-center space-y-2">
                <MapPin className="w-10 h-10 text-slate-300 mx-auto animate-bounce" />
                <h5 className="text-xs font-bold text-slate-400 dark:text-slate-500">Pick Marker to Examine</h5>
                <p className="text-[11px] text-slate-300 dark:text-slate-600">Select any coordinates on the board to view corresponding food metrics.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
