import { pgTable, text, integer, boolean, timestamp, serial, index, foreignKey, unique, varchar, jsonb, real, date } from 'drizzle-orm/pg-core';
import { sql } from "drizzle-orm";

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
    discord_id: text('discord_id'),
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
    username: text('username').unique(),
});

export const devices = pgTable('devices', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').references(() => users.id),
    device_name: text('device_name').notNull(),
    type: text('type').notNull(), // 'mobile', 'desktop', 'tablet'
    last_active: timestamp('last_active').defaultNow(),
    ip_address: text('ip_address'),
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

export const tiktokTokens = pgTable("tiktok_tokens", {
    id: serial().primaryKey().notNull(),
    userId: integer("user_id"),
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token"),
    expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
    scope: text(),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
    index("idx_tiktok_tokens_user_id").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
    foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "tiktok_tokens_user_id_fkey"
    }).onDelete("cascade"),
]);

export const userConfigs = pgTable("user_configs", {
    id: serial().primaryKey().notNull(),
    userId: integer("user_id"),
    douyinSecUid: varchar("douyin_sec_uid", { length: 255 }),
    rapidApiKey: text("rapid_api_key"),
    hashtags: jsonb().default([]),
    captionTemplate: text("caption_template").default('Check out this video! {hashtags}'),
    postingEnabled: boolean("posting_enabled").default(false),
    scheduleType: varchar("schedule_type", { length: 50 }).default('immediate'),
    scheduledTimes: jsonb("scheduled_times").default([]),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
    foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "user_configs_user_id_fkey"
    }).onDelete("cascade"),
    unique("user_configs_user_id_key").on(table.userId),
]);

export const tiktokProfiles = pgTable("tiktok_profiles", {
    id: serial().primaryKey().notNull(),
    userId: integer("user_id"),
    displayName: varchar("display_name", { length: 255 }),
    avatarUrl: text("avatar_url"),
    followerCount: integer("follower_count").default(0),
    followingCount: integer("following_count").default(0),
    likesCount: integer("likes_count").default(0),
    videoCount: integer("video_count").default(0),
    bioDescription: text("bio_description"),
    isVerified: boolean("is_verified").default(false),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
    foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "tiktok_profiles_user_id_fkey"
    }).onDelete("cascade"),
    unique("tiktok_profiles_user_id_key").on(table.userId),
]);

export const analyticsSnapshots = pgTable("analytics_snapshots", {
    id: serial().primaryKey().notNull(),
    userId: integer("user_id"),
    followerCount: integer("follower_count").default(0),
    likesCount: integer("likes_count").default(0),
    videoCount: integer("video_count").default(0),
    snapshotDate: timestamp("snapshot_date", { mode: 'string' }).defaultNow(),
}, (table) => [
    index("idx_analytics_user_date").using("btree", table.userId.asc().nullsLast().op("int4_ops"), table.snapshotDate.desc().nullsFirst().op("int4_ops")),
    foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "analytics_snapshots_user_id_fkey"
    }).onDelete("cascade"),
]);

export const botVideos = pgTable("bot_videos", {
    id: serial().primaryKey().notNull(),
    videoId: text("video_id").notNull(),
    title: text(),
    author: text(),
    url: text(),
    downloadUrl: text("download_url"),
    filePath: text("file_path"),
    fileSize: integer("file_size").default(0),
    duration: real().default(0),
    views: integer().default(0),
    likes: integer().default(0),
    shares: integer().default(0),
    comments: integer().default(0),
    hashtags: text().default('[]'),
    status: text().default('pending'),
    errorMessage: text("error_message"),
    tiktokPublishId: text("tiktok_publish_id"),
    tiktokVideoId: text("tiktok_video_id"),
    uploadMethod: text("upload_method"),
    privacyLevel: text("privacy_level"),
    createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
    postedAt: timestamp("posted_at", { mode: 'string' }),
    performanceScore: real("performance_score").default(0),
}, (table) => [
    index("idx_bot_videos_created").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
    index("idx_bot_videos_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
    unique("bot_videos_video_id_key").on(table.videoId),
]);

export const botStatistics = pgTable("bot_statistics", {
    id: serial().primaryKey().notNull(),
    date: date().notNull(),
    videosDownloaded: integer("videos_downloaded").default(0),
    videosPosted: integer("videos_posted").default(0),
    failedDownloads: integer("failed_downloads").default(0),
    failedUploads: integer("failed_uploads").default(0),
    totalViews: integer("total_views").default(0),
    totalLikes: integer("total_likes").default(0),
    totalShares: integer("total_shares").default(0),
    totalComments: integer("total_comments").default(0),
    avgEngagementRate: real("avg_engagement_rate").default(0),
    apiCallsDouyin: integer("api_calls_douyin").default(0),
    apiCallsTiktok: integer("api_calls_tiktok").default(0),
}, (table) => [
    index("idx_bot_stats_date").using("btree", table.date.asc().nullsLast().op("date_ops")),
    unique("bot_statistics_date_key").on(table.date),
]);

export const botScheduledPosts = pgTable("bot_scheduled_posts", {
    id: serial().primaryKey().notNull(),
    videoId: text("video_id").notNull(),
    scheduledTime: timestamp("scheduled_time", { mode: 'string' }).notNull(),
    status: text().default('pending'),
    createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
    executedAt: timestamp("executed_at", { mode: 'string' }),
    errorMessage: text("error_message"),
}, (table) => [
    index("idx_bot_scheduled_time").using("btree", table.scheduledTime.asc().nullsLast().op("timestamp_ops")),
]);

export const botConfigHistory = pgTable("bot_config_history", {
    id: serial().primaryKey().notNull(),
    configJson: text("config_json").notNull(),
    changedBy: text("changed_by"),
    timestamp: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});
