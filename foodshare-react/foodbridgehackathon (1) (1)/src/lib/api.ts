/**
 * API service layer — connects the React frontend to the Express/Supabase backend.
 * All backend calls go through here. Firebase is still used ONLY for authentication.
 */

import { API_BASE_URL } from './config';
import { DonationItem, Notification, UserProfile } from '../types';

// --- Helpers ------------------------------------------------------------------

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `API error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// --- Status normalisation ------------------------------------------------------
// Backend stores lowercase 'available'; frontend uses 'Available', 'Requested', etc.

const STATUS_TO_BACKEND: Record<string, string> = {
  'Available':  'available',
  'Requested':  'requested',
  'Accepted':   'accepted',
  'Picked Up':  'picked_up',
  'Delivered':  'delivered',
};

const STATUS_FROM_BACKEND: Record<string, DonationItem['status']> = {
  'available':  'Available',
  'requested':  'Requested',
  'accepted':   'Accepted',
  'picked_up':  'Picked Up',
  'delivered':  'Delivered',
};

// --- Data Shape Mapping --------------------------------------------------------
// Maps backend snake_case rows ? frontend camelCase DonationItem objects

function mapDonationFromBackend(row: Record<string, unknown>): DonationItem {
  return {
    id:             String(row.id ?? ''),
    donorId:        String(row.donor_id ?? ''),
    donorName:      String(row.donor_name ?? 'Donor'),
    foodName:       String(row.food_name ?? ''),
    quantity:       String(row.quantity ?? ''),
    category:       (row.category as DonationItem['category']) || 'Meal',
    vegNonVeg:      (row.veg_non_veg as DonationItem['vegNonVeg']) || 'Veg',
    expiryTime:     String(row.expiry_time ?? ''),
    pickupTime:     String(row.pickup_time ?? 'Immediate'),
    pickupAddress:  String(row.location ?? ''),
    contactNumber:  String(row.contact_number ?? ''),
    imageUrl:       String(row.image_url ?? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'),
    status:         STATUS_FROM_BACKEND[String(row.status ?? 'available')] ?? 'Available',
    createdAt:      String(row.created_at ?? new Date().toISOString()),
    lat:            Number(row.latitude ?? 17.4480),
    lng:            Number(row.longitude ?? 78.3740),
    distance:       String(row.distance ?? ''),
    notes:          String(row.description ?? ''),
    assignedNgoId:  row.assigned_ngo_id ? String(row.assigned_ngo_id) : undefined,
    assignedNgoName: row.assigned_ngo_name ? String(row.assigned_ngo_name) : undefined,
  };
}

function mapNotificationFromBackend(row: Record<string, unknown>): Notification {
  return {
    id:         String(row.id ?? ''),
    type:       (row.type as Notification['type']) || 'New Donation',
    title:      String(row.title ?? row.message ?? 'Notification'),
    message:    String(row.message ?? ''),
    time:       row.created_at
      ? new Date(String(row.created_at)).toLocaleTimeString()
      : 'Just Now',
    read:       Boolean(row.is_read ?? false),
    donationId: row.donation_id ? String(row.donation_id) : undefined,
    userId:     row.user_id ? String(row.user_id) : undefined,
  };
}

// --- Users ---------------------------------------------------------------------

export interface RegisterUserPayload {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export async function registerUser(payload: RegisterUserPayload): Promise<void> {
  await apiFetch('/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getUsers(): Promise<UserProfile[]> {
  const rows = await apiFetch<Record<string, unknown>[]>('/users');
  return rows.map((r) => ({
    name:         String(r.name ?? ''),
    email:        String(r.email ?? ''),
    phone:        String(r.phone ?? ''),
    address:      String(r.address ?? ''),
    profilePhoto: String(r.profile_photo ?? ''),
    role:         (r.role as UserProfile['role']) || 'donor',
    orgName:      r.org_name ? String(r.org_name) : undefined,
    regId:        r.reg_id ? String(r.reg_id) : undefined,
  }));
}

// --- Food Donations ------------------------------------------------------------

export async function getFoodDonations(): Promise<DonationItem[]> {
  const rows = await apiFetch<Record<string, unknown>[]>('/food');
  return rows.map(mapDonationFromBackend);
}

export async function getFoodById(id: string): Promise<DonationItem> {
  const row = await apiFetch<Record<string, unknown>>(`/food/${id}`);
  return mapDonationFromBackend(row);
}

export interface CreateFoodPayload {
  food_name: string;
  quantity: string;
  description?: string;
  expiry_time: string;
  location: string;
  latitude?: number;
  longitude?: number;
  donor_id: string;
  donor_name?: string;
  category?: string;
  veg_non_veg?: string;
  pickup_time?: string;
  contact_number?: string;
  image_url?: string;
}

export async function createFoodDonation(payload: CreateFoodPayload): Promise<DonationItem[]> {
  const rows = await apiFetch<Record<string, unknown>[]>('/food', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return rows.map(mapDonationFromBackend);
}

export async function updateFoodStatus(id: string, status: string): Promise<DonationItem[]> {
  const backendStatus = STATUS_TO_BACKEND[status] ?? status.toLowerCase();
  const rows = await apiFetch<Record<string, unknown>[]>(`/food/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status: backendStatus }),
  });
  return rows.map(mapDonationFromBackend);
}

export async function updateFoodDetails(id: string, payload: Partial<CreateFoodPayload>): Promise<DonationItem[]> {
  const rows = await apiFetch<Record<string, unknown>[]>(`/food/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return rows.map(mapDonationFromBackend);
}

export async function deleteFoodDonation(id: string): Promise<void> {
  await apiFetch(`/food/${id}`, { method: 'DELETE' });
}

// --- Pickup Requests -----------------------------------------------------------

export interface PickupRequest {
  id: string;
  food_id: string;
  ngo_id: string;
  status: string;
  created_at?: string;
}

export async function createPickupRequest(food_id: string, ngo_id: string): Promise<PickupRequest[]> {
  return apiFetch<PickupRequest[]>('/pickup', {
    method: 'POST',
    body: JSON.stringify({ food_id, ngo_id }),
  });
}

export async function updatePickupStatus(
  id: string,
  status: string,
  ngo_id: string
): Promise<PickupRequest[]> {
  return apiFetch<PickupRequest[]>(`/pickup/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status, ngo_id }),
  });
}

export async function getPickupRequests(): Promise<PickupRequest[]> {
  return apiFetch<PickupRequest[]>('/pickup');
}

// --- Notifications -------------------------------------------------------------

export async function getNotifications(user_id: string): Promise<Notification[]> {
  const rows = await apiFetch<Record<string, unknown>[]>(`/notifications/${user_id}`);
  return rows.map(mapNotificationFromBackend);
}

export async function createNotification(user_id: string, message: string, type?: string, title?: string, donation_id?: string): Promise<void> {
  await apiFetch('/notifications', {
    method: 'POST',
    body: JSON.stringify({ user_id, message, type, title, donation_id }),
  });
}
