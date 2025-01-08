import Heading from "@/components/Heading";

import getMyRooms from "@/app/actions/getMyRooms";
import MyRoomCard from "@/components/MyRoomCard";

const MyRoomsPage = async () => {
    const rooms = await getMyRooms();
    return (
        <>
            <Heading title="My Rooms" />
            {!!rooms.length ? rooms.map((room) => <MyRoomCard key={room.$id} room={room} />) : <h3>No rooms yet</h3>}
        </>
    );
};

export default MyRoomsPage;
