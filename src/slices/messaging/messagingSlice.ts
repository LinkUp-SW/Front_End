import SendingMessages from "@/pages/messaging/SendingMessages";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
    id: number,
    profileImg:string,
    name: string,
    message:string,
    date: string,
    type: string[],
}

interface MessageState {
  messages:Message[];
}

const initialState: MessageState = {
  messages: [],
};

const MessagingSlice = createSlice({
  name: "messaging",
  initialState,
  reducers: {
    sendMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
  },
});

export const { sendMessage } = MessagingSlice.actions;
export default MessagingSlice.reducer;
