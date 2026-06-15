/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TRANSLATIONS } from '../data/translations';
import { AppLanguage, UserRole, UserProfile } from '../types';
import { Eye, EyeOff, ShieldCheck, Mail, Lock, User, UserCheck, Smartphone, MapPin, Sparkles, AlertCircle } from 'lucide-react';

import { auth, db } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { registerUser } from '../lib/api';

interface LoginPageProps {
  currentLang: AppLanguage;
  onLogin: (user: UserProfile) => void;
  setActivePage: (page: any) => void;
}

export default function LoginPage({ currentLang, onLogin, setActivePage }: LoginPageProps) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Form toggles
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Input states
  const [role, setRole] = useState<UserRole>('donor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [orgName, setOrgName] = useState('');
  const [regId, setRegId] = useState('');
  
  // Interactive Feedbacks
  const [errorMsg, setErrorMsg] = useState('');
  const [successAnimation, setSuccessAnimation] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Basic verification validation
    if (!email || !password) {
      setErrorMsg('Please populate critical credentials.');
      return;
    }

    if (isRegisterMode) {
      if (!name || !phone || !address) {
        setErrorMsg('Please populate necessary details.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Confirmation password mismatch.');
        return;
      }
    }

    setSuccessAnimation(true);
    try {
      let credential;
      if (isRegisterMode) {
        credential = await createUserWithEmailAndPassword(auth, email, password);
        const finalProfile: UserProfile = {
          name,
          email,
          phone,
          address,
          profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          role: role || 'donor',
          orgName: orgName || name,
          regId: regId || 'FSSAI-' + Math.floor(100000 + Math.random() * 900000)
        };
        await setDoc(doc(db, 'users', credential.user.uid), finalProfile);
        // Also register user in Supabase backend
        try {
          await registerUser({ name, email, phone, role: role || 'donor' });
        } catch (apiErr) {
          console.warn('Could not sync user to Supabase backend:', apiErr);
        }
        setSuccessAnimation(false);
        onLogin(finalProfile);
      } else {
        credential = await signInWithEmailAndPassword(auth, email, password);
        const userRef = doc(db, 'users', credential.user.uid);
        const userSnap = await getDoc(userRef);
        let finalProfile: UserProfile;
        if (userSnap.exists()) {
          finalProfile = userSnap.data() as UserProfile;
        } else {
          finalProfile = {
            name: 'Sanjay Kumar (Marriott Resto)',
            email: email,
            phone: '9876543210',
            address: 'DLF Gachibowli, Hyderabad, Telangana',
            profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            role: role || 'donor',
            orgName: orgName || 'Marriott Gachibowli Resto Team',
            regId: regId || 'FSSAI-120029384871'
          };
          await setDoc(userRef, finalProfile);
        }
        setSuccessAnimation(false);
        onLogin(finalProfile);
      }
    } catch (error: any) {
      setSuccessAnimation(false);
      console.error("Auth submit failed", error);
      setErrorMsg(error.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleShortcutLogin = async (roleName: UserRole, userEmail: string) => {
    setSuccessAnimation(true);
    setErrorMsg('');
    const defaultPassword = 'Password123!';

    try {
      let credential;
      try {
        credential = await signInWithEmailAndPassword(auth, userEmail, defaultPassword);
      } catch (signInErr: any) {
        if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential' || signInErr.message?.includes('not-found') || signInErr.message?.includes('credential') || signInErr.message?.includes('EMAIL_NOT_FOUND')) {
          credential = await createUserWithEmailAndPassword(auth, userEmail, defaultPassword);
        } else {
          throw signInErr;
        }
      }

      const userRef = doc(db, 'users', credential.user.uid);
      const userSnap = await getDoc(userRef);
      let mockProfile: UserProfile;

      if (userSnap.exists()) {
        mockProfile = userSnap.data() as UserProfile;
      } else {
        if (roleName === 'ngo') {
          mockProfile = {
            name: 'Hope Wellness Kitchens',
            email: userEmail,
            phone: '9123456789',
            address: 'Indiranagar 80 Feet Road, Bangalore, Karnataka',
            profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
            role: 'ngo',
            orgName: 'Hope Wellness Alliance',
            regId: 'NGO-REG-99120AS'
          };
        } else if (roleName === 'admin') {
          mockProfile = {
            name: 'National Admin Controller',
            email: userEmail,
            phone: '9999999999',
            address: 'Ministry Secretariat, New Delhi',
            profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            role: 'admin',
            orgName: 'Ministry of State Planning',
            regId: 'GOV-SEC-PRIMARY'
          };
        } else {
          mockProfile = {
            name: 'Sanjay Kumar (Marriott Resto)',
            email: userEmail,
            phone: '9876543210',
            address: 'Marriott Gachibowli, Hyderabad, Telangana',
            profilePhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
            role: 'donor',
            orgName: 'Marriott Resto Team',
            regId: 'FSSAI-120029384871'
          };
        }
        await setDoc(userRef, mockProfile);
      }

      setSuccessAnimation(false);
      onLogin(mockProfile);
    } catch (e: any) {
      setSuccessAnimation(false);
      console.error("Shortcut login failed", e);
      setErrorMsg(e.message || 'Quick login shortcut failed.');
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-10 w-full bg-radial-gradient from-emerald-500/5 via-blue-500/5 to-transparent">
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Glassmorphic Auth Form Form */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <motion.div 
            initial={{ opacity: 0, x: -20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="w-full glass-light dark:glass-dark p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-lg h-full flex flex-col justify-between"
          >
            <div>
              {/* Success / Loading Screen Overlay */}
              {successAnimation && (
                <div className="absolute inset-0 bg-white/95 dark:bg-slate-950/95 z-20 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-4"></div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white font-mono uppercase tracking-wider animate-pulse flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Authenticating Core Key...
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Connecting to Cloud Firestore DB Cluster...</p>
                </div>
              )}

              <div className="text-center space-y-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-green-500 to-blue-500 flex items-center justify-center text-white font-bold ml-auto mr-auto shadow-md transform hover:rotate-12 transition-transform duration-300">
                  FB
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {t.auth_welcome_title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light max-w-sm mx-auto leading-relaxed">
                  {t.auth_welcome_desc}
                </p>
              </div>

              {/* Action Toggles for Login / Register Panels */}
              <div className="flex border-b border-slate-100 dark:border-slate-800 p-1 bg-slate-50 dark:bg-slate-950 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => { setIsRegisterMode(false); setErrorMsg(''); }}
                  className={`w-1/2 py-2 text-xs font-bold rounded-lg transition-all ${
                    !isRegisterMode 
                      ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {t.auth_tab_login}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsRegisterMode(true); setErrorMsg(''); }}
                  className={`w-1/2 py-2 text-xs font-bold rounded-lg transition-all ${
                    isRegisterMode 
                      ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {t.auth_tab_register}
                </button>
              </div>

              {/* Validation Errors feedback */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2.5 mb-4 animate-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Interactive Forms */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                
                {/* Access Roles trigger */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1.5">{t.auth_label_role}</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    <option value="donor">{t.auth_role_donor}</option>
                    <option value="ngo">{t.auth_role_ngo}</option>
                    <option value="admin">{t.auth_role_admin}</option>
                  </select>
                </div>

                {/* Conditional Name field */}
                {isRegisterMode && (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1.5">{t.auth_label_name}</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Grand Marriott Banquet"
                        className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* Email field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1.5">{t.auth_label_email}</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g., donor@foodbridge.org"
                      className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Conditional Phone field */}
                {isRegisterMode && (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1.5">{t.auth_label_phone}</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g., 98765 43210"
                        className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* Conditional Address field */}
                {isRegisterMode && (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1.5">Pickup Address / Hub Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g., Gachibowli DLF, Hyderabad, Telangana"
                        className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* Password field */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-400">{t.auth_label_password}</label>
                    {!isRegisterMode && (
                      <button 
                        type="button" 
                        onClick={() => setErrorMsg('Reset link triggered. Check security mailbox.')}
                        className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        {t.auth_forgot}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                      title="Toggle Visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Conditional Confirm Password field */}
                {isRegisterMode && (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1.5">{t.auth_label_confirm_password}</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* Remember Me block */}
                {!isRegisterMode && (
                  <div className="flex items-center justify-between pt-1 select-none text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded accent-emerald-500" />
                      <span>{t.auth_remember}</span>
                    </label>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 text-xs font-bold font-mono uppercase tracking-wide rounded-xl text-white bg-gradient-to-r from-emerald-600 via-emerald-600 to-green-600 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
                >
                  {isRegisterMode ? t.auth_btn_register : t.auth_btn_login}
                </button>
              </form>
            </div>

            {/* Dynamic toggle trigger */}
            <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setErrorMsg('');
                }}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline transition-colors cursor-pointer"
              >
                {isRegisterMode ? t.auth_toggle_login : t.auth_toggle_register}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Beautiful Interactive Verified Directories Panel */}
        <div className="lg:col-span-7 flex flex-col justify-start">
          <motion.div 
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full glass-light dark:glass-dark p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-2xl space-y-6 relative overflow-hidden h-full flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="space-y-1 mb-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase font-mono tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  Active System Registry Directory
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>Explore Verified Platform Users</span>
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-normal">
                  View complete hospitality records, security credentials, and compliance numbers. Click any profile to simulate an instant secure login session.
                </p>
              </div>

              {/* Profiles stack */}
              <div className="space-y-4">
                
                {/* Profile Card: Donor */}
                <motion.div 
                  whileHover={{ scale: 1.015, y: -2 }}
                  onClick={() => handleShortcutLogin('donor', 'donor@foodbridge.org')}
                  className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/40 to-emerald-500/5 dark:from-slate-900/40 dark:to-emerald-950/10 border border-emerald-500/10 dark:border-emerald-500/5 hover:border-emerald-500/30 dark:hover:border-emerald-400/25 shadow-sm transition-all duration-300 cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg font-bold">
                        🏨
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          Sanjay Kumar
                        </h4>
                        <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 font-bold">
                          Marriott Resto Team (Donor Partner)
                        </p>
                      </div>
                    </div>
                    <span className="self-start sm:self-center px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 uppercase">
                      fssai certified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate"><span className="font-medium text-slate-700 dark:text-slate-300">Phone:</span> +91 98765 43210</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate"><span className="font-medium text-slate-700 dark:text-slate-300">Hub:</span> DLF Gachibowli, Hyderabad, Telangana</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate"><span className="font-medium text-slate-700 dark:text-slate-300">FSSAI ID:</span> FSSAI-120029384871</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0 font-mono text-[10px]">
                      <Mail className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate text-emerald-600 dark:text-emerald-400"><span className="font-bold text-slate-700 dark:text-slate-300 font-sans">Email:</span> donor@foodbridge.org</span>
                    </div>
                  </div>

                  <div className="mt-3.5 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 dark:text-slate-500 text-[9px]">Simulation Security Key: <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono font-bold">Password123!</code></span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Quick Impersonate & Login →
                    </span>
                  </div>
                </motion.div>

                {/* Profile Card: NGO Alliance */}
                <motion.div 
                  whileHover={{ scale: 1.015, y: -2 }}
                  onClick={() => handleShortcutLogin('ngo', 'ngo@foodbridge.org')}
                  className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/40 to-blue-500/5 dark:from-slate-900/40 dark:to-blue-950/10 border border-blue-500/10 dark:border-blue-500/5 hover:border-blue-500/30 dark:hover:border-blue-400/25 shadow-sm transition-all duration-300 cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg font-bold">
                        🏠
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          Hope Wellness Alliance
                        </h4>
                        <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 font-bold">
                          Hope Wellness Kitchens (NGO Network)
                        </p>
                      </div>
                    </div>
                    <span className="self-start sm:self-center px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/15 uppercase">
                      verified ngo
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Smartphone className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <span className="truncate"><span className="font-medium text-slate-700 dark:text-slate-300">Phone:</span> +91 91234 56789</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <span className="truncate"><span className="font-medium text-slate-700 dark:text-slate-300">Location:</span> Indiranagar 80ft Rd, Bangalore, KA</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <span className="truncate"><span className="font-medium text-slate-700 dark:text-slate-300">Reg Code:</span> NGO-REG-99120AS</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0 font-mono text-[10px]">
                      <Mail className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <span className="truncate text-blue-600 dark:text-blue-400"><span className="font-bold text-slate-700 dark:text-slate-300 font-sans">Email:</span> ngo@foodbridge.org</span>
                    </div>
                  </div>

                  <div className="mt-3.5 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 dark:text-slate-500 text-[9px]">Simulation Security Key: <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono font-bold">Password123!</code></span>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Quick Impersonate & Login →
                    </span>
                  </div>
                </motion.div>

                {/* Profile Card: Control Admin */}
                <motion.div 
                  whileHover={{ scale: 1.015, y: -2 }}
                  onClick={() => handleShortcutLogin('admin', 'admin@foodbridge.org')}
                  className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/40 to-rose-500/5 dark:from-slate-900/40 dark:to-rose-950/10 border border-rose-500/10 dark:border-rose-500/5 hover:border-rose-500/30 dark:hover:border-rose-400/25 shadow-sm transition-all duration-300 cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-rose-500/10 transition-colors"></div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-lg font-bold">
                        🛡️
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                          National Admin Controller
                        </h4>
                        <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 font-bold">
                          Ministry of State Planning (Control Center)
                        </p>
                      </div>
                    </div>
                    <span className="self-start sm:self-center px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/15 uppercase">
                      government admin
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Smartphone className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <span className="truncate"><span className="font-medium text-slate-700 dark:text-slate-300">Phone:</span> +91 99999 99999</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <span className="truncate"><span className="font-medium text-slate-700 dark:text-slate-300">Office:</span> Ministry Secretariat, New Delhi</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <span className="truncate"><span className="font-medium text-slate-700 dark:text-slate-300">Sec Code:</span> GOV-SEC-PRIMARY</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0 font-mono text-[10px]">
                      <Mail className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <span className="truncate text-rose-600 dark:text-rose-400"><span className="font-bold text-slate-700 dark:text-slate-300 font-sans">Email:</span> admin@foodbridge.org</span>
                    </div>
                  </div>

                  <div className="mt-3.5 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 dark:text-slate-500 text-[9px]">Simulation Security Key: <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono font-bold">Password123!</code></span>
                    <span className="font-mono text-rose-600 dark:text-rose-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Quick Impersonate & Login →
                    </span>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Bottom Note */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between font-mono">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> VETTED REGULATORY SCHEMAS APPROVED</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">DB ONLINE</span>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
