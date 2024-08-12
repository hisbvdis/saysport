import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {email: {}, password: {}},
      authorize: async (credentials) => {
        let user = null;
        if (credentials.email === "hisbvdis@gmail.com" && credentials.password === "Lucypass123") {
          user = {id: 1}
        }
        console.log( "test" )
        return user;
      }
    })
  ],
})
