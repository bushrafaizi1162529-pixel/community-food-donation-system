/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DonationItem, Notification, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Sanjay Kumar (Marriott Resto)',
  email: 'donor@foodbridge.org',
  phone: '9876543210',
  address: 'Marriott Gachibowli, Hyderabad, Telangana',
  profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  role: 'donor',
  orgName: 'Marriott Gachibowli Resto Team',
  regId: 'FSSAI-120029384871'
};

export const INITIAL_DONATIONS: DonationItem[] = [
  {
    id: 'FB-9001',
    donorId: 'donor1',
    donorName: 'Grand Marriott Resto',
    foodName: 'Surplus Cooked Vegetable Biryani & Kurma',
    quantity: '35 kg (Feeds ~70 people)',
    category: 'Meal',
    vegNonVeg: 'Veg',
    expiryTime: '2026-06-15T23:59:00Z',
    pickupTime: '06:00 PM - 09:00 PM',
    pickupAddress: 'Gachibowli DLF IT Park Road, Hyderabad, Telangana',
    contactNumber: '9876543210',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=60',
    status: 'Available',
    createdAt: '2026-06-15T01:10:00Z',
    lat: 17.4483,
    lng: 78.3741,
    distance: '1.2 km',
    notes: 'Kept in deep vapor coolers. Needs immediate collection. Bring large insulated aluminum carriers.'
  },
  {
    id: 'FB-9002',
    donorId: 'donor2',
    donorName: 'Daily Fresh Wheat Bakers',
    foodName: 'Unbaked Wheat Loaves & Fresh Bread',
    quantity: '60 Packets (Large)',
    category: 'Bakery',
    vegNonVeg: 'Veg',
    expiryTime: '2026-06-16T18:00:00Z',
    pickupTime: '08:00 AM - 12:00 PM',
    pickupAddress: 'Sector 15, Dwarka, New Delhi',
    contactNumber: '9123456789',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=60',
    status: 'Requested',
    createdAt: '2026-06-14T20:00:00Z',
    lat: 28.5921,
    lng: 77.0460,
    distance: '4.8 km',
    assignedNgoId: 'ngo1',
    assignedNgoName: 'Hope Wellness Kitchens',
    notes: 'Packed in clean eco-paper bags. Excellent for breakfast distributions.'
  },
  {
    id: 'FB-9003',
    donorId: 'donor3',
    donorName: 'Super Fresh Grocers',
    foodName: 'Assorted Organic Tomatoes, Potatoes & Greens',
    quantity: '45 kg',
    category: 'Raw Veggies',
    vegNonVeg: 'Veg',
    expiryTime: '2026-06-17T20:00:00Z',
    pickupTime: '10:00 AM - 04:00 PM',
    pickupAddress: 'Koramangala 4th Block, Bangalore, Karnataka',
    contactNumber: '956789123  4',
    imageUrl: 'https://images.unsplash.com/photo-1566385101042-1a0104524c66?w=600&auto=format&fit=crop&q=60',
    status: 'Accepted',
    createdAt: '2026-06-15T00:30:00Z',
    lat: 12.9344,
    lng: 77.6192,
    distance: '2.5 km',
    assignedNgoId: 'ngo1',
    assignedNgoName: 'Hope Wellness Kitchens',
    notes: 'Unsold from fresh morning counters. Completely raw and fresh. Needs sorting.'
  },
  {
    id: 'FB-9004',
    donorId: 'donor4',
    donorName: 'Annapurna Homestyle Kitchens',
    foodName: 'Rice, Dal Tadka & Mix Vegetable Sambar',
    quantity: '100 Meal Boxes',
    category: 'Meal',
    vegNonVeg: 'Veg',
    expiryTime: '2026-06-14T15:00:00Z',
    pickupTime: '01:00 PM - 03:00 PM',
    pickupAddress: 'Marine Drive Shelter Colony, Kochi, Kerala',
    contactNumber: '9345678912',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60',
    status: 'Delivered',
    createdAt: '2026-06-14T08:00:00Z',
    lat: 9.9763,
    lng: 76.2741,
    distance: '6.1 km',
    assignedNgoId: 'ngo2',
    assignedNgoName: 'Kochi Community Shelter',
    notes: 'Freshly cooked for a large wedding hall session. Surplus stored in sterile food grade boxes.'
  },
  {
    id: 'FB-9005',
    donorId: 'donor1',
    donorName: 'Grand Marriott Resto',
    foodName: 'Spicy Chicken Wrap Rolls',
    quantity: '20 Packets',
    category: 'Packed Food',
    vegNonVeg: 'Non-Veg',
    expiryTime: '2026-06-15T22:00:00Z',
    pickupTime: '07:00 PM - 10:00 PM',
    pickupAddress: 'Gachibowli DLF IT Park Road, Hyderabad, Telangana',
    contactNumber: '9876543210',
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6518c4793f4f?w=600&auto=format&fit=crop&q=60',
    status: 'Available',
    createdAt: '2026-06-15T01:30:00Z',
    lat: 17.4495,
    lng: 78.3755,
    distance: '0.8 km',
    notes: 'Packed rolls with secure foil. Store in heavy refrigeration.'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'nt-001',
    type: 'New Donation',
    title: 'New Donation Nearby',
    message: 'Grand Marriott Resto just listed 35 kg of Surplus Vegetable Biryani in DLF Road!',
    time: '2 mins ago',
    read: false,
    donationId: 'FB-9001'
  },
  {
    id: 'nt-002',
    type: 'Pickup Request',
    title: 'Pickup Request Approved',
    message: 'FoodBridge Auto Matcher paired Hope Wellness Kitchens to collect Wheat Bread Packets.',
    time: '3 hours ago',
    read: false,
    donationId: 'FB-9002'
  },
  {
    id: 'nt-003',
    type: 'Accepted Donation',
    title: 'Donation Claim Locked',
    message: 'Hope Wellness Kitchens accepted your listing of Raw Groceries and launched transport.',
    time: '5 hours ago',
    read: true,
    donationId: 'FB-9003'
  },
  {
    id: 'nt-004',
    type: 'Delivered Donation',
    title: 'Successfully Delivered!',
    message: 'Kochi Community Shelter marked 100 Meal Boxes from Annapurna Kitchens as delivered.',
    time: '1 day ago',
    read: true,
    donationId: 'FB-9004'
  }
];

// Helper functions for LocalStorage management
export const getStoredUser = (): UserProfile => {
  const user = localStorage.getItem('foodbridge_user');
  if (user) return JSON.parse(user);
  localStorage.setItem('foodbridge_user', JSON.stringify(INITIAL_USER));
  return INITIAL_USER;
};

export const saveStoredUser = (user: UserProfile) => {
  localStorage.setItem('foodbridge_user', JSON.stringify(user));
};

export const getStoredDonations = (): DonationItem[] => {
  const list = localStorage.getItem('foodbridge_donations');
  if (list) return JSON.parse(list);
  localStorage.setItem('foodbridge_donations', JSON.stringify(INITIAL_DONATIONS));
  return INITIAL_DONATIONS;
};

export const saveStoredDonations = (list: DonationItem[]) => {
  localStorage.setItem('foodbridge_donations', JSON.stringify(list));
};

export const getStoredNotifications = (): Notification[] => {
  const list = localStorage.getItem('foodbridge_notifications');
  if (list) return JSON.parse(list);
  localStorage.setItem('foodbridge_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
  return INITIAL_NOTIFICATIONS;
};

export const saveStoredNotifications = (list: Notification[]) => {
  localStorage.setItem('foodbridge_notifications', JSON.stringify(list));
};
