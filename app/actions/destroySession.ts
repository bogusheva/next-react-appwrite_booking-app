"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";

async function destroySession() {
    //retrieve the session cookies
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("appwrite-session");

    if (!sessionCookie) {
        return {
            error: "No session cookie found",
        };
    }
    try {
        const { account } = await createSessionClient(sessionCookie.value);

        //Delete current session
        await account.deleteSession("current");

        //Delete cookie
        cookieStore.delete('appwrite-session');

        return {
          success: true,
        }
    } catch (error) {
      console.log(error);
        return { error: "Error deleting session" };
    }
}

export default destroySession;
