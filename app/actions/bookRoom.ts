"use server";

import { createSessionClient } from "../../config/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID } from "node-appwrite";
import checkAuth from "./checkAuth";
import { State } from "../types";
import { revalidatePath } from "next/cache";

import checkRoomAvailability from "./checkRoomAvailability";

async function bookRoom(state: State, formData: FormData): Promise<State> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("appwrite-session");
    if (!sessionCookie) {
        redirect("/login");
    }
    //get user's ID
    const { user } = await checkAuth();

    if (!user) {
        return {
            error: "You must be logged in to book a room.",
        };
    }

    try {
        const { databases } = await createSessionClient(sessionCookie.value);

        //Extract date and time from the formData
        const checkInDate = formData.get("check_in_date");
        const checkInTime = formData.get("check_in_time");
        const checkOutDate = formData.get("check_out_date");
        const checkOutTime = formData.get("check_out_time");
        const roomId = formData.get("room_id") as string;

        //Combine date and time to ISO 8601 format
        const checkInDateTime = `${checkInDate}T${checkInTime}`;
        const checkOutDateTime = `${checkOutDate}T${checkOutTime}`;

        //Check if room is available
        const roomIsAvailable = await checkRoomAvailability(roomId, checkInDateTime, checkOutDateTime);

        if (!roomIsAvailable) {
            return {
                error: "This room is already booked for the selected time",
            };
        }

        const bookingData = {
            check_in: checkInDateTime,
            check_out: checkOutDateTime,
            user_id: user.id,
            room_id: roomId,
        };

        //Create booking
        await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS!,
            ID.unique(),
            bookingData
        );

        //Revalidate cache
        revalidatePath("/bookings", "layout");

        return {
            success: true,
        };
    } catch (error) {
        console.log("Failed to book the room", error);
        return {
            error: "Something went wrong booking the room",
        };
    }
}

export default bookRoom;
