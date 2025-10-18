"use server";
import { redirect } from "next/navigation";
import { authClient } from "./auth";

export const signIn = async () => {
	const data = await authClient.signIn.social({
		provider: "google",
		callbackURL: "/",
	});

	redirect(data.data?.url as string);
};
