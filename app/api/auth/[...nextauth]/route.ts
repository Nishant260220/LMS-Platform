import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

       
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null; 
        }

        
        if (user.password !== credentials.password) {
          return null; 
        }

        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },

     async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return `${baseUrl}/`;
    },

  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


// import NextAuth from "next-auth"
// import CredentialsProvider from 'next-auth/providers/credentials';

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//         name: 'Credentials',
//         credentials: {
//           username: { label: 'Username', type: 'text', placeholder: 'name' },
//           password: { label: 'password', type: 'password', placeholder: 'password' },
//         },
//         async authorize(credentials: any) {
            
//             return {
//                 id: "user1",
//                 name: credentials.username,
//             };
//         },
//       })
//   ],
//   secret: process.env.NEXTAUTH_SECRET
// }

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST }