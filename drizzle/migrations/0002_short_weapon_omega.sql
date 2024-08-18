ALTER TABLE "object_schedule" DROP CONSTRAINT "object_schedule_usage_name_id_usage_name_usage_name_id_fk";
--> statement-breakpoint
ALTER TABLE "object_usage" DROP CONSTRAINT "object_usage_usage_name_id_usage_name_usage_name_id_fk";
--> statement-breakpoint
ALTER TABLE "object_schedule" DROP COLUMN IF EXISTS "usage_name_id";--> statement-breakpoint
ALTER TABLE "object_usage" DROP COLUMN IF EXISTS "usage_name_id";