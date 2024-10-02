export interface ControlProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  required?: boolean;
}

export interface ControlContextType {
  labelId: string;
  inputId: string;
  required: boolean;
}

export interface ControlLabelProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  srOnly?: boolean;
  for?: string;
}

export interface ControlSectionProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}