ALTER TABLE "object_on_usage_id" RENAME TO "object_on_usage";--> statement-breakpoint
ALTER TABLE "object_on_usage" DROP CONSTRAINT "object_on_usage_id_object_id_object_object_id_fk";
--> statement-breakpoint
ALTER TABLE "object_on_usage" DROP CONSTRAINT "object_on_usage_id_usage_id_usage_usage_id_fk";
--> statement-breakpoint
ALTER TABLE "object_schedule" DROP CONSTRAINT "object_schedule_object_on_usage_id_object_on_usage_id_object_on_usage_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_on_usage" ADD CONSTRAINT "object_on_usage_object_id_object_object_id_fk" FOREIGN KEY ("object_id") REFERENCES "public"."object"("object_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_on_usage" ADD CONSTRAINT "object_on_usage_usage_id_usage_usage_id_fk" FOREIGN KEY ("usage_id") REFERENCES "public"."usage"("usage_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_schedule" ADD CONSTRAINT "object_schedule_object_on_usage_id_object_on_usage_object_on_usage_id_fk" FOREIGN KEY ("object_on_usage_id") REFERENCES "public"."object_on_usage"("object_on_usage_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
