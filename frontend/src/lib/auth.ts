import { betterAuth } from "better-auth";
import { createAuthClient } from "better-auth/client";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
	database: pool,
	plugins: [nextCookies()],
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 60 * 60 * 24 * 7, // 7 days
		},
	},
});

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});
