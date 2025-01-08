"use server";

import { createAdminClient } from "@/config/appwrite";
import checkAuth from "./checkAuth";
import { ID } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { ErrorResponse, NewRoom, State } from "../types";

async function createRoom(state: State, formData: FormData): Promise<State> {
    //Get databases instance
    const { databases, storage } = await createAdminClient();

    try {
        const { user } = await checkAuth();
        if (!user) {
            return {
                error: "You must be logged in to create room",
            };
        }

        //Uploading image
        let imageID;

        const image = formData.get("image") as File;

        // if image is not provided
        if (image && (image as File).size > 0 && (image as File).name !== "undefined") {
            try {
                //upload file
                const response = await storage.createFile("rooms", ID.unique(), image);
                console.log(response || "FATAL ERROR");
                imageID = response.$id;
            } catch (error) {
                console.log("Error uploading image", error);
                return {
                    error: "Error uploading image",
                };
            }
        } else {
            console.log("Provided image file is invalid");
        }

        const room: NewRoom = {
            user_id: user.id,
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            sqft: formData.get("sqft") as string,
            capacity: formData.get("capacity") as string,
            location: formData.get("location") as string,
            address: formData.get("address") as string,
            availability: formData.get("availability") as string,
            price_per_hour: formData.get("price_per_hour") as string,
            amenities: formData.get("amenities") as string,
            image: imageID as string,
        };

        //Create room
        await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS!,
            ID.unique(),
            room
        );

        revalidatePath("/", "layout");

        return {
            success: true,
            room: room,
        };
    } catch (error) {
        console.log(error);
        const errorMessage = (error as ErrorResponse)?.response?.message || "An unexpected error has occured";
        return {
            error: errorMessage,
        };
    }
}

export default createRoom;
