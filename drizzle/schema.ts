import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, primaryKey, serial, varchar } from "drizzle-orm/pg-core";

export enum objectTypeEnum {org="org", place="place"};
export const objectTypeColumnType = pgEnum("objectType", ["org", "place"]);

export enum optionsNumberEnum {many="many", one="one"};
export const optionsNumberColumnType = pgEnum("optionsNumber", ["many", "one"]);

export enum objectStatusEnum { works="works", open_soon="open_soon", might_closed="might_closed", closed_temp="closed_temp", closed_forever="closed_forever"};
export const objectStatusColumnType = pgEnum("objectStatus", ["works", "open_soon", "might_closed", "closed_temp", "closed_forever"]);


// ===========================================================================
// SECTION
// ===========================================================================
export const section = pgTable("section", {
  section_id: serial("section_id").primaryKey(),
  name_plural: varchar("name_plural").notNull(),
  name_singular: varchar("name_singular").notNull(),
  object_type: objectTypeColumnType("object_type").notNull(),
})

export const sectionRelations = relations(section, ({ many }) => ({
  sectionOnSpec: many(section_on_spec),
}))

export type SectionSelect = typeof section.$inferSelect;


// ===========================================================================
// SPEC
// ===========================================================================
export const spec = pgTable("spec", {
  spec_id: serial("spec_id").primaryKey(),
  name_service: varchar("name_service").notNull(),
  name_public: varchar("name_public").notNull(),
  object_type: objectTypeColumnType("object_type").notNull(),
  options_number: optionsNumberColumnType("options_number").notNull(),
})

export const specRelations = relations(spec, ({ many }) => ({
  options: many(option),
  sectionOnSpec: many(section_on_spec),
}))

export type SpecSelect = typeof spec.$inferSelect;


// ===========================================================================
// OPTION
// ===========================================================================
export const option = pgTable("option", {
  option_id: serial("option_id").primaryKey(),
  name: varchar("name").notNull(),
  order: integer("order").notNull(),
  spec_id: integer("spec_id").notNull().references(() => spec.spec_id, { onDelete: "cascade" }),
})

export const optionRelations = relations(option, ({ one }) => ({
  spec: one(spec, {fields: [option.spec_id], references: [spec.spec_id]}),
}))

export type OptionSelect = typeof option.$inferSelect;


// ===========================================================================
// SECTION_ON_SPEC
// ===========================================================================
export const section_on_spec = pgTable("section_on_spec", {
  section_id: integer("section_id").notNull().references(() => section.section_id, {onDelete: "cascade"}),
  spec_id: integer("spec_id").notNull().references(() => spec.spec_id, { onDelete: "cascade" }),
}, (table) => ({
  pk: primaryKey({columns: [table.section_id, table.spec_id]})
}))

export const sectionOnSpecRelations = relations(section_on_spec, ({ one }) => ({
  section: one(section, {fields: [section_on_spec.section_id], references: [section.section_id]}),
  spec: one(spec, {fields: [section_on_spec.spec_id], references: [spec.spec_id]}),
}))

export type SectionOnSpecSelect = typeof section_on_spec.$inferSelect;