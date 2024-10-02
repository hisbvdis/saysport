import type { Metadata } from "next";
import type { SearchParamsType } from "@/app/_types/searchParams";
// -----------------------------------------------------------------------------
import { Home } from "@/app/_components/pages/Home";
// -----------------------------------------------------------------------------
import { getCityById } from "@/app/_actions/db/city";
import { getAllCategories } from "@/app/_actions/db/category";


export default async function HomePage({searchParams}:Props) {
  const city = searchParams.city ? await getCityById(Number(searchParams.city)) : undefined;
  const categories = await getAllCategories();

  return (
    <Home
      city={city}
      categories={categories}
    />
  )
}

export const metadata: Metadata = {
  title: 'Каталог спортивных объектов | SaySport.info',
}

interface Props {
  searchParams:SearchParamsType;
}