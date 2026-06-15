/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TRANSLATIONS } from '../data/translations';
import { AppLanguage, Notification } from '../types';
import { Bell, Heart, Check, Trash2, ShieldAlert, Sparkles, AlertCircle, Compass, CircleCheck } from 'lucide-react';

interface NotificationCenterProps {
  currentLang: AppLanguage;
  notifications: Notification[];
  setNotifications: (list: Notification[]) => void;
  setActivePage: (page: any) => void;
  setTrackingDonationId: (id: string | null) => void;
}

export default function NotificationCenter({
  currentLang,
  notifications,
  setNotifications,
  setActivePage,
  setTrackingDonationId
}: NotificationCenterProps) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
  };

  const handleDeleteNotif = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleActionClick = (notif: Notification) => {
    // Mark as read on inspect click
    handleMarkAsRead(notif.id);
    if (notif.donationId) {
      setTrackingDonationId(notif.donationId);
      setActivePage('tracking');
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'New Donation': return '🥗';
      case 'Pickup Request': return '🚚';
      case 'Accepted Donation': return '🛡️';
      case 'Delivered Donation': return '💝';
      default: return '🔔';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 w-full select-none animate-in fade-in duration-300">
      <div className="space-y-6">
        
        {/* Header Options row */}
        <div className="glass-light dark:glass-dark p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-rose-500 flex items-center justify-center font-bold text-lg">
              <Bell className="w-5 h-5 animate-swing" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                {t.notif_title}
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-rose-500 text-white px-2.5 py-0.5 rounded-full font-mono font-bold">
                    {unreadCount} Unread
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">District dispatch alerts broadcast coordinate center.</p>
            </div>
          </div>

          {/* Quick triggers */}
          {notifications.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] w-full sm:w-auto">
              <button
                onClick={handleMarkAllRead}
                className="w-1/2 sm:w-auto px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{t.btn_mark_all.split(' ')[0]} All</span>
              </button>
              <button
                onClick={handleClearAll}
                className="w-1/2 sm:w-auto px-3.5 py-2 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-950 dark:hover:bg-rose-950/20 font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.btn_clear_all.split(' ')[0]} Purge</span>
              </button>
            </div>
          )}
        </div>

        {/* Alerts Grid list */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-md divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden">
          {notifications.map((notif) => (
            <div 
              key={notif.id}
              className={`p-5 flex items-start gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors relative group select-none ${
                !notif.read ? 'bg-blue-500/[0.02] dark:bg-blue-500/[0.01]' : ''
              }`}
            >
              {/* Unread glow dot */}
              {!notif.read && (
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
              )}

              {/* Emoji badge */}
              <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800 text-xl flex items-center justify-center shadow-inner flex-shrink-0 select-none">
                {getNotifIcon(notif.type)}
              </div>

              {/* Message Details */}
              <div className="flex-grow space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500">
                    {notif.type} • {notif.time}
                  </span>
                  
                  {/* Actions row */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 pt-1.5 -mt-2">
                    {!notif.read && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-emerald-500 text-xs"
                        title="Mark read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotif(notif.id)}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-500"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-940 text-slate-900 dark:text-white leading-tight">
                  {notif.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  {notif.message}
                </p>

                {/* Tracking Action Button */}
                {notif.donationId && (
                  <button
                    onClick={() => handleActionClick(notif)}
                    className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all cursor-pointer border border-transparent"
                  >
                    🚀 Track Audit Log
                  </button>
                )}
              </div>

            </div>
          ))}

          {notifications.length === 0 && (
            <div className="py-20 text-center space-y-3">
              <CircleCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <h5 className="text-sm font-bold text-slate-900 dark:text-white">All Alerts Settled</h5>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">No remaining emergency food alerts in your district pipeline queues. Go to dashboards to publish new posts.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
