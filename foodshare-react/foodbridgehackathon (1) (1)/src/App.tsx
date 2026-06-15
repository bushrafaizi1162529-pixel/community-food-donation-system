/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from './lib/firebase';
import Navbar from './components/Navbar';
import FoodBackground from './components/FoodBackground';
import PageTransition from './components/PageTransition';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DonorDashboard from './pages/DonorDashboard';
import NgoDashboard from './pages/NgoDashboard';
import TrackingPage from './pages/TrackingPage';
import NotificationCenter from './pages/NotificationCenter';
import MapPage from './pages/MapPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';

import { AppLanguage, AppTheme, UserProfile, DonationItem, Notification } from './types';
import { INITIAL_DONATIONS } from './data/mockDb';
import { TRANSLATIONS } from './data/translations';
import { CheckCircle, X } from 'lucide-react';
import {
  getFoodDonations,
  getNotifications,
  createNotification,
  deleteFoodDonation,
  updateFoodStatus,
} from './lib/api';

interface Toast {
  id: string;
  type: string;
  title: string;
  message: string;
}

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('foodbridge_theme');
    return (saved as AppTheme) || 'light';
  });

  // Language state
  const [lang, setLang] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('foodbridge_lang');
    return (saved as AppLanguage) || 'en';
  });

  // Authentication states
  const [user, setUser] = useState<UserProfile | null>(null);

  // Donations loaded from Supabase backend
  const [donations, setDonations] = useState<DonationItem[]>([]);

  // Notifications loaded from Supabase backend
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Loading states
  const [donationsLoading, setDonationsLoading] = useState(false);

  // Navigation controller
  const [activePage, setActivePage] = useState<string>('home');
  const [trackingDonationId, setTrackingDonationId] = useState<string | null>(null);

  // Active toast alerts stack
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Helper: load donations from backend
  const loadDonations = useCallback(async () => {
    setDonationsLoading(true);
    try {
      const items = await getFoodDonations();
      // Sort newest first
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setDonations(items);
    } catch (err) {
      console.warn('Backend unavailable, using mock data:', err);
      // Graceful fallback to mock data when backend is offline
      setDonations(INITIAL_DONATIONS);
    } finally {
      setDonationsLoading(false);
    }
  }, []);

  // Helper: load notifications from backend
  const loadNotifications = useCallback(async (userId: string) => {
    try {
      const items = await getNotifications(userId);
      setNotifications(items);
    } catch (err) {
      console.warn('Could not load notifications:', err);
    }
  }, []);

  // 1. Firebase Auth listener to sync logged-in profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          if (userDoc.exists()) {
            const profile = userDoc.data() as UserProfile;
            setUser(profile);
            // Load notifications for this user from backend
            loadNotifications(profile.email);
          } else {
            // Safe fallback profile registration if not written yet
            const fallbackProfile: UserProfile = {
              name: authUser.displayName || 'Authorized Member',
              email: authUser.email || '',
              phone: '9876543210',
              address: 'Gachibowli Area, Hyderabad, Telangana',
              profilePhoto: authUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              role: 'donor',
              orgName: 'Community Alliance Resto',
              regId: 'FSSAI-120029384871'
            };
            await setDoc(doc(db, 'users', authUser.uid), fallbackProfile);
            setUser(fallbackProfile);
          }
        } catch (err) {
          console.error("Error fetching registered user profile from Firestore:", err);
        }
      } else {
        setUser(null);
        setNotifications([]);
      }
    });

    return () => unsubscribe();
  }, [loadNotifications]);

  // 2. Load donations from Supabase backend on mount
  useEffect(() => {
    loadDonations();
  }, [loadDonations]);

  // 3. Mirror local user profile edits back into persistent Firestore (auth profile only)
  useEffect(() => {
    if (user && auth.currentUser) {
      const syncProfile = async () => {
        try {
          const userDocRef = doc(db, 'users', auth.currentUser!.uid);
          const currentDoc = await getDoc(userDocRef);
          if (currentDoc.exists() && JSON.stringify(currentDoc.data()) === JSON.stringify(user)) {
            return; // prevent redundant loop writes
          }
          await setDoc(userDocRef, user, { merge: true });
        } catch (err) {
          console.error("Error syncing profile update to Firestore:", err);
        }
      };
      syncProfile();
    }
  }, [user]);

  // Update donations state and optionally sync deleted item to backend
  const handleUpdateDonations = async (nextValue: DonationItem[] | ((prev: DonationItem[]) => DonationItem[])) => {
    const prev = donations;
    const nextList = typeof nextValue === 'function' ? nextValue(prev) : nextValue;

    // Detect deleted items and call delete API
    for (const prevItem of prev) {
      if (!nextList.some(n => n.id === prevItem.id)) {
        try {
          await deleteFoodDonation(prevItem.id);
        } catch (err) {
          console.error('Error deleting donation from backend:', err);
        }
      }
    }

    // Detect status changes and sync to backend
    for (const item of nextList) {
      const prevItem = prev.find(p => p.id === item.id);
      if (prevItem && prevItem.status !== item.status) {
        try {
          await updateFoodStatus(item.id, item.status);
        } catch (err) {
          console.error('Error updating donation status on backend:', err);
        }
      }
    }

    // Always update local state immediately for responsive UI
    setDonations(nextList);
    // Then re-fetch from backend to get fresh server state
    setTimeout(() => loadDonations(), 500);
  };

  const handleUpdateNotifications = async (nextValue: Notification[] | ((prev: Notification[]) => Notification[])) => {
    const nextList = typeof nextValue === 'function' ? nextValue(notifications) : nextValue;
    // Update local state immediately for responsive UI
    setNotifications(nextList);
  };

  // Synchronize localStorage for theme/lang config preferences
  useEffect(() => {
    localStorage.setItem('foodbridge_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('foodbridge_lang', lang);
  }, [lang]);

  // Helper trigger for notifications & toast alert overlays
  const triggerNotification = async (type: string, title: string, message: string, donationId?: string) => {
    const newNotif: Notification = {
      id: 'N-' + Math.floor(1000 + Math.random() * 9000),
      type: type as any,
      title,
      message,
      time: 'Just Now',
      read: false,
      donationId
    };

    // Update local state immediately
    setNotifications(prev => [newNotif, ...prev]);

    // Persist notification to backend if user is logged in
    if (user?.email) {
      try {
        await createNotification(user.email, message, type, title, donationId);
      } catch (err) {
        console.warn('Could not persist notification to backend:', err);
      }
    }

    // Visual Toast overlay
    const newToast: Toast = {
      id: Math.random().toString(),
      type,
      title,
      message
    };
    setToasts(prev => [newToast, ...prev]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getToastStyle = (type: string) => {
    switch (type) {
      case 'New Donation': return 'border-emerald-500 bg-emerald-500/10 text-emerald-650';
      case 'Pickup Request': return 'border-blue-500 bg-blue-500/10 text-blue-650';
      case 'Accepted Donation': return 'border-indigo-500 bg-indigo-500/10 text-indigo-650';
      default: return 'border-slate-500 bg-slate-500/10 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/30">
      
      {/* Background Ambience Underlay */}
      <FoodBackground />

      {/* Sticky Global Navbar */}
      <Navbar
        currentLang={lang}
        setLang={setLang}
        theme={theme}
        toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
        user={user}
        onLogout={() => {
          signOut(auth).then(() => {
            setUser(null);
            setActivePage('home');
          }).catch((err) => {
            console.error("Firebase signOut failure:", err);
            setUser(null);
            setActivePage('home');
          });
        }}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Main Orchestration Board content body */}
      <main className="flex-grow pt-20">
        {(activePage === 'home' || activePage === 'features' || activePage === 'about' || activePage === 'impact') && (
          <PageTransition>
            <HomePage 
              currentLang={lang} 
              setActivePage={setActivePage} 
              activeSection={activePage}
              stats={{
                donations: donations.length,
                foodSaved: 140,
                ngosConnected: 15,
                peopleServed: 280
              }}
            />
          </PageTransition>
        )}
        
        {activePage === 'login' && (
          <PageTransition>
            <LoginPage 
              currentLang={lang} 
              onLogin={(verifiedUser) => {
                setUser(verifiedUser);
                setActivePage(verifiedUser.role === 'donor' ? 'donor-dash' : verifiedUser.role === 'ngo' ? 'ngo-dash' : 'admin-dash');
              }} 
              setActivePage={setActivePage} 
            />
          </PageTransition>
        )}
        
        {activePage === 'donor-dash' && user && (
          <PageTransition>
            <DonorDashboard
              currentLang={lang}
              user={user}
              donations={donations}
              setDonations={handleUpdateDonations}
              triggerNotification={triggerNotification}
              setActivePage={setActivePage}
              setTrackingDonationId={setTrackingDonationId}
            />
          </PageTransition>
        )}

        {activePage === 'ngo-dash' && user && (
          <PageTransition>
            <NgoDashboard
              currentLang={lang}
              user={user}
              donations={donations}
              setDonations={handleUpdateDonations}
              triggerNotification={triggerNotification}
              setActivePage={setActivePage}
              setTrackingDonationId={setTrackingDonationId}
            />
          </PageTransition>
        )}

        {activePage === 'tracking' && (
          <PageTransition>
            <TrackingPage
              currentLang={lang}
              donations={donations}
              trackingDonationId={trackingDonationId}
              setTrackingDonationId={setTrackingDonationId}
            />
          </PageTransition>
        )}

        {activePage === 'notifications' && (
          <PageTransition>
            <NotificationCenter
              currentLang={lang}
              notifications={notifications}
              setNotifications={handleUpdateNotifications}
              setActivePage={setActivePage}
              setTrackingDonationId={setTrackingDonationId}
            />
          </PageTransition>
        )}

        {activePage === 'map' && (
          <PageTransition>
            <MapPage
              currentLang={lang}
              donations={donations}
              setDonations={handleUpdateDonations}
              triggerNotification={triggerNotification}
            />
          </PageTransition>
        )}

        {activePage === 'admin-dash' && (
          <PageTransition>
            <AdminDashboard
              currentLang={lang}
              triggerNotification={triggerNotification}
            />
          </PageTransition>
        )}

        {activePage === 'profile' && user && (
          <PageTransition>
            <ProfilePage
              currentLang={lang}
              user={user}
              setUser={setUser}
              triggerNotification={triggerNotification}
            />
          </PageTransition>
        )}
      </main>

      {/* Footer Branding copyright bar */}
      <footer className="border-t border-slate-200/50 dark:border-slate-900 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md py-6 text-center select-none z-10">
        <p className="text-[10px] font-mono font-bold tracking-widest text-slate-400 capitalize">
          © {new Date().getFullYear()} FoodBridge Alliance • Verified hackathon clearance. Reduced Food Waste, Feed More Lives.
        </p>
      </footer>

      {/* 5. VISUAL FLUID TOAST OVERLAYS DRAWER */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full select-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`p-4.5 rounded-2xl border backdrop-blur-md shadow-2xl flex items-start gap-3 relative overflow-hidden transition-all duration-300 animate-in slide-in-from-right-5 ${getToastStyle(toast.type)}`}
          >
            {/* Visual glow indicator */}
            <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-emerald-500"></div>
            
            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
            
            <div className="space-y-0.5 pr-4 flex-grow selection:bg-transparent">
              <h5 className="text-xs font-black uppercase text-slate-900 dark:text-white leading-tight">{toast.title}</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-300 leading-snug font-light">{toast.message}</p>
            </div>

            <button 
              onClick={() => handleDismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              title="Close Notification banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
