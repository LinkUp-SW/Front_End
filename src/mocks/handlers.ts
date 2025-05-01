// src/mocks/handlers.ts

import { myNetworkHandlers } from "./handlers/myNetworkHandlers";
import { notificationHandlers } from "./handlers/notificationHandlers";
import { profileHandlers } from "./handlers/profileHandlers";

export const handlers = [
  ...profileHandlers,
  ...notificationHandlers,
  ...myNetworkHandlers,
];
