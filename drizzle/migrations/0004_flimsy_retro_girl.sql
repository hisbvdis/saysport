ALTER TABLE "section_on_spec" DROP CONSTRAINT "section_on_spec_spec_id_spec_spec_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "section_on_spec" ADD CONSTRAINT "section_on_spec_spec_id_spec_spec_id_fk" FOREIGN KEY ("spec_id") REFERENCES "public"."spec"("spec_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
