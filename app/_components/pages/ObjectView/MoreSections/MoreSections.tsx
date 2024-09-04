"use client";
import clsx from "clsx";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { sectionTypeEnum } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { ObjectViewContext } from "../ObjectView";
import ArrowDownIcon from "@/app/_components/ui/Select/assets/ArrowDownIcon";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function MoreSections() {
  const { state } = useContext(ObjectViewContext);
  const listRef = useRef(null);
  const [ isShowList, setIsShowList ] = useState(false);

  const handleDocumentClick = () => {
    setIsShowList(false);
  }

  useEffect(() => {
    if (!isShowList) return;
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [isShowList])

  if (state.sections.filter((section) => section.section_type === sectionTypeEnum.section).length <= 1) return null;
  return (
    <div className={styles["more"]}>
      <button className={styles["more__button"]} type="button" onClick={() => setIsShowList(!isShowList)}>
        <span className={styles["more__text"]}>ещё</span>
        <ArrowDownIcon/>
      </button>
      <ul className={clsx(styles["more__list"], !isShowList && styles["more__list--hidden"])} ref={listRef}>
        {state.sections.slice(1).map((section) => (
          <li key={section.section_id} className={styles["more__item"]}>
            <Link className={styles["more__link"]} href={`/?city=${state.city_id}&section=${section.section_id}`}>{section.name_public_plural}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}