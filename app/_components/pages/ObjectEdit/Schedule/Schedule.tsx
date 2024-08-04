"use client";
import { create } from "mutative";
import { useContext } from "react";
import { format } from "date-fns";
// -----------------------------------------------------------------------------
import { Input } from "@/app/_components/ui/Input";
import { Button } from "@/app/_components/ui/Button";
import { Control } from "@/app/_components/ui/Control";
import { Checkbox } from "@/app/_components/ui/Choice";
// -----------------------------------------------------------------------------
import type { UIObject, UIObjectUsage } from "@/app/_types/types";
import { ObjectEditContext } from "../ObjectEdit";


export default function Schedule(props:{usage:UIObjectUsage}) {
  const { usage } = props;
  const { state, setState } = useContext(ObjectEditContext);


  const handleSchedule = {

  }

  return (
    <>

    </>
  )
}