import getSingleRoom from "@/app/actions/getSingleRoom";
import EditRoomForm from "@/components/EditRoomForm";
import Heading from "@/components/Heading";

interface Props {
    params: Promise<{ id: string }>;
}

const EditMyRoom = async ({ params }: Props) => {
    const { id } = await Promise.resolve(params);
    const room = await getSingleRoom(id);

    return (
        <>
            <Heading title="Edit room" />
            <EditRoomForm room={room} />
        </>
    );
};

export default EditMyRoom;
