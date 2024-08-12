ALTER TABLE "object_on_option" DROP CONSTRAINT "object_on_option_option_id_option_option_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_on_option" ADD CONSTRAINT "object_on_option_option_id_option_option_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."option"("option_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
