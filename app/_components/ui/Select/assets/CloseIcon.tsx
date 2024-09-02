export default function CloseIcon(props:Props) {
  const { className } = props;

  return (
    <svg
      className={className}
      width="13"
      height="13"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Close Icon</title>
      <path d="M6.99996 5.58599L11.95 0.635986L13.365 2.05099L8.41496 7.00099L13.365 11.951L11.95 13.365L6.99996 8.41499L2.04996 13.365L0.636963 11.95L5.58696 6.99999L0.636963 2.04999L2.04996 0.637986L6.99996 5.58799V5.58599Z"/>
    </svg>
  );
}

interface Props {
  className?: string;
}