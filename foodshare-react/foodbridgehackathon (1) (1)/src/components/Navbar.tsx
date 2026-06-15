/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, Globe, Sun, Moon, LogIn, Heart, User, Sparkles, LogOut, ShieldAlert } from 'lucide-react';
import { AppLanguage, AppTheme } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface NavbarProps {
  currentLang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  theme: AppTheme;
  toggleTheme: () => void;
  activePage: string;
  setActivePage: (page: any) => void;
  user: any;
  onLogout: () => void;
}

export default function Navbar({
  currentLang,
  setLang,
  theme,
  toggleTheme,
  activePage,
  setActivePage,
  user,
  onLogout,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const languages: { code: AppLanguage; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ml', label: 'മലയാളം (Malayalam)' },
  ];

  const handlePageClick = (page: string) => {
    setActivePage(page);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'home', label: t.nav_home },
    { id: 'features', label: t.nav_features },
    { id: 'about', label: t.nav_about },
    { id: 'impact', label: t.nav_impact },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 select-none shadow-sm glass border-b border-white/20 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo / Brand */}
          <div 
            onClick={() => handlePageClick('home')} 
            className="flex items-center gap-2.5 cursor-pointer group"
            id="nav-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-green-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-green-500/10 group-hover:scale-105 transition-transform duration-300">
              FB
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 dark:from-emerald-400 dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                {t.logo}
              </span>
              <p className="text-[9px] -mt-1 tracking-wider text-slate-500 dark:text-slate-400 font-mono hidden sm:block uppercase">
                {currentLang === 'en' ? 'Community Rescue' : 'ఉచిత ఆహార సేవ'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handlePageClick(link.id)}
                className={`text-sm font-medium transition-colors hover:text-emerald-500 relative py-1.5 ${
                  activePage === link.id 
                    ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 dark:border-emerald-400' 
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right hand Side Actions & Multi-Controls */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800 cursor-pointer"
                id="language-selector-btn"
              >
                <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>{languages.find(l => l.code === currentLang)?.label.split(' ')[0]}</span>
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="p-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLang(lang.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-between ${
                          currentLang === lang.code
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{lang.label}</span>
                        {currentLang === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dark & Light Theme Slider */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800 cursor-pointer"
              title="Toggle Theme"
              id="theme-toggle-btn"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-emerald-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Logical Dashboard Router action button */}
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePageClick(user.role === 'donor' ? 'donor-dash' : user.role === 'ngo' ? 'ngo-dash' : 'admin-dash')}
                  className="flex items-center gap-1.5 px-4.5 py-2 text-xs font-semibold rounded-lg shadow-sm border border-emerald-500 hover:bg-emerald-500 hover:text-white dark:text-emerald-400 dark:hover:text-white transition-all duration-200 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t.donor_sidebar_dash}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handlePageClick('login')}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-500 transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-slate-400" />
                  <span>{t.nav_login}</span>
                </button>
                <button
                  onClick={() => handlePageClick('login')}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-md shadow-emerald-500/20 active:scale-95 transition-all duration-150 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white/20" />
                  <span>{t.nav_btn_donate}</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu block */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Quick Mobile Theme Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 border-b animate-in slide-in-from-top-1 duration-250 select-none">
          <div className="px-4 pt-3 pb-6 space-y-4">
            
            <div className="space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handlePageClick(link.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activePage === link.id
                      ? 'bg-emerald-500 text-white font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Language Selection Grid on Mobile */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold px-3 mb-1.5 flex items-center gap-1">
                <Globe className="w-3 h-3" /> Select Language
              </p>
              <div className="grid grid-cols-2 gap-1.5 px-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLang(lang.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`px-3 py-1.5 text-[11px] font-semibold rounded-md border text-center ${
                      currentLang === lang.code
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950'
                    }`}
                  >
                    {lang.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* CTA action buttons in mobile drawer */}
            {user ? (
              <div className="space-y-2">
                <button
                  onClick={() => handlePageClick(user.role === 'donor' ? 'donor-dash' : user.role === 'ngo' ? 'ngo-dash' : 'admin-dash')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg text-white bg-slate-800 dark:bg-slate-100 dark:text-slate-900 hover:opacity-90"
                >
                  <User className="w-4 h-4" />
                  <span>{t.donor_sidebar_dash}</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg border border-rose-200 text-rose-500 dark:border-rose-950 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.nav_logout}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <button
                  onClick={() => handlePageClick('login')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
                >
                  <LogIn className="w-4.5 h-4.5 text-slate-400" />
                  <span>{t.nav_login}</span>
                </button>
                <button
                  onClick={() => handlePageClick('login')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold rounded-lg text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-md"
                >
                  <Heart className="w-4 h-4 fill-white/20" />
                  <span>{t.nav_btn_donate}</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </header>
  );
}
