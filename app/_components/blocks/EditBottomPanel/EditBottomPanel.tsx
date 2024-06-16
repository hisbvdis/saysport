"use client";
import Link from "next/link";
// -----------------------------------------------------------------------------
import { Button } from "@/app/_components/ui/Button";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";
import { DelBtn } from "@/app/_components/ui/DelBtn/";

export default function EditBottomPanel(props:Props) {
  const { id, delFunc, exitRedirectPath, delRedirectPath } = props;

  return (
    <section className={styles["editBottomPanel"]}>
      <div className="container" style={{display: "flex", gap: "15px"}}>
        <Button type="submit">Save</Button>
        <Button type="submit" data-leave-page>Save and exit</Button>
        {id ? <Link href={exitRedirectPath} style={{marginInlineStart: "auto", color: "white"}}>Exit without saving</Link> : null}
        {id ? <DelBtn id={id} delFunc={delFunc} redirectPath={delRedirectPath}>Delete</DelBtn> : null}
      </div>
    </section>
  )
}

interface Props {
  id?: number;
  delFunc: (id: number) => Promise<void>;
  exitRedirectPath: string;
  delRedirectPath: string;
}