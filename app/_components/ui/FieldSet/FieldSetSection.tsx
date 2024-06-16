"use client";


export default function FieldSetSection(props:Props) {
  const { children, className, style } = props;

  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}

interface Props {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}