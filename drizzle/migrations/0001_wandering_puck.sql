ALTER TABLE "object_schedule" DROP CONSTRAINT "object_schedule_usage_id_object_usage_usage_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_schedule" ADD CONSTRAINT "object_schedule_usage_id_object_usage_usage_id_fk" FOREIGN KEY ("usage_id") REFERENCES "public"."object_usage"("usage_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
