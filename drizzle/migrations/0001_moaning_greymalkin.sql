ALTER TABLE "object_photo" DROP CONSTRAINT "object_photo_object_id_object_object_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_photo" ADD CONSTRAINT "object_photo_object_id_object_object_id_fk" FOREIGN KEY ("object_id") REFERENCES "public"."object"("object_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
