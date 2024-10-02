"use client";
import { useRouter } from "next/navigation";
// -----------------------------------------------------------------------------
import { Button } from "@/app/_components/ui/Button/";
// -----------------------------------------------------------------------------


export default function DelBtn(props:Props) {
  const { className, style, children="X", id, delFunc, redirectPath } = props;
  const router = useRouter();

  const handleClick = async () => {
    if (!confirm("Delete?")) return;
    await delFunc(id);
    if (redirectPath) {
      router.push(redirectPath);
      router.refresh()
    } else {
      router.refresh();
    }
  }

  return (
    <Button className={className} onClick={handleClick} style={style}>
      {children}
    </Button>
  )
}

interface Props {
  id: number;
  delFunc: (id:number) => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  redirectPath?: string;
  className?: string;
}