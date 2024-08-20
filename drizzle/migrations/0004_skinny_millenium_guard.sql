ALTER TABLE "object_usage" ALTER COLUMN "cost" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "object_usage" ALTER COLUMN "cost" DROP NOT NULL;