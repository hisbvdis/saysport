import { relations } from "drizzle-orm";
import { type AnyPgColumn, boolean, doublePrecision, integer, pgEnum, pgTable, primaryKey, serial, timestamp, unique, varchar } from "drizzle-orm/pg-core";

export enum objectTypeEnum {org="org", place="place", class="class"};
export type objectTypeUnion = "org" | "place" | "class";
export const objectTypeColumnType = pgEnum("objectType", ["org", "place", "class"]);

export enum optionsNumberEnum {many="many", one="one"};
export const optionsNumberColumnType = pgEnum("optionsNumber", ["many", "one"]);

export enum objectStatusEnum { works="works", open_soon="open_soon", might_closed="might_closed", closed_temp="closed_temp", closed_forever="closed_forever"};
export type objectStatusUnion = "works" | "open_soon" | "might_closed" | "closed_temp" | "closed_forever";
export const objectStatusColumnType = pgEnum("objectStatus", ["works", "open_soon", "might_closed", "closed_temp", "closed_forever"]);

export enum sectionTypeEnum {section="section", common="common"};
export type sectionTypeUnion = "section" | "common";
export const sectionTypeColumnType = pgEnum("sectionType", ["section", "common"]);

export enum costTypeEnum {paid="paid", free="free"};
export type costTypeUnion = "paid" | "free";
export const costTypeColumnType = pgEnum("costType", ["paid", "free"]);

export enum UIContactTypeEnum {phones = "phones", links = "links"};



// ===========================================================================
// OBJECT
// ===========================================================================
export const object = pgTable("object", {
  object_id: serial("object_id").primaryKey(),
  type: objectTypeColumnType("type").notNull(),
  name_type: varchar("name_type").notNull(),
  name_title: varchar("name_title"),
  name_where: varchar("name_where"),
  name_locative: varchar("name_locative"),
  status_inherit: boolean("status_inherit"),
  status: objectStatusColumnType("status").notNull(),
  status_comment: varchar("status_comment"),
  status_source: varchar("status_source"),
  status_instead_id: integer("status_instead_id").references(():AnyPgColumn => object.object_id, {onDelete: "restrict"}),
  city_id: integer("city_id").notNull().references(() => city.city_id),
  parent_id: integer("parent_id").references(():AnyPgColumn => object.object_id, {onDelete: "restrict"}),
  address: varchar("address"),
  address_2: varchar("address_2"),
  coord_inherit: boolean("coord_inherit"),
  coord_lat: doublePrecision("coord_lat").notNull(),
  coord_lon: doublePrecision("coord_lon").notNull(),
  description: varchar("description"),
  created: timestamp("created").notNull(),
  modified: timestamp("modified").notNull().defaultNow(),
})

export const objectRelations = relations(object, ({ one, many }) => ({
  objectOnSections: many(object_on_section),
  objectOnOptions: many(object_on_option),
  objectOnUsages: many(object_on_usage),
  objectSchedules: many(object_schedule),
  // --------------------------
  statusInstead: one(object, {fields: [object.status_instead_id], references: [object.object_id]}),
  parent: one(object, {relationName:"object_parent", fields: [object.parent_id], references: [object.object_id]}),
  children: many(object, {relationName: "object_parent"}),
  // --------------------------
  city: one(city, {fields: [object.city_id], references: [city.city_id]}),
  links: many(object_link),
  phones: many(object_phone),
  photos: many(object_photo),
}))

export type Object_ = typeof object.$inferSelect;



// ===========================================================================
// SECTION
// ===========================================================================
export const section = pgTable("section", {
  section_id: serial("section_id").primaryKey(),
  section_type: sectionTypeColumnType("section_type").notNull(),
  name_service: varchar("name_service").notNull(),
  name_public_plural: varchar("name_public_plural").notNull(),
  name_public_singular: varchar("name_public_singular").notNull(),
  object_type: objectTypeColumnType("object_type").notNull(),
})

