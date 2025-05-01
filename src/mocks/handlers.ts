// src/mocks/handlers.ts

import { feedHandlers } from "./handlers/feedHandlers";
import { myNetworkHandlers } from "./handlers/myNetworkHandlers";
import { profileHandlers } from "./handlers/profileHandlers";

export const handlers = [
  ...profileHandlers,
  ...myNetworkHandlers,
  ...feedHandlers,
];
