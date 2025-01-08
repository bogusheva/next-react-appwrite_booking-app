import Heading from "@/components/Heading";
import getMyBookings from "../actions/getMyBookings";
import BookedRoomCard from "@/components/BookedRoomCard";

const BookingsPage = async () => {
    const { bookings } = await getMyBookings();
    return (
        <>
            <Heading title="Bookings" />
            {!!bookings?.length ? (
                <>
                    {bookings.map((booking) => (
                        <BookedRoomCard key={booking.$id} booking={booking} />
                    ))}
                </>
            ) : (
                <p className="text-gray-600 mt-4">You have no bookings</p>
            )}
        </>
    );
};

export default BookingsPage;
