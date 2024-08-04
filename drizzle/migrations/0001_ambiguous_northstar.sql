ALTER TABLE "object_usage" ADD COLUMN "schedule_24_7" boolean;--> statement-breakpoint
ALTER TABLE "object_schedule" DROP COLUMN IF EXISTS "schedule_24_7";