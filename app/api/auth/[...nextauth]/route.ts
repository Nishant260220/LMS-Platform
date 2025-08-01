import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: { label: 'Username', type: 'text', placeholder: 'name' },
          password: { label: 'password', type: 'password', placeholder: 'password' },
        },
        async authorize(credentials: any) {
            
            return {
                id: "user1",
                name: credentials.username,
            };
        },
      })
  ],
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }