"use server";
import { signIn } from "@/auth";

export default async function AuthPage() {
  return (
    <form action={async (formData) => {
      "use server";
      await signIn("credentials", formData);
    }}>
      <input type="email" name="email" placeholder="Email" required/>
      <input type="password" name="password" placeholder="Password" required/>
      <button type="submit">Login</button>
    </form>
  )
}