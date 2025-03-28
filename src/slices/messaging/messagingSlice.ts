import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  id: string;
  Img: string;
  name: string;
  message: string;
  date: number;
}

interface Conversation {
  conversationID: string;
  recieverID: string;
  senderID: string;
  profileImg: string;
  messages: Message[];
  type: string[];
}

interface MessageState {
  conversations: Conversation[];
  selectedMessages: string;
  activeFilter: string;
  search: string;
}

const initialState: MessageState = {
  conversations: [],
  selectedMessages: "",
  activeFilter:"Focused",
  search:"",
};

const MessagingSlice = createSlice({
  name: "messaging",
  initialState,
  reducers: {
    sendMessage: (state, action: PayloadAction<{ senderID: string; profileImg: string; convID: string; message: Message }>) => {
      const { convID, message, senderID, profileImg } = action.payload;
      const conversation = state.conversations.find((conv) => conv.conversationID === convID);

      if (conversation) {
        conversation.messages.push(message);
      } else {
        state.conversations.push({
          conversationID: convID,
          recieverID: convID,
          senderID: senderID,
          profileImg: profileImg,
          messages: [message],
          type: ["Focused"],
        });
      }
    },

    selectMessage: (state, action: PayloadAction<string>) => {
      state.selectedMessages = action.payload; 
    },

    searchFiltering: (state, action: PayloadAction<string>) => {
      state.search = action.payload; 
    },

    activeButton: (state, action: PayloadAction<string>) => {
      state.activeFilter = action.payload; 
    },
  },
});

export const { activeButton, searchFiltering, selectMessage, sendMessage} = MessagingSlice.actions;
export default MessagingSlice.reducer;
