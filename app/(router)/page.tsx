import { redirect } from "next/navigation"

export default function Home() {
  redirect("/catalog")
  return (
    <main className="container">
      <h1>Hello world</h1>
    </main>
  )
}