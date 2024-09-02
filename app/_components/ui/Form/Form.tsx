"use client";

import { createContext, useId } from "react";

export default function Form(props:Props) {
  const { onSubmit=(e=>e), method, noValidate } = props;
  const formHeadingId = useId();
  const { className, id, style, children } = props;

  return (
    <FormContext.Provider value={{formHeadingId}}>
      <form
        id={id}
        className={className}
        style={style}
        method={method}
        noValidate={noValidate}
        onSubmit={onSubmit}
      >
        {children}
      </form>
    </FormContext.Provider>
  )
}

export const FormContext = createContext<FormContextType>({} as FormContextType)

interface Props {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  method?: "GET" | "POST";
  noValidate?: boolean;
  onSubmit?: React.FormEventHandler
}

interface FormContextType {
  formHeadingId: string;
}