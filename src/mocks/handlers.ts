// src/mocks/handlers.ts

import { myNetworkHandlers } from "./handlers/myNetworkHandlers";
import { profileHandlers } from "./handlers/profileHandlers";

export const handlers = [
  ...profileHandlers,
  ...myNetworkHandlers,
];