export const sectionRelations = relations(section, ({ many }) => ({
  objectOnSections: many(object_on_section),
  sectionOnSpecs: many(section_on_spec),
  categoryOnSections: many(category_on_section),
  sectionOnUsages: many(section_on_usage),
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
  order: integer("order").notNull(),
  is_and_in_search: boolean("is_and_in_search"),
})

export const specRelations = relations(spec, ({ many }) => ({
  options: many(option),
  sectionOnSpecs: many(section_on_spec),
}))

export type Spec = typeof spec.$inferSelect;



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

export type SectionOnSpec = typeof section_on_spec.$inferSelect;



// ===========================================================================
// SECTION_ON_USAGE
// ===========================================================================
export const section_on_usage = pgTable("section_on_usage", {
  section_on_usage_id: serial("section_on_usage_id").primaryKey(),
  section_id: integer("section_id").notNull().references(() => section.section_id, {onDelete: "cascade"}),
  usage_id: integer("usage_id").notNull().references(() => usage.usage_id, {onDelete: "cascade"}),
})

export const sectionOnUsageRelations = relations(section_on_usage, ({ one }) => ({
  section: one(section, {fields: [section_on_usage.section_id], references: [section.section_id]}),
  usage: one(usage, {fields: [section_on_usage.usage_id], references: [usage.usage_id]}),
}))

export type SectionOnUsage = typeof section_on_usage.$inferSelect;



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
// CITY
// ===========================================================================
export const city = pgTable("city", {
  city_id: serial("city_id").primaryKey(),
  name: varchar("name").notNull(),
  name_preposition: varchar("name_preposition"),
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
  object: one(object, {fields: [object_phone.object_id], references: [object.object_id]}),
}))

export type ObjectPhone = typeof object_phone.$inferSelect;



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
  object: one(object, {fields: [object_link.object_id], references: [object.object_id]}),
}))

export type ObjectLink = typeof object_link.$inferSelect;



// ===========================================================================
// OBJECT_PHOTO
// ===========================================================================
export const object_photo = pgTable("object_photo", {
  photo_id: serial("photo_id").primaryKey(),
  object_id: integer("object_id").notNull().references(() => object.object_id),
  order: integer("order").notNull(),
  name: varchar("name").notNull(),
  uploaded: timestamp("uploaded").notNull().defaultNow(),
})

export const objectPhotoRelations = relations(object_photo, ({ one }) => ({
  object: one(object, {fields: [object_photo.object_id], references: [object.object_id]}),
}))

export type ObjectPhoto = typeof object_photo.$inferSelect;



// ===========================================================================
// OBJECT_ON_SECTION
// ===========================================================================
export const object_on_section = pgTable("object_on_section", {
  object_id: integer("object_id").notNull().references(() => object.object_id, {onDelete: "cascade"}),
  section_id: integer("section_id").notNull().references(() => section.section_id, {onDelete: "restrict"}),
}, (table) => ({
  pk: primaryKey({columns: [table.object_id, table.section_id]})
}))

export const objectOnSectionRelations = relations(object_on_section, ({ one }) => ({
  object: one(object, {fields: [object_on_section.object_id], references: [object.object_id]}),
  section: one(section, {fields: [object_on_section.section_id], references: [section.section_id]}),
}))

export type ObjectOnSection = typeof object_on_section.$inferSelect;



// ===========================================================================
// OBJECT_ON_OPTION
// ===========================================================================
export const object_on_option = pgTable("object_on_option", {
  object_id: integer("object_id").notNull().references(() => object.object_id, {onDelete: "cascade"}),
  option_id: integer("option_id").notNull().references(() => option.option_id, {onDelete: "cascade"})
}, (table) => ({
  pk: primaryKey({columns: [table.object_id, table.option_id]})
}))

