import NextAuth, { Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authOptions = {
    adapter: DrizzleAdapter(db),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "select_account"
                }
            }
        }),
    ],
    callbacks: {
        async session({ session, user }: { session: Session; user: User }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
        async jwt({ token, user }: { token: JWT; user: User | undefined }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    secret: process.env.NEXTAUTH_SECRET
};

export const auth = () => getServerSession(authOptions);
export default NextAuth(authOptions); 