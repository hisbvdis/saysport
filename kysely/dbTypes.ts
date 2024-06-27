import { Generated } from "kysely";

export enum objectTypeEnum {org="org", place="place"};
export type objectTypeType = "org" | "place";

export enum optionsNumberEnum {one="one", many="many"};
export type optionsNumberType = "one" | "many";

export interface Database {
  option: OptionTable;
  spec: SpecTable;
}

export interface OptionTable {
  id: Generated<number>;
  name: string;
  order: number;
  spec_id: number;
}

export interface SpecTable {
  id: Generated<number>;
  name_service: string;
  name_public: string;
  object_type: objectTypeType;
  options_number: optionsNumberType;
}