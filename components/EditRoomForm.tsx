"use client";
import { Room } from "@/app/types";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import updateRoom from "@/app/actions/updateRoom";

const EditRoomForm = ({ room }: { room: Room }) => {
    const [state, formAction] = useActionState(updateRoom, {});
    const router = useRouter();
    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;

    const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${room.image}/view?project=${projectId}`;

    const imageSrc = room.image ? imageUrl : "/images/no-image.jpg";

    useEffect(() => {
        console.log(state.room);
        if (state.error) {
            toast.error(state.error);
        }
        if (state.success) {
            toast.success("Room edited successfully");
            router.push("/rooms/my");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, router]);

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full">
            <form action={formAction}>
                <input type="hidden" name="id" value={room.$id} />
                <div className="mb-4 flex items-center">
                    <label htmlFor="name" className="block w-1/3 text-gray-700 font-bold mb-2">
                        Room name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={room.name}
                        className="border rounded w-full py-2 px-3"
                        placeholder="Enter a name (Large Conference Room)"
                        required
                    />
                </div>

                <div className="mb-4 flex items-center">
                    <label htmlFor="description" className="block w-1/3 text-gray-700 font-bold mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        defaultValue={room.description}
                        className="border rounded w-full h-24 py-2 px-3"
                        placeholder="Enter a description for the room"
                        required
                    ></textarea>
                </div>

                <div className="mb-4 flex items-center">
                    <label htmlFor="sqft" className="block w-1/3 text-gray-700 font-bold mb-2">
                        Square Feet
                    </label>
                    <input
                        type="number"
                        id="sqft"
                        name="sqft"
                        defaultValue={room.sqft}
                        className="border rounded w-full py-2 px-3"
                        placeholder="Enter room size in ft"
                        required
                    />
                </div>

                <div className="mb-4 flex items-center">
                    <label htmlFor="capacity" className="block w-1/3 text-gray-700 font-bold mb-2">
                        Capacity
                    </label>
                    <input
                        type="number"
                        id="capacity"
                        name="capacity"
                        defaultValue={room.capacity}
                        className="border rounded w-full py-2 px-3"
                        placeholder="Number of people the room can hold"
                        required
                    />
                </div>

                <div className="mb-4 flex items-center">
                    <label htmlFor="price_per_hour" className="block w-1/3 text-gray-700 font-bold mb-2">
                        Price Per Hour
                    </label>
                    <input
                        type="number"
                        id="price_per_hour"
                        defaultValue={room.price_per_hour}
                        name="price_per_hour"
                        className="border rounded w-full py-2 px-3"
                        placeholder="Enter price per hour"
                        required
                    />
                </div>

                <div className="mb-4 flex items-center">
                    <label htmlFor="address" className="block w-1/3 text-gray-700 font-bold mb-2">
                        Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        defaultValue={room.address}
                        className="border rounded w-full py-2 px-3"
                        placeholder="Enter full address"
                        required
                    />
                </div>

                <div className="mb-4 flex items-center">
                    <label htmlFor="location" className="block w-1/3 text-gray-700 font-bold mb-2">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        defaultValue={room.location}
                        className="border rounded w-full py-2 px-3"
                        placeholder="Location (Building, Floor, Room)"
                        required
                    />
                </div>

                <div className="mb-4 flex items-center">
                    <label htmlFor="availability" className="block w-1/3 text-gray-700 font-bold mb-2">
                        Availability
                    </label>
                    <input
                        type="text"
                        id="availability"
                        name="availability"
                        defaultValue={room.availability}
                        className="border rounded w-full py-2 px-3"
                        placeholder="Availability (Monday - Friday, 9am - 5pm)"
                        required
                    />
                </div>

                <div className="mb-4 flex items-center">
                    <label htmlFor="amenities" className="block w-1/3 text-gray-700 font-bold mb-2">
                        Amenities
                    </label>
                    <input
                        type="text"
                        id="amenities"
                        name="amenities"
                        defaultValue={room.amenities}
                        className="border rounded w-full py-2 px-3"
                        placeholder="Amenities CSV (projector, whiteboard, etc.)"
                        required
                    />
                </div>

                <div className="mb-8 flex items-center">
                    <label htmlFor="image" className="block w-1/3  text-gray-700 font-bold">
                        Image
                    </label>

                    <div className="w-full">
                        <Image
                            width={640}
                            height={640}
                            src={imageSrc}
                            alt={room.name}
                            className="w-full sm:w-32 sm:h-32 mb-3 sm:mb-0 object-cover rounded-lg"
                        />
                        {/* {room.image ? (
                            <input type="hidden" name="image" id="image" value={room.image} />
                        ) : (
                            <input type="file" id="image" name="image" className="border rounded py-2 px-3 mt-2" />
                        )} */}
                        <input
                            type="file"
                            id="updated_image"
                            name="updated_image"
                            className="border rounded py-2 px-3 mt-2"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditRoomForm;
