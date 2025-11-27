CREATE TABLE IF NOT EXISTS "activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"metadata" text,
	"created_at" timestamp DEFAULT now()
);

ALTER TABLE "users" ADD COLUMN "automation_enabled" boolean DEFAULT false;
ALTER TABLE "users" ADD COLUMN "automation_schedule" text DEFAULT '["09:00", "14:00", "19:00"]';
ALTER TABLE "users" ADD COLUMN "automation_config" text DEFAULT '{"auto_reply": true, "cross_post": false, "smart_hashtags": true}';
ALTER TABLE "users" ADD COLUMN "notification_settings" text DEFAULT '{"push": true, "email": false}';

DO $$ BEGIN
 ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
