// src/mocks/handlers.ts

import { feedHandlers } from "./handlers/feedHandlers";
import { myNetworkHandlers } from "./handlers/myNetworkHandlers";
import { notificationHandlers } from "./handlers/notificationHandlers";
import { profileHandlers } from "./handlers/profileHandlers";

export const handlers = [
  ...profileHandlers,
  ...notificationHandlers,
  ...myNetworkHandlers,
  ...feedHandlers,
];
