import { relations } from "drizzle-orm";
import { type AnyPgColumn, boolean, doublePrecision, integer, pgEnum, pgTable, primaryKey, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export enum objectTypeEnum {org="org", place="place"};
export type objectTypeUnion = "org" | "place";
export const objectTypeColumnType = pgEnum("objectType", ["org", "place"]);

export enum optionsNumberEnum {many="many", one="one"};
export const optionsNumberColumnType = pgEnum("optionsNumber", ["many", "one"]);

export enum objectStatusEnum { works="works", open_soon="open_soon", might_closed="might_closed", closed_temp="closed_temp", closed_forever="closed_forever"};
export type objectStatusUnion = "works" | "open_soon" | "might_closed" | "closed_temp" | "closed_forever";
export const objectStatusColumnType = pgEnum("objectStatus", ["works", "open_soon", "might_closed", "closed_temp", "closed_forever"]);


// ===========================================================================
// OBJECT
// ===========================================================================
export const object = pgTable("object", {
  object_id: serial("object_id").primaryKey(),
  type: objectTypeColumnType("type").notNull(),
  name: varchar("name").notNull(),
  name_locative: varchar("name_locative"),
  name_where: varchar("name_where"),
  status_inherit: boolean("status_inherit"),
  status: objectStatusColumnType("status").notNull(),
  status_comment: varchar("status_comment"),
  status_confirm: varchar("status_confirm"),
  status_instead_id: integer("status_instead_id").references(():AnyPgColumn => object.object_id, {onDelete: "restrict"}),
  city_id: integer("city_id").notNull().references(() => city.city_id),
  parent_id: integer("parent_id").references(():AnyPgColumn => object.object_id, {onDelete: "restrict"}),
  address: varchar("address"),
  address_2: varchar("address_2"),
  coord_inherit: boolean("coord_inherit"),
  coord_lat: doublePrecision("coord_lat"),
  coord_lon: doublePrecision("coord_lon"),
  description: varchar("description"),
  schedule_inherit: boolean("schedule_inherit"),
  schedule_24_7: boolean("schedule_24_7"),
  schedule_date: timestamp("schedule_date"),
  schedule_source: varchar("schedule_source"),
  schedule_comment: varchar("schedule_comment"),
  created: timestamp("created").notNull(),
  modified: timestamp("modified").notNull().defaultNow(),
})

export const objectRelations = relations(object, ({ one, many }) => ({
  objectOnSection: many(object_on_section),
  objectOnOption: many(object_on_option),
  // --------------------------
  statusInstead: one(object, {fields: [object.status_instead_id], references: [object.object_id]}),
  parent: one(object, {relationName:"object_parent", fields: [object.parent_id], references: [object.object_id]}),
  children: many(object, {relationName: "object_parent"}),
  // --------------------------
  city: one(city, {fields: [object.city_id], references: [city.city_id]}),
  links: many(object_link),
  phones: many(object_phone),
  photos: many(object_photo),
  schedule: many(object_schedule),
}))

export type Object_ = typeof object.$inferSelect;


// ===========================================================================
// OBJECT_ON_SECTION
// ===========================================================================
export const object_on_section = pgTable("object_on_section", {
  object_id: integer("object_id").notNull().references(() => object.object_id, {onDelete: "cascade"}),
  section_id: integer("section_id").notNull().references(() => section.section_id, {onDelete: "restrict"})
}, (table) => ({
  pk: primaryKey({columns: [table.object_id, table.section_id]})
}))

export const objectOnSectionRelations = relations(object_on_section, ({ one }) => ({
  object: one(object, {fields: [object_on_section.object_id], references: [object.object_id]}),
  section: one(section, {fields: [object_on_section.section_id], references: [section.section_id]}),
}))

export type Object_On_Section = typeof object_on_section.$inferSelect;


// ===========================================================================
// OBJECT_ON_OPTION
// ===========================================================================
export const object_on_option = pgTable("object_on_option", {
  object_id: integer("object_id").notNull().references(() => object.object_id, {onDelete: "cascade"}),
  option_id: integer("option_id").notNull().references(() => option.option_id, {onDelete: "restrict"})
}, (table) => ({
  pk: primaryKey({columns: [table.object_id, table.option_id]})
}))

export const objectOnOptionRelations = relations(object_on_option, ({ one }) => ({
  object: one(object, {fields: [object_on_option.object_id], references: [object.object_id]}),
  option: one(option, {fields: [object_on_option.option_id], references: [option.option_id]}),
}))

export type Object_On_Option = typeof object_on_option.$inferSelect;


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
  objectOnSection: many(object_on_section),
  sectionOnSpec: many(section_on_spec),
}))

