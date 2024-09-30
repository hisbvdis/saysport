export interface FieldSetProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface FieldSetContextType {
  styles: { readonly [key: string]: string };
  legendId: string;
}

export interface FieldSetLegendProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  srOnly?: boolean;
}

export interface FieldSetSectionProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}