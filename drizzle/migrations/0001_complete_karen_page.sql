ALTER TABLE "object_photo" DROP CONSTRAINT "object_photo_object_id_order_pk";--> statement-breakpoint
ALTER TABLE "object_photo" ADD COLUMN "photo_id" serial PRIMARY KEY NOT NULL;