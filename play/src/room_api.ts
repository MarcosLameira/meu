import * as grpc from "@grpc/grpc-js";
import { RoomApiService } from "@workadventure/messages/src/ts-proto-generated/room-api";
import { ADMIN_API_URL, ROOM_API_PORT, ROOM_API_SECRET_KEY } from "./pusher/enums/EnvironmentVariable";
import RoomApiServer from "./room-api/RoomApiServer";

// Room API
if (!ADMIN_API_URL && !ROOM_API_SECRET_KEY) {
    console.info("RoomAPI is disabled! ROOM_API_SECRET_KEY is not defined on environment variables.");
} else {
    const RoomAPI = new grpc.Server();

    RoomAPI.addService(RoomApiService, RoomApiServer);

    RoomAPI.bindAsync(`0.0.0.0:${ROOM_API_PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            throw err;
        }
        console.log(`RoomAPI starting on port ${ROOM_API_PORT}!`);
        RoomAPI.start();
    });
}