CREATE TABLE "activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"metadata" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "devices" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"device_name" text NOT NULL,
	"type" text NOT NULL,
	"last_active" timestamp DEFAULT now(),
	"ip_address" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text,
	"name" text,
	"image" text,
	"tiktok_access_token" text,
	"tiktok_refresh_token" text,
	"tiktok_expires_in" integer,
	"tiktok_open_id" text,
	"display_name" text,
	"avatar_url" text,
	"follower_count" integer DEFAULT 0,
	"following_count" integer DEFAULT 0,
	"likes_count" integer DEFAULT 0,
	"video_count" integer DEFAULT 0,
	"bio_description" text,
	"is_verified" boolean DEFAULT false,
	"discord_username" text,
	"streak" integer DEFAULT 0,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"banned_at" timestamp,
	"banned_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"automation_enabled" boolean DEFAULT false,
	"automation_schedule" text DEFAULT '["09:00", "14:00", "19:00"]',
	"automation_config" text DEFAULT '{"auto_reply": true, "cross_post": false, "smart_hashtags": true}',
	"notification_settings" text DEFAULT '{"push": true, "email": false}',
	"username" text,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_tiktok_open_id_unique" UNIQUE("tiktok_open_id"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devices" ADD CONSTRAINT "devices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;