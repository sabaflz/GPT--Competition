import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const rooms = sqliteTable('rooms', {
 code: text('code').primaryKey(), hostHash: text('host_hash').notNull(), guestHash: text('guest_hash'),
 hostName: text('host_name').notNull(), guestName: text('guest_name'),
 state: text('state').notNull(), version: integer('version').notNull().default(0),
 createdAt: integer('created_at').notNull(), hostSeen:integer('host_seen').notNull(), guestSeen:integer('guest_seen'),
});
