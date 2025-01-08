import Heading from "@/components/Heading";
import RoomCard from "@/components/RoomCard";
import getAllRooms from "./actions/getAllRooms";
import { Room } from "./types";

export default async function Home() {
    const rooms: Room[] = await getAllRooms();

    return (
        <>
            <Heading title="Available rooms" />
            {!!rooms.length ? (
                rooms.map((room) => <RoomCard key={room.$id} room={room} />)
            ) : (
                <p>No rooms available at the moment</p>
            )}
        </>
    );
}
