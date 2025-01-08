import Link from "next/link";
import { FaEye, FaEdit } from "react-icons/fa";

import { Room } from "@/app/types";
import DeleteRoomButton from "./DeleteRoomButton";

const MyRoomCard = ({ room }: { room: Room }) => {
    return (
        <div className="bg-white shadow rounded-lg p-4 mt-4 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex flex-col">
                <h4 className="text-lg font-semibold">{room.name}</h4>
            </div>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto sm:space-x-2 mt-2 sm:mt-0">
                <Link
                    href={`/rooms/${room.$id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-blue-700"
                >
                    <FaEye className="inline mr-1" /> View
                </Link>
                <Link
                    href={`/rooms/${room.$id}/edit`}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-blue-700"
                >
                    <FaEdit className="inline mr-1" />
                    Edit
                </Link>
                <DeleteRoomButton roomId={room.$id} />
            </div>
        </div>
    );
};

export default MyRoomCard;
