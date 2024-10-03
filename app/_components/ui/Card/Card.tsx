"use client";
import cx from "classix";
// -----------------------------------------------------------------------------
import CardHeading from "./CardHeading";
import type { CardProps } from ".";
import CardSection from "./CardSection";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Card(props:CardProps) {
  const { className, children, style } = props;

  return (
    <div className={cx(styles["card"], className)} style={style}>
      {children}
    </div>
  )
}

Card.Heading = CardHeading;
Card.Section = CardSection;