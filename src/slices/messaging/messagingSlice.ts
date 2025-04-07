import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface Message {
  id: string;
  message:string;
  media:string[];
  media_type:string[];
  timestamp:Date;
  reacted:boolean;
  is_seen:boolean;
  user1_img:string;
  user2_img:string;
  user1_name:string;
  user2_name:string;
  
}

interface Conversation {
  conversationID: string;
  user1_id: string;
  user2_id: string;
  user2_name:string;
  user1_sent_messages: Message[];
  /*user2_sent_messages: Message[];*/
  last_message_time:Date;
  last_message_text:string;
  /*
  unread_count_user1:number;
  unread_count_user2:number;
  is_blocked_by_user1:boolean;
  is_blocked_by_user2:boolean
  */
  profileImg_user2: string;
  type: string[];
  status:string;
}

interface MessageState {
  conversations: Conversation[];
  selectedMessages: string;
  activeFilter: string;
  search: string;
  starredConversations: string[],/*initial state should be starred from database*/
  user2Name:string;
  userStatus:string;
}

const initialState: MessageState = {
  conversations: [],
  selectedMessages: "",
  activeFilter:"Focused",
  search:"",
  starredConversations: [],
  user2Name:"",
  userStatus:""
};

const MessagingSlice = createSlice({
  name: "messaging",
  initialState,
  reducers: {
    sendMessage: (state, action: PayloadAction<{user2Name:string,convID: string;lastTextMessage:string; date:Date; user2ID:string; senderID: string; profileImg: string;  message: Message }>) => {
      const {user2Name,lastTextMessage, date, convID, message, senderID,user2ID, profileImg } = action.payload;
      const conversation = state.conversations.find((conv) => conv.conversationID === convID);

      if (conversation) {
        conversation.user1_sent_messages.push(message);
      } else {
        state.conversations.push({
          conversationID: convID,
          user1_id: senderID,
          user2_id: user2ID,/*TEMP*/
          user2_name:user2Name,
          user1_sent_messages: [message],
          /*user2_sent_messages: [message],/*TEMP*/
          last_message_time: date,
          last_message_text:lastTextMessage,
          /*
          unread_count_user1:number;
          unread_count_user2:number;
          is_blocked_by_user1:boolean;
          is_blocked_by_user2:boolean,
         */
          profileImg_user2: profileImg,
          type: ["Focused"],
          status:"online"
        });
      }
    },

    selectMessage: (state, action: PayloadAction<string>) => {
      state.selectedMessages = action.payload; 
    },

    toggleStarred(state, action: PayloadAction<string>) {
      const conversationID = action.payload;
      if (state.starredConversations.includes(conversationID)) {
        state.starredConversations = state.starredConversations.filter(
          (id) => id !== conversationID
        );
      } else {
        state.starredConversations.push(conversationID);
      }
    },

    selectUserName: (state, action: PayloadAction<string>) => {
      state.user2Name = action.payload; 
    },

    selectUserStatus: (state, action: PayloadAction<string>) => {
      state.userStatus = action.payload; 
    },


    searchFiltering: (state, action: PayloadAction<string>) => {
      state.search = action.payload; 
    },

    activeButton: (state, action: PayloadAction<string>) => {
      state.activeFilter = action.payload; 
    },

  },
});

export const {toggleStarred, activeButton, searchFiltering, selectMessage,selectUserName,selectUserStatus, sendMessage} = MessagingSlice.actions;
export default MessagingSlice.reducer;
