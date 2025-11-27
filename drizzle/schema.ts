import { pgTable, text, integer, boolean, timestamp, serial } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').unique(),
    name: text('name'),
    image: text('image'),
    tiktok_access_token: text('tiktok_access_token'),
    tiktok_refresh_token: text('tiktok_refresh_token'),
    tiktok_expires_in: integer('tiktok_expires_in'),
    tiktok_open_id: text('tiktok_open_id').unique(),
    display_name: text('display_name'),
    avatar_url: text('avatar_url'),
    follower_count: integer('follower_count').default(0),
    following_count: integer('following_count').default(0),
    likes_count: integer('likes_count').default(0),
    video_count: integer('video_count').default(0),
    bio_description: text('bio_description'),
    is_verified: boolean('is_verified').default(false),
    discord_username: text('discord_username'),
    streak: integer('streak').default(0),
    banned: boolean('banned').default(false),
    ban_reason: text('ban_reason'),
    banned_at: timestamp('banned_at'),
    banned_by: text('banned_by'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
    // Automation & Settings
    automation_enabled: boolean('automation_enabled').default(false),
    automation_schedule: text('automation_schedule').default('["09:00", "14:00", "19:00"]'), // Stored as JSON string
    automation_config: text('automation_config').default('{"auto_reply": true, "cross_post": false, "smart_hashtags": true}'), // Stored as JSON string
    notification_settings: text('notification_settings').default('{"push": true, "email": false}'), // Stored as JSON string
});

export const activityLogs = pgTable('activity_logs', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').references(() => users.id),
    type: text('type').notNull(), // 'automation', 'security', 'system'
    title: text('title').notNull(),
    description: text('description'),
    metadata: text('metadata'), // JSON string
    created_at: timestamp('created_at').defaultNow(),
});
