import "reflect-metadata";
import "../../../modules/websocket/ChatService";
import { http } from "./app";

http.listen(3333, () => console.log("Server is running!!"));
