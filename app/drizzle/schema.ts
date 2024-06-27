import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";

// ENUMS
export const objectTypeColumnEnum = pgEnum("object_type", ["org", "place"]);
export enum objectTypeEnum { org="org", place="place" };
export type objectTypeType = "org" | "place";

export const optionsNumberColumnEnum = pgEnum("options_number", ["one", "many"]);
export enum optionsNumberEnum { one="one", many="many" };

// SPEC
export const spec = pgTable("spec", {
  id: serial("id").primaryKey(),
  name_service: text("name_service").notNull(),
  name_public: text("name_public").notNull(),
  object_type: objectTypeColumnEnum("object_type").notNull(),
  options_number: optionsNumberColumnEnum("options_number"),
});

export type specSelectType = typeof spec.$inferSelect;

export const specRelations = relations(spec, ({ many }) => ({
  options: many(option),
}))

// OPTION
export const option = pgTable("option", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  order: integer("order").notNull(),
  spec_id: integer("spec_id").references(() => spec.id, {
    onDelete: "cascade",
  }),
});

export type optionSelectType = typeof option.$inferSelect;

export const optionRelations = relations(option, ({ one }) => ({
  spec: one(spec, { fields: [option.spec_id], references: [spec.id] })
}))