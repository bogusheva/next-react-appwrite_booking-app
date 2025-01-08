"use server";

import { createSessionClient } from "../../config/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Models, Query } from "node-appwrite";
import { DateTime } from "luxon";
import { Booking } from "../types";

type FormattedDate = DateTime<true> | DateTime<false>;

//Convert a date string to a Luxon DateTime object to UTC
function toUTCDateTime(date: string) {
    return DateTime.fromISO(date, { zone: "utc" }).toUTC();
}

// Check for overlapping date ranges
function dateRangeOverlap(
    checkInA: FormattedDate,
    checkOutA: FormattedDate,
    checkInB: FormattedDate,
    checkOutB: FormattedDate
) {
    return checkInA < checkOutB && checkOutA > checkInB;
}

async function checkRoomAvailability(roomId: string, checkIn: string, checkOut: string) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("appwrite-session");
    if (!sessionCookie) {
        redirect("/login");
    }

    try {
        const { databases } = await createSessionClient(sessionCookie.value);

        const checkInDateTime = toUTCDateTime(checkIn);
        const checkOutDateTime = toUTCDateTime(checkOut);

        //fetch all bookings for a given room
        const { documents: bookings }: { documents: Booking[] } = await databases.listDocuments<
            Models.Document & Booking
        >(process.env.NEXT_PUBLIC_APPWRITE_DATABASE!, process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS!, [
            Query.equal("room_id", roomId),
        ]);

        //Loop over bookings and check for overlaps
        for (const booking of bookings) {
            const bookingCheckInDateTime = toUTCDateTime(booking.check_in);
            const bookingCheckOutDateTime = toUTCDateTime(booking.check_out);

            if (dateRangeOverlap(checkInDateTime, checkOutDateTime, bookingCheckInDateTime, bookingCheckOutDateTime)) {
                return false;
            }
        }
        // No overlap found, continue to book
        return true;
    } catch (error) {
        console.log("Failed to check room's availability", error);
        return false;
    }
}

export default checkRoomAvailability;
