"use client";
import clsx from "clsx";
import { useContext, useEffect, useRef, useState } from "react"
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { ObjectViewContext } from "../ObjectView";
import { Button } from "@/app/_components/ui/Button";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Description() {
  const { state } = useContext(ObjectViewContext);
  if (!state.description) return null;
  const textRef = useRef<HTMLParagraphElement>(null);
  const [ shouldShowFullText, setShouldShowFullText ] = useState(false);
  const [ isTrimmedText, setIsTrimmedText ] = useState(true);

  useEffect(() => {
    if (!textRef.current) return;
    if (textRef.current?.scrollHeight <= textRef.current?.clientHeight) {
      setIsTrimmedText(false);
    }
  }, [])

  return (
    <Card className={styles["description"]}>
      <p className={clsx(styles["description__content"], !shouldShowFullText && styles["description__content--short"])} ref={textRef}>
        {state.description}
      </p>
      {isTrimmedText
        ? <Button className={styles["description__button"]} onClick={() => setShouldShowFullText(!shouldShowFullText)}>
            {shouldShowFullText ? "Меньше" : "Больше"}
          </Button>
        : null
      }
    </Card>
  )
}
