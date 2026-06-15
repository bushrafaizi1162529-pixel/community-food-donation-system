/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'donor' | 'ngo' | 'admin';

export type FoodCategory = 'Meal' | 'Grocery' | 'Raw Veggies' | 'Bakery' | 'Beverages' | 'Packed Food' | 'Other';

export type VegNonVeg = 'Veg' | 'Non-Veg';

export type DonationStatus = 'Available' | 'Requested' | 'Accepted' | 'Picked Up' | 'Delivered';

export interface DonationItem {
  id: string;
  donorId: string;
  donorName: string;
  foodName: string;
  quantity: string; // e.g., "15 kg", "30 packets"
  category: FoodCategory;
  vegNonVeg: VegNonVeg;
  expiryTime: string; // UTC ISO or simple human-readable string
  pickupTime: string;
  pickupAddress: string;
  contactNumber: string;
  imageUrl: string;
  status: DonationStatus;
  createdAt: string;
  lat: number;
  lng: number;
  distance?: string; // e.g., "1.2 km"
  notes?: string;
  assignedNgoId?: string;
  assignedNgoName?: string;
}

export type NotificationType = 'New Donation' | 'Pickup Request' | 'Accepted Donation' | 'Delivered Donation';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  donationId?: string;
  userId?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  profilePhoto: string;
  role: UserRole;
  orgName?: string;
  regId?: string;
}

export type AppLanguage = 'en' | 'te' | 'hi' | 'kn' | 'ml';

export type AppTheme = 'light' | 'dark';
