// -----------------------------------------------------------------------------
import Link from "next/link";
import styles from "./styles.module.css";
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";
import clsx from "clsx";


export default function Pagination(props:Props) {
  const pageCount = Math.ceil(props.itemsCount / props.pageSize);
  const pageNumbers = Array(pageCount + 1).fill(undefined).map((_, i) => i).slice(1);
  const currentPage = props.currentPage ?? 1;
  const manageSearchParams = useManageSearchParams();
  const { className, style } = props;

  if (pageCount === 1) return null;

  return (
    <nav className={clsx(styles["pagination"], className)} style={style}>
      <ul className={styles["pagination__list"]}>
        {pageNumbers.map((pageNumber) => (
          <li key={pageNumber} className={clsx(styles["pagination__item"] )}>
            {pageNumber === currentPage
              ? <span className={clsx(styles["pagination__link"], pageNumber === currentPage && styles["pagination__link--active"])}>{pageNumber}</span>
              : <Link className={clsx(styles["pagination__link"], pageNumber === currentPage && styles["pagination__link--active"])} href={pageNumber === 1 ? manageSearchParams.delete(["page"]) : manageSearchParams.set("page", String(pageNumber))}>{pageNumber}</Link>
            }
          </li>
        ))}
      </ul>
    </nav>
  )
}

interface Props {
  itemsCount:number;
  pageSize:number;
  currentPage:number;
  className?: string;
  style?: React.CSSProperties;
}