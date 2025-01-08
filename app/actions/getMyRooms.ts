"use server";

import { createSessionClient } from "../../config/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

import { Room } from "@/app/types";

async function getMyRooms() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("appwrite-session");
    if (!sessionCookie) {
        redirect("/login");
    }

    try {
        const { account, databases } = await createSessionClient(sessionCookie.value);

        //get user's id
        const user = await account.get();
        const userId = user.$id;

        //fetch rooms
        const { documents: rooms } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS!,
            [Query.equal("user_id", userId)]
        );

        return rooms as unknown as Room[];
    } catch (error) {
        console.log("Failed to get user rooms", error);
        redirect("/error");
    }
}

export default getMyRooms;
