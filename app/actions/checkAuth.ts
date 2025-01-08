"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { CheckAuthentication } from "../types";

async function checkAuth(): Promise<CheckAuthentication> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("appwrite-session");

    if (!sessionCookie) {
        return {
            isAuthenticated: false,
        };
    }

    try {
        const { account } = await createSessionClient(sessionCookie.value);
        const user = await account.get();

        return {
            isAuthenticated: true,
            user: {
                id: user.$id,
                name: user.name,
                email: user.email,
            },
        };
    } catch (error) {
        console.error(error);
        return {
            isAuthenticated: false,
        };
    }
}

export default checkAuth;
