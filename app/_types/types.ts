import { OptionSelect, SectionOnSpecSelect, SectionSelect, SpecSelect } from "@/drizzle/schema";
import { city, object as object_, object_link, object_on_option, object_on_section, object_phone, object_photo, object_schedule, option as option_, section, section_on_spec, spec as spec_ } from "@prisma/client";

// =============================================================================
// DB TYPES
// =============================================================================
export interface DBSpec extends SpecSelect {
  options: OptionSelect[]
}

export interface DBSection extends SectionSelect {
  sectionOnSpec: (SectionOnSpecSelect & { spec: DBSpec })[];
}

export interface DBObject extends object_ {
  statusInstead?: object_ | null;
  city?: city | null;
  parent?: object_ | null;
  phones?: object_phone[];
  links?: object_link[];
  sections?: (object_on_section & {section: section & {specs: (section_on_spec & {spec: spec_ & {options: option_[]}})[]}})[];
  options?: (object_on_option & {option: option_})[];
  schedule?: object_schedule[];
  photos?: object_photo[];
  children?: DBObject[],
}

// =============================================================================
// UI TYPES
// =============================================================================
export interface UIOption extends OptionSelect {
  uiID: string;
}

export interface UISpec extends SpecSelect {
  options?: UIOption[];
  uiID: string;
};

export interface UISection extends SectionSelect {
  specs: UISpec[];
  uiID: string;
}

export interface UIObject extends Partial<object_> {
  city?: city | null;
  parent?: object_ | UIObject | null;
  phones?: (object_phone & {uiID: string})[];
  links?: (object_link & {uiID: string})[];
  sections?: UISection[];
  options?: UIOption[];
  schedule: (object_schedule & {uiID: string, isWork: boolean})[];
  photos?: (object_photo & {uiID: string, blob?: string, file?: File})[];
  children?: DBObject[];
  [key: string]: any;
}

export enum UIContactTypeEnum {
  PHONES = "phones",
  LINKS = "links"
}