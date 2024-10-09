"use client";
import cx from "classix";
import { use, useEffect, useRef, useState } from "react"
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { ObjectViewContext } from "../ObjectView";
import { Button } from "@/app/_components/ui/Button";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Description() {
  const { state } = use(ObjectViewContext);
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
      <p className={cx(styles["description__content"], !shouldShowFullText && isTrimmedText ? styles["description__content--short"] : "")} ref={textRef}>
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
