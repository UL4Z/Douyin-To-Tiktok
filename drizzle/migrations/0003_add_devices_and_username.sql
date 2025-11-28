CREATE TABLE IF NOT EXISTS "devices" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"device_name" text NOT NULL,
	"type" text NOT NULL,
	"last_active" timestamp DEFAULT now(),
	"ip_address" text
);

DO $$ BEGIN
 ALTER TABLE "devices" ADD CONSTRAINT "devices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "users" ADD COLUMN "username" text;
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");
