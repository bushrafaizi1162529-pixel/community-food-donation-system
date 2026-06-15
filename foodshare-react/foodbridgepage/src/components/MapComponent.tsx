import React, { useState, useEffect } from 'react';
import { useFoodBridge } from '../context/FoodBridgeContext';
import { MapPin, Navigation, Compass, Truck, Star, Info, Target, Landmark } from 'lucide-react';

export const MapComponent: React.FC = () => {
  const { donations, language } = useFoodBridge();
  const [selectedCity, setSelectedCity] = useState<'hyderabad' | 'bengaluru'>('hyderabad');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [animateRoute, setAnimateRoute] = useState(true);
  const [truckProgress, setTruckProgress] = useState(0.2); // 0 to 1

  // Periodic driver truck animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTruckProgress(prev => {
        if (prev >= 0.98) {
          return 0.05; // Reset loop
        }
        return prev + 0.02;
      });
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // Filter listings based on selected city coordinates
  // Hyd: Lat ~17.4, Bengaluru: Lat ~12.9/13.0
  const cityDonations = donations.filter(d => {
    if (selectedCity === 'hyderabad') {
      return d.lat > 16.5;
    } else {
      return d.lat < 14.0;
    }
  });

  // Default coordinate center points for background drawing
  const centers = {
    hyderabad: { name: 'Hyderabad Gachibowli Command Hub', lat: 17.41, lng: 78.40 },
    bengaluru: { name: 'Bengaluru Indiranagar Control Hub', lat: 12.97, lng: 77.59 }
  };

  // Convert GPS coordinates to local SVG viewBox points for premium drawing matches
  const mapCoordinatesToSvg = (lat: number, lng: number) => {
    const center = centers[selectedCity];
    // Zoom factor offsets
    const latSpan = 0.15;
    const lngSpan = 0.15;

    const x = ((lng - (center.lng - lngSpan / 2)) / lngSpan) * 450;
    const y = 300 - ((lat - (center.lat - latSpan / 2)) / latSpan) * 300;

    return { x: Math.max(10, Math.min(440, x)), y: Math.max(10, Math.min(290, y)) };
  };

  return (
    <div className="w-full rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-xl p-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Compass className="w-5 h-5 text-orange-500 animate-spin-slow" />
            <span>Interactive Food Transport Grid Map</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Real-time GPS coordinate simulation of active donor listings and NGO distribution relays.
          </p>
        </div>

        {/* City Filter Controller */}
        <div className="flex bg-gray-50 dark:bg-gray-950 p-1 rounded-xl self-start">
          <button
            onClick={() => { setSelectedCity('hyderabad'); setSelectedNode(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCity === 'hyderabad' 
                ? 'bg-orange-600 text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Hyderabad HQ Grid
          </button>
          <button
            onClick={() => { setSelectedCity('bengaluru'); setSelectedNode(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCity === 'bengaluru' 
                ? 'bg-orange-600 text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Bengaluru East Grid
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
        
        {/* Custom SVG Coordinate Map (Beautifully Responsive, 100% stable!) */}
        <div className="lg:col-span-3 h-80 sm:h-96 w-full rounded-2xl bg-orange-50/15 dark:bg-gray-950/60 border border-orange-500/10 relative overflow-hidden flex items-center justify-center">
          
          {/* Neon Grid Mesh in background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ea580c0c_1px,transparent_1px),linear-gradient(to_bottom,#ea580c0c_1px,transparent_1px)] bg-[size:30px_30px]" />
          
          {/* Canvas SVG drawing */}
          <svg className="w-full h-full relative z-10" viewBox="0 0 450 300">
            
            {/* Draw coordinate axes numbers */}
            <text x="3" y="12" className="text-[7px] fill-gray-400 font-mono">LAT: {centers[selectedCity].lat.toFixed(2)}N</text>
            <text x="3" y="22" className="text-[7px] fill-gray-400 font-mono">LNG: {centers[selectedCity].lng.toFixed(2)}E</text>

            <g opacity="0.3">
              {/* Simulated city loop roads */}
              <path d="M 50 150 Q 225 35 400 150 T 50 150" fill="none" stroke="#ea580c" strokeWidth="1" strokeDasharray="2 3" />
              <path d="M 120 70 C 220 180, 320 20, 420 220" fill="none" stroke="#ea580c" strokeWidth="0.5" />
              <circle cx="225" cy="150" r="100" fill="none" stroke="#ea580c" strokeWidth="0.5" strokeDasharray="5 5" />
            </g>

            {/* Static Simulated NGO Primary Relay Hub */}
            {(() => {
              const baseHub = { lat: centers[selectedCity].lat, lng: centers[selectedCity].lng + 0.02 };
              const coords = mapCoordinatesToSvg(baseHub.lat, baseHub.lng);
              return (
                <g 
                  onClick={() => setSelectedNode({
                    name: 'FoodBridge General NGO Relief Depot',
                    location: 'Command Center Boulevard',
                    quantity: 'Active Relay Hub',
                    status: 'operational',
                    type: 'hub'
                  })}
                  className="cursor-pointer group"
                >
                  <circle cx={coords.x} cy={coords.y} r="14" className="fill-orange-500/20 stroke-orange-500 animate-ping" />
                  <rect x={coords.x - 7} y={coords.y - 7} width="14" height="14" rx="3" className="fill-orange-600 stroke-white stroke-1" />
                  <text x={coords.x - 4} y={coords.y + 4} className="fill-white font-mono text-[9px] font-bold">H</text>
                  <text x={coords.x + 10} y={coords.y - 1} className="fill-orange-600 dark:fill-orange-400 font-bold text-[7px]">PRIMARY BASE DEPO</text>
                </g>
              );
            })()}

            {/* Draw active listings as glowing interactive targets ! */}
            {cityDonations.map((d, index) => {
              const coords = mapCoordinatesToSvg(d.lat, d.lng);
              const isSelected = selectedNode?.id === d.id;

              return (
                <g 
                  key={d.id}
                  onClick={() => setSelectedNode(d)}
                  className="cursor-pointer"
                >
                  {/* Glowing ring */}
                  <circle 
                    cx={coords.x} 
                    cy={coords.y} 
                    r={isSelected ? "14" : "10"} 
                    className={`transition-all duration-300 ${
                      d.status === 'completed' ? 'fill-green-500/10 stroke-green-500' :
                      d.category === 'cooked' ? 'fill-orange-500/10 stroke-orange-500/80' : 'fill-amber-500/10 stroke-amber-500/80'
                    }`} 
                    strokeWidth={isSelected ? "2" : "1"}
                  />

                  {/* Inside point */}
                  <circle 
                    cx={coords.x} 
                    cy={coords.y} 
                    r="5" 
                    className={`${
                      d.status === 'completed' ? 'fill-green-600' :
                      d.status === 'claimed' ? 'fill-blue-500' :
                      d.status === 'in-transit' ? 'fill-amber-500' : 'fill-orange-500'
                    }`} 
                  />

                  {/* Micro Title Tag */}
                  <text 
                    x={coords.x - 12} 
                    y={coords.y - 12} 
                    className="fill-gray-700 dark:fill-gray-300 text-[6.5px] font-semibold tracking-tight"
                  >
                    {d.donorName.split(' ')[0]} ({d.quantity})
                  </text>
                </g>
              );
            })}

            {/* Draw moving simulated tracking route from first available item to depot */}
            {cityDonations.length > 0 && animateRoute && (() => {
              const donorItem = cityDonations[0];
              const donorCoords = mapCoordinatesToSvg(donorItem.lat, donorItem.lng);
              const depotCoords = mapCoordinatesToSvg(centers[selectedCity].lat, centers[selectedCity].lng + 0.02);

              // Quadratic bezier curve coordinate calculators
              const controlPtX = (donorCoords.x + depotCoords.x) / 2;
              const controlPtY = Math.min(donorCoords.y, depotCoords.y) - 30;

              // Compute point along Bezier curve for live truck moving display!
              const t = truckProgress;
              const truckX = (1-t)*(1-t)*donorCoords.x + 2*(1-t)*t*controlPtX + t*t*depotCoords.x;
              const truckY = (1-t)*(1-t)*donorCoords.y + 2*(1-t)*t*controlPtY + t*t*depotCoords.y;

              return (
                <g>
                  {/* Draw curve route */}
                  <path 
                    d={`M ${donorCoords.x} ${donorCoords.y} Q ${controlPtX} ${controlPtY} ${depotCoords.x} ${depotCoords.y}`}
                    fill="none"
                    stroke="#ea580c"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className="opacity-75"
                  />

                  {/* Target pulses */}
                  <circle cx={donorCoords.x} cy={donorCoords.y} r="3" fill="#ea580c" />
                  <circle cx={depotCoords.x} cy={depotCoords.y} r="3" fill="#ea580c" />

                  {/* Moving Cargo Vehicle */}
                  <g transform={`translate(${truckX - 6}, ${truckY - 6})`}>
                    <rect width="12" height="12" rx="3" fill="#d97706" className="stroke-white stroke-[0.5]" />
                    <text x="2" y="9" className="fill-white font-bold text-[7px]" style={{ fontFamily: 'sans-serif' }}>🚚</text>
                    <circle cx="2.5" cy="11.5" r="1.5" fill="#111827" />
                    <circle cx="9.5" cy="11.5" r="1.5" fill="#111827" />
                  </g>
                  <text x={truckX + 8} y={truckY + 2} className="fill-amber-600 dark:fill-amber-400 font-bold text-[6px]">RIDER TRANSIT</text>
                </g>
              );
            })()}

          </svg>

          {/* Compass layout visual ornament */}
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 py-1.5 px-2.5 rounded-lg border border-gray-100 dark:border-gray-800 text-[10px] font-mono flex items-center space-x-1.5 z-20">
            <Compass className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500">CORRIDOR GRID</span>
          </div>

          <div className="absolute bottom-3 left-3 flex space-x-2 z-20">
            <div className="bg-white/95 dark:bg-gray-900/95 py-1 px-2 rounded border border-gray-100 dark:border-gray-800 flex items-center space-x-1.5 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 block animate-pulse" />
              <span className="text-gray-500 font-medium">Donor</span>
            </div>
            <div className="bg-white/95 dark:bg-gray-900/95 py-1 px-2 rounded border border-gray-100 dark:border-gray-800 flex items-center space-x-1.5 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 block" />
              <span className="text-gray-500 font-medium">NGO Claimed</span>
            </div>
            <div className="bg-white/95 dark:bg-gray-900/95 py-1 px-2 rounded border border-gray-100 dark:border-gray-800 flex items-center space-x-1.5 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 block animate-bounce" />
              <span className="text-gray-500 font-medium">Transit</span>
            </div>
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div className="lg:col-span-1 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-900/50 p-4 font-sans text-left flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-600 bg-orange-100/40 dark:bg-orange-950/20 px-2 py-0.5 rounded">
              Node inspector
            </span>

            {selectedNode ? (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="text-[10px] text-gray-400 block font-bold uppercase">Name</label>
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-tight block">
                    {selectedNode.donorName || selectedNode.name}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 block font-bold uppercase">Cargo Title</label>
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 leading-tight block">
                    {selectedNode.title || 'N/A'}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 block font-bold uppercase">Load / Quantity</label>
                  <span className="text-xs font-extrabold text-orange-600 dark:text-orange-400">
                    {selectedNode.quantity}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 block font-bold uppercase">GPS location</label>
                  <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 block">
                    {selectedNode.lat?.toFixed(4)}N, {selectedNode.lng?.toFixed(4)}E
                  </span>
                </div>

                <div>
                  <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    selectedNode.status === 'completed' ? 'bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400' :
                    selectedNode.status === 'claimed' ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' :
                    selectedNode.status === 'in-transit' ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400' :
                    'bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400'
                  }`}>
                    {selectedNode.status || 'Active'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-8 text-center text-xs text-gray-400 py-10">
                <Target className="w-8 h-8 text-orange-400/40 mx-auto mb-2 animate-bounce" />
                Select any glowing target coordinate on the map grid to inspect loading details.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-200 dark:border-gray-900 text-[11px] text-gray-500 dark:text-gray-400 space-y-2 mt-4">
            <div className="flex items-center space-x-1.5">
              <Truck className="w-3.5 h-3.5 text-amber-500" />
              <span>1 Live rider in transit</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 text-gray-400" />
              <span>Double click grid mock to deploy.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
