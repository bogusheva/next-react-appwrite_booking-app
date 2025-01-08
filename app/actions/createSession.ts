"use server";

import { createAdminClient } from "@/config/appwrite";
import { cookies as getCookies } from "next/headers";
import { Cookies, State } from "../types";

async function createSession(state: State, formData: FormData): Promise<State> {
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    if (!email || !password) {
        return {
            error: "Email and password are required",
        };
    }

    //get account instance
    const { account } = await createAdminClient();

    try {
        //generate session
        const session = await account.createEmailPasswordSession(email, password);

        //create cookie
        const cookieStore = getCookies() as Cookies;
        if (cookieStore.set) {
            cookieStore.set("appwrite-session", session.secret, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                expires: new Date(session.expire),
                path: "/",
            });
        }
        return {
            success: true,
        };
    } catch (error) {
        console.log(`Authentication error: ${error}`);
        return { error: "Invalid credentials" };
    }
}

export default createSession;
