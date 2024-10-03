import { cookies } from "next/headers";
// -----------------------------------------------------------------------------
import { PageHeader } from "@/app/_components/blocks/PageHeader/";
// -----------------------------------------------------------------------------
import "@/app/_assets/globals.css";


export default function RootLayout(props:Props) {
  const { children } = props;
  const isLogin = Boolean(cookies().get("isLogin")?.value);

  return (
    <html lang="en">
      <body>
        <PageHeader isLogin={isLogin}/>
        {children}
      </body>
    </html>
  );
}

interface Props {
  children: Readonly<React.ReactNode>
}