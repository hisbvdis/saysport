ALTER TABLE "object_schedule" DROP CONSTRAINT "object_schedule_usage_id_usage_usage_id_fk";
--> statement-breakpoint
ALTER TABLE "object_schedule" DROP COLUMN IF EXISTS "usage_id";