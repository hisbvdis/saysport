ALTER TABLE "object_schedule" ADD COLUMN "usage_name_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "object_usage" ADD COLUMN "usage_name_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_schedule" ADD CONSTRAINT "object_schedule_usage_name_id_usage_name_usage_name_id_fk" FOREIGN KEY ("usage_name_id") REFERENCES "public"."usage_name"("usage_name_id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_usage" ADD CONSTRAINT "object_usage_usage_name_id_usage_name_usage_name_id_fk" FOREIGN KEY ("usage_name_id") REFERENCES "public"."usage_name"("usage_name_id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