export const objectOnOptionRelations = relations(object_on_option, ({ one }) => ({
  object: one(object, {fields: [object_on_option.object_id], references: [object.object_id]}),
  option: one(option, {fields: [object_on_option.option_id], references: [option.option_id]}),
}))

export type ObjectOnOption = typeof object_on_option.$inferSelect;



// ===========================================================================
// CATEGORY
// ===========================================================================
export const category = pgTable("category", {
  category_id: serial("category_id").primaryKey(),
  name: varchar("name").notNull(),
  order: integer("order").notNull(),
})

export const categoryRelations = relations(category, ({ many }) => ({
  categoryOnSections: many(category_on_section),
}))

export type Category = typeof category.$inferSelect;



// ===========================================================================
// CATEGORY_ON_SECTION
// ===========================================================================
export const category_on_section = pgTable("category_on_section", {
  category_id: integer("category_id").notNull().references(() => category.category_id, {onDelete: "cascade"}),
  section_id: integer("section_id").notNull().references(() => section.section_id, {onDelete: "cascade"}),
}, (table) => ({
  pk: primaryKey({columns: [table.category_id, table.section_id]})
}))

export const categoryOnSectionRelations = relations(category_on_section, ({ one }) => ({
  category: one(category, {fields: [category_on_section.category_id], references: [category.category_id]}),
  section: one(section, {fields: [category_on_section.section_id], references: [section.section_id]}),
}))

export type CategoryOnSection = typeof category_on_section.$inferSelect;



// ===========================================================================
// USAGE
// ===========================================================================
export const usage = pgTable("usage", {
  usage_id: serial("usage_id").primaryKey(),
  name_service: varchar("name_service").notNull(),
  name_public: varchar("name_public").notNull(),
  object_type: objectTypeColumnType("object_type").notNull(),
})

export type Usage = typeof usage.$inferSelect;



// ===========================================================================
// OBJECT_ON_USAGE
// ===========================================================================
export const object_on_usage = pgTable("object_on_usage", {
  object_on_usage_id: serial("object_on_usage_id").primaryKey(),
  object_id: integer("object_id").notNull().references(() => object.object_id, {onDelete: "cascade"}),
  usage_id: integer("usage_id").notNull().references(() => usage.usage_id, {onDelete: "cascade"}),
  order: integer("order").notNull(),
  cost: costTypeColumnType("cost"),
  sexMale: boolean("sexMale"),
  sexFemale: boolean("sexFemale"),
  ageFrom: integer("ageFrom"),
  ageTo: integer("ageTo"),
  description: varchar("description"),
  schedule_inherit: boolean("schedule_inherit"),
})

export const objectOnUsageRelations = relations(object_on_usage, ({ one, many }) => ({
  object: one(object, {fields: [object_on_usage.object_id], references: [object.object_id]}),
  usage: one(usage, {fields: [object_on_usage.usage_id], references: [usage.usage_id]}),
  schedules: many(object_schedule),
}))

export type ObjectOnUsage = typeof object_on_usage.$inferSelect;



// ===========================================================================
// OBJECT_ON_SCHEDULE
// ===========================================================================
export const object_schedule = pgTable("object_schedule", {
  schedule_id: serial("schedule_id").primaryKey(),
  object_id: integer("object_id").notNull().references(() => object.object_id, {onDelete: "cascade"}),
  object_on_usage_id: integer("object_on_usage_id").notNull().references(() => object_on_usage.object_on_usage_id, {onDelete: "cascade"}),
  day_num: integer("day_num").notNull(),
  time: varchar("time").notNull(),
  from: integer("from").notNull(),
  to: integer("to").notNull(),
})

export const objectScheduleRelations = relations(object_schedule, ({ one }) => ({
  object: one(object, {fields: [object_schedule.object_id], references: [object.object_id]}),
  objectOnUsage: one(object_on_usage, {fields: [object_schedule.object_on_usage_id], references: [object_on_usage.object_on_usage_id]}),
}))

export type ObjectSchedule = typeof object_schedule.$inferSelect;