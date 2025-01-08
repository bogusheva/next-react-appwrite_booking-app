"use server";

import { createSessionClient } from "../../config/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";
import checkAuth from "./checkAuth";

import { Booking } from "@/app/types";

async function getMyBookings() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("appwrite-session");
    if (!sessionCookie) {
        redirect("/login");
    }

    try {
        const { databases } = await createSessionClient(sessionCookie.value);

        //get user's id
        const { user } = await checkAuth();
        if (!user) {
            return {
                error: "You must be logged in to view bookings.",
            };
        }

        //fetch user's bookings
        const { documents: bookings } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS!,
            [Query.equal("user_id", user.id)]
        );

        return { bookings: bookings as unknown as Booking[] };
    } catch (error) {
        console.log("Failed to get user bookings", error);
        return {
            error: "Failed to get bookings",
        };
    }
}

export default getMyBookings;
