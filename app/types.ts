import { cookies } from "next/headers";

export interface NewRoom {
    user_id: string;
    name: string;
    description: string;
    sqft: string;
    capacity: string;
    location: string;
    address: string;
    amenities: string;
    availability: string;
    price_per_hour: string;
    image: string;
}

export interface Room extends NewRoom {
    $id: string;
}

export interface Booking {
    $id: string;
    user_id: string;
    check_in: string;
    check_out: string;
    room_id: Room;
}

export interface State {
    error?: string;
    success?: boolean;
    room?: NewRoom;
}

export interface CurrentUser {
    id: string;
    email: string;
    name: string;
}

export interface CheckAuthentication {
    isAuthenticated: boolean;
    user?: CurrentUser;
}

export interface ErrorResponse {
    response?: {
        message?: string;
    };
}

export type Cookies = ReturnType<typeof cookies> & {
    set?: (name: string, value: string, options: Record<string, unknown>) => void;
};
