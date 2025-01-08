'use server';

import { createAdminClient } from "../../config/appwrite";
import { redirect } from "next/navigation";
import { Room } from "@/app/types";

async function getAllRooms() {
  try {
    const { databases } =await createAdminClient();

    //fetch rooms
    const {documents: rooms} = await databases.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DATABASE!, process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS!);

    return rooms as unknown as Room[];

  } catch (error) {
    console.log('Failed to get rooms', error);
    redirect('/error');
  }
}

export default getAllRooms;