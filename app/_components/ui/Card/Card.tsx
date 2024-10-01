"use client";
import clsx from "clsx";
import { createContext } from "react";
// -----------------------------------------------------------------------------
import type { CardContextType, CardProps } from ".";
import CardHeading from "./CardHeading";
import CardSection from "./CardSection";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Card(props:CardProps) {
  const { className, children, style } = props;

  return (
    <CardContext.Provider value={{ styles }}>
      <section className={clsx(styles.card, className)} style={style}>
        {children}
      </section>
    </CardContext.Provider>
  )
}

export const CardContext = createContext<CardContextType>({} as CardContextType);

Card.Heading = CardHeading;
Card.Section = CardSection;