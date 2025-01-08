'use server';

import { createAdminClient } from "../../config/appwrite";
import { redirect } from "next/navigation";
import { Room } from "@/app/types";

async function getSingleRoom(id: string) {
  try {
    const { databases } =await createAdminClient();

    //fetch rooms
    const room = await databases.getDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE!, process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS!, id);

    return room as unknown as Room;

  } catch (error) {
    console.log('Failed to get single room', error);
    redirect('/error');
  }
}

export default getSingleRoom;