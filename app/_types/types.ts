import { option, spec } from "@prisma/client";

// =============================================================================
// Database
// =============================================================================
export interface DBSpec extends spec {
  options: option[]
}


// =============================================================================
// UI
// =============================================================================
export interface UIOption extends Omit<option, "id"|"spec_id"> {
  id?: number;
  spec_id?:number;
  uiID: string;
}

export interface UISpec extends Omit<spec, "id"> {
  id?: number;
  options?: UIOption[];
  uiID: string;
};