import { createSlice } from '@reduxjs/toolkit'

export interface UserState {
  displayName: string;
  photoURL: string;
  uid: string;
}

export interface ChatState {
  chatId: string;
  user: UserState;
}

const initialState: ChatState = {
  chatId: "null",
  user: {
    displayName: "",
    photoURL: "",
    uid: ""
  }
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    changeUser: (state, action) => {
        state.user = action.payload.selectUser
        const currentUser = action.payload.currentUser.uid
        state.chatId =
            currentUser > state.user.uid
                ? currentUser + state.user.uid
                : state.user.uid + currentUser
    },
  },
})

export const { changeUser } = chatSlice.actions

export default chatSlice.reducer