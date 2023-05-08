import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import GoogleProvider from 'next-auth/providers/google';
import { db } from './db';

function getGooglCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    
    if (!clientId || clientId.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_ID')
    }
    if (!clientSecret || clientSecret.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_SECRET')
    }

    return {clientId, clientSecret}
}

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/login'
    },
    providers: [
        GoogleProvider({
            clientId: getGooglCredentials().clientId,
            clientSecret: getGooglCredentials().clientSecret
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const dbUser = (await db.get(`user: ${user.id}`)) as User | null;

                if (!dbUser) {
                    return {
                        ...token,
                        id: user.id,
                    };
                }

                return {
                    id: dbUser.id,
                    name: dbUser.name,
                    email: dbUser.email,
                    image: dbUser.image,
                };
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
            }
            return session;
        },
        redirect() {
            return '/dashboard';
        },
    },
};