export type Section = typeof section.$inferSelect;


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

export type Spec = typeof spec.$inferSelect;


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

export type Option = typeof option.$inferSelect;


// ===========================================================================
// SECTION_ON_SPEC
// ===========================================================================
export const section_on_spec = pgTable("section_on_spec", {
  section_id: integer("section_id").notNull().references(() => section.section_id, {onDelete: "cascade"}),
  spec_id: integer("spec_id").notNull().references(() => spec.spec_id, { onDelete: "restrict" }),
}, (table) => ({
  pk: primaryKey({columns: [table.section_id, table.spec_id]})
}))

export const sectionOnSpecRelations = relations(section_on_spec, ({ one }) => ({
  section: one(section, {fields: [section_on_spec.section_id], references: [section.section_id]}),
  spec: one(spec, {fields: [section_on_spec.spec_id], references: [spec.spec_id]}),
}))

export type Section_On_Spec = typeof section_on_spec.$inferSelect;


// ===========================================================================
// CITY
// ===========================================================================
export const city = pgTable("city", {
  city_id: serial("city_id").primaryKey(),
  name: varchar("name").notNull(),
  name_preposition: varchar("name_preposition").notNull(),
  admin1: varchar("admin1"),
  admin2: varchar("admin2"),
  country: varchar("country").notNull(),
  coord_lat: doublePrecision("coord_lat").notNull(),
  coord_lon: doublePrecision("coord_lon").notNull(),
})

export const cityRelations = relations(city, ({ many }) => ({
  objects: many(object),
}))

export type City = typeof city.$inferSelect;


// ===========================================================================
// OBJECT_PHONE
// ===========================================================================
export const object_phone = pgTable("object_phone", {
  object_id: integer("object_id").notNull().references(() => object.object_id, {onDelete: "cascade"}),
  order: integer("order").notNull(),
  value: varchar("value").notNull(),
  comment: varchar("comment"),
}, (table) => ({
  pk: primaryKey({columns: [table.object_id, table.order]})
}))

export const objectPhoneRelations = relations(object_phone, ({ one }) => ({
  object: one(object, {fields: [object_phone.object_id], references: [object.object_id]})
}))

export type Object_Phone = typeof object_phone.$inferSelect;


// ===========================================================================
// OBJECT_LINK
// ===========================================================================
export const object_link = pgTable("object_link", {
  object_id: integer("object_id").notNull().references(() => object.object_id, {onDelete: "cascade"}),
  order: integer("order").notNull(),
  value: varchar("value").notNull(),
  comment: varchar("comment"),
}, (table) => ({
  pk: primaryKey({columns: [table.object_id, table.order]})
}))

export const objectLinkRelations = relations(object_link, ({ one }) => ({
  object: one(object, {fields: [object_link.object_id], references: [object.object_id]})
}))

export type Object_Link = typeof object_link.$inferSelect;


// ===========================================================================
// PHOTO
// ===========================================================================
export const object_photo = pgTable("object_photo", {
  object_id: integer("object_id").notNull().references(() => object.object_id, {onDelete: "cascade"}),
  order: integer("order").notNull(),
  name: varchar("name").notNull(),
  uploaded: timestamp("uploaded").notNull().defaultNow(),
}, (table) => ({
  pk: primaryKey({columns: [table.object_id, table.order]})
}))

export const objectPhotoRelations = relations(object_photo, ({ one }) => ({
  object: one(object, {fields: [object_photo.object_id], references: [object.object_id]}),
}))

export type Object_Photo = typeof object_photo.$inferSelect;


// ===========================================================================
// SCHEDULE
// ===========================================================================
export const object_schedule = pgTable("object_schedule", {
  object_id: integer("object_id").notNull().references(() => object.object_id, {onDelete: "cascade"}),
  day_num: integer("day_num").notNull(),
  time: varchar("time").notNull(),
  from: integer("from").notNull(),
  to: integer("to").notNull(),
}, (table) => ({
  pk: primaryKey({columns: [table.object_id, table.day_num]})
}))

export const objectScheduleRelations = relations(object_schedule, ({ one }) => ({
  object: one(object, {fields: [object_schedule.object_id], references: [object.object_id]}),
}))

export type Object_Schedule = typeof object_schedule.$inferSelect;