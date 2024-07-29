import "@/app/_assets/globals.css";
import { PageHeader } from "@/app/_components/blocks/PageHeader/";
import SearchPanel from "../_components/blocks/SearchPanel/SearchPanel";


export default function RootLayout(props:Props) {
  const { children } = props;

  return (
    <html lang="en">
      <body>
        <PageHeader/>
        {children}
      </body>
    </html>
  );
}

interface Props {
  children: Readonly<React.ReactNode>
}