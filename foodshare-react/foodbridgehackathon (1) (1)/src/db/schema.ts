import { pgTable, text, boolean, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  uid: text("uid").primaryKey(), // Firebase UID
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  profilePhoto: text("profile_photo"),
  role: text("role").notNull(), // 'donor' | 'ngo' | 'admin'
  orgName: text("org_name"),
  regId: text("reg_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const donations = pgTable("donations", {
  id: text("id").primaryKey(),
  donorId: text("donor_id").notNull().references(() => users.uid, { onDelete: "cascade" }),
  donorName: text("donor_name").notNull(),
  foodName: text("food_name").notNull(),
  quantity: text("quantity").notNull(),
  category: text("category").notNull(), // FoodCategory
  vegNonVeg: text("veg_non_veg").notNull(), // VegNonVeg
  expiryTime: text("expiry_time").notNull(),
  pickupTime: text("pickup_time").notNull(),
  pickupAddress: text("pickup_address").notNull(),
  contactNumber: text("contact_number").notNull(),
  imageUrl: text("image_url"),
  status: text("status").notNull(), // DonationStatus
  createdAt: text("created_at").notNull(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  distance: text("distance"),
  notes: text("notes"),
  assignedNgoId: text("assigned_ngo_id").references(() => users.uid, { onDelete: "set null" }),
  assignedNgoName: text("assigned_ngo_name"),
});

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  type: text("type").notNull(), // NotificationType
  title: text("title").notNull(),
  message: text("message").notNull(),
  time: text("time").notNull(),
  read: boolean("read").default(false).notNull(),
  donationId: text("donation_id").references(() => donations.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.uid, { onDelete: "cascade" }),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  donations: many(donations, { relationName: "donor" }),
  assignedDonations: many(donations, { relationName: "assignedNgo" }),
  notifications: many(notifications),
}));

export const donationsRelations = relations(donations, ({ one, many }) => ({
  donor: one(users, {
    fields: [donations.donorId],
    references: [users.uid],
    relationName: "donor",
  }),
  assignedNgo: one(users, {
    fields: [donations.assignedNgoId],
    references: [users.uid],
    relationName: "assignedNgo",
  }),
  notifications: many(notifications),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.uid],
  }),
  donation: one(donations, {
    fields: [notifications.donationId],
    references: [donations.id],
  }),
}));
