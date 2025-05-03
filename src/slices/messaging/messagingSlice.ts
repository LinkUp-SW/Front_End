
import { createSlice, PayloadAction } from "@reduxjs/toolkit";




/*interface Message {
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
  
  last_message_time:Date;
  last_message_text:string;
  
  unread_count_user1:number;
  unread_count_user2:number;
  is_blocked_by_user1:boolean;
  is_blocked_by_user2:boolean
  
  profileImg_user2: string;
  type: string[];
  status:string;
}
*/


interface User {
  userId: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
  onlineStatus: boolean;
}

interface LastMessage {
  message: string;
  timestamp:string | Date; 
  isOwnMessage: boolean;
}

interface Conversation {
  conversationId: string;
  conversationType:string[];
  otherUser: User;
  lastMessage: LastMessage;
  unreadCount: number;

}
interface MessageChat
  {
    messageId:string
    senderId: string;
    senderName: string;
    message: string;
    media: string[];
    timestamp: string | Date ;
    reacted: boolean;
    isSeen: boolean;
    isOwnMessage: boolean;
    isDeleted: boolean;
    isEdited: boolean;
  }
interface chattingMessages{
  conversationId: string;
  otherUser: User;
  messages: MessageChat[];
}

interface MessageState {
  conversations: Conversation[];
  selectedMessages: string;
  activeFilter: string;
  search: string;
  starredConversations: string[],
  user2Name:string;
  userStatus:boolean;
  editingMessageId:string;
  editText: string;
  user2Id:string;
  message:MessageChat;
  responsiveIsSidebar:boolean;
  chatData:chattingMessages;
  setEditedMessageIds: string[];
  setDataInfo:Conversation[];
  popup: boolean;

  user2IdPop:string;
  user2NamePop:string;
  user2ProfilePicturePop:string;
  user2HeadlinePop:string;

  totalCount:number




}

const initialState: MessageState = {
  conversations: [],
  selectedMessages: "",
  activeFilter:"Focused",
  search:"",
  starredConversations: [],
  user2Name:"",
  userStatus:false,
  editingMessageId: "",
  editText: "",
  user2Id:"",
  message: {
    messageId: '',
    senderId: '',
    senderName: '',
    message: '',
    media: [],
    timestamp: new Date(),
    reacted: false,
    isSeen: false,
    isOwnMessage: false,
    isDeleted: false,
    isEdited: false, 

  },
  responsiveIsSidebar:false,
  chatData: {
    conversationId: '',
    otherUser: {
      userId: '',
      firstName: '',
      lastName: '',
      profilePhoto: '',
      onlineStatus: false
    },
    messages: []
},
setEditedMessageIds:[],
setDataInfo:[],
popup: false,

user2IdPop:"",
user2NamePop:"",
user2ProfilePicturePop:"",
user2HeadlinePop:"",

totalCount: 0,



};



const MessagingSlice = createSlice({
  name: "messaging",
  initialState,
  reducers: {

    selectMessage: (state, action: PayloadAction<string>) => {
      state.selectedMessages = action.payload; 
    },
    addMessage: (state, action: PayloadAction<MessageChat>) => {
      state.message = action.payload;
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

    selectUserStatus: (state, action: PayloadAction<boolean>) => {
      state.userStatus = action.payload; 
    },

    selectUserId: (state, action: PayloadAction<string>) => {
      state.user2Id = action.payload; 
    },

    searchFiltering: (state, action: PayloadAction<string>) => {
      state.search = action.payload; 
    },

    activeButton: (state, action: PayloadAction<string>) => {
      state.activeFilter = action.payload; 
    },

  /*chatData 3ashan el edit w el delete y update fee wa2tha*/
  setChatData:(state, action: PayloadAction<chattingMessages>) => {
    state.chatData = action.payload; 
  },

  /*editing*/
    setEditingMessageId:(state, action: PayloadAction<string>) => {
      state.editingMessageId = action.payload; 
    },
    setEditText: (state, action: PayloadAction<string>) => {
      state.editText = action.payload;
    },
    clearEditingState: (state) => {
      state.editingMessageId = "";
      state.editText = "";
    },
                /*setEditedMessageIds 3ashan a print (Edited)*/  
    setEditedMessageIds: (state, action: PayloadAction<string[]>) => {
      state.setEditedMessageIds = action.payload;
    },
    /*Responsiveness bta3 el messagingPage*/
    setResponsiveIsSidebar: (state, action: PayloadAction<boolean>) => {
      state.responsiveIsSidebar = action.payload;
    },

    /*setDataInfon 3ashan a print el data ely bta3 el conversation*/
    setDataInfo: (state, action: PayloadAction<Conversation[]>) => {
      state.setDataInfo = action.payload; 
    },

    // popup of NewMessage
    setShowPopup: (state, action: PayloadAction<boolean>) => {
      state.popup = action.payload; 
    },

    setUser2IdPop: (state, action: PayloadAction<string>) => {
      state.user2IdPop = action.payload; 
    },
    setUser2NamePop: (state, action: PayloadAction<string>) => {
      state.user2NamePop = action.payload; 
    },
    setUser2ProfilePicturePop: (state, action: PayloadAction<string>) => {
      state.user2ProfilePicturePop = action.payload; 
    },
    setUser2HeadlinePop: (state, action: PayloadAction<string>) => {
      state.user2HeadlinePop = action.payload; 
    },

    setTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload; 
    } 


    
    
    
    

  },
});

export const {toggleStarred, activeButton, searchFiltering, selectMessage,selectUserName,selectUserStatus,setEditingMessageId,setEditText,clearEditingState,selectUserId,addMessage,setResponsiveIsSidebar,setChatData,setEditedMessageIds,setDataInfo,setShowPopup,setUser2IdPop,setUser2NamePop,setUser2ProfilePicturePop,setUser2HeadlinePop,setTotalCount} = MessagingSlice.actions;
export default MessagingSlice.reducer;
