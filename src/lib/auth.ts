import { NextAuthOptions } from 'next-auth';
import { db } from './db';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import { nanoid } from 'nanoid';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/sign-in',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      // console.log('===session executing...===');
      if (token) {
        // console.log('1. token===>', token);
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }
      // console.log('2. session===>', session);
      return session;
    },
    async jwt({ token, user }) {
      // user refers to provider account

      // console.log('===jwt executing...===');
      // console.log('initial token===>', token);
      // console.log('initial user===>', user);
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      // if no User record in DB
      if (!dbUser) {
        // assign provider account id to token
        token.id = user!.id;
        // console.log('final token===>', token);
        return token;
      }
      // User gets created after this

      // check if User doesn't have a username
      if (!dbUser.username) {
        await db.user.update({
          where: {
            id: dbUser.id,
          },
          // generate a random username
          data: {
            username: nanoid(10),
          },
        });
      }

      // console.log('final token===>', {
      //   id: dbUser.id,
      //   name: dbUser.name,
      //   email: dbUser.email,
      //   picture: dbUser.image,
      //   username: dbUser.username,
      // });

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username,
      };
    },
    redirect() {
      return '/';
    },
  },
};
