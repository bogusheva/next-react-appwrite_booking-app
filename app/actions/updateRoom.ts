"use server";

import { createAdminClient } from "@/config/appwrite";
import checkAuth from "./checkAuth";
import { revalidatePath } from "next/cache";
import { ErrorResponse, NewRoom, State } from "../types";
import { ID } from "node-appwrite";

async function updateRoom(state: State, formData: FormData): Promise<State> {
    //Get databases instance
    const { databases, storage } = await createAdminClient();
    console.log("formData", formData);
    try {
        const { user } = await checkAuth();
        if (!user) {
            return {
                error: "You must be logged in to update the room",
            };
        }

        const roomId = formData.get("id") as string;
        if (!roomId) {
            return {
                error: "Room ID is required to update the room",
            };
        }

        let imageID;

        const updatedImage = formData.get("updated_image") as File;

        //if updated image is provided
        if (updatedImage && (updatedImage as File).size > 0 && (updatedImage as File).name !== "undefined") {
            try {
                //upload file
                const response = await storage.createFile("rooms", ID.unique(), updatedImage);
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

        const room: Partial<NewRoom> = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            sqft: formData.get("sqft") as string,
            capacity: formData.get("capacity") as string,
            location: formData.get("location") as string,
            address: formData.get("address") as string,
            availability: formData.get("availability") as string,
            price_per_hour: formData.get("price_per_hour") as string,
            amenities: formData.get("amenities") as string,
            image: updatedImage ? (imageID as string) : (formData.get("image") as string),
        };

        //Update room
        const updatedRoom = await databases.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS!,
            roomId,
            room
        );

        revalidatePath("/rooms/my", "layout");
        console.log(updatedRoom);
        return {
            success: true,
        };
    } catch (error) {
        console.log(error);
        const errorMessage = (error as ErrorResponse)?.response?.message || "An unexpected error has occured";
        return {
            error: errorMessage,
        };
    }
}

export default updateRoom;
