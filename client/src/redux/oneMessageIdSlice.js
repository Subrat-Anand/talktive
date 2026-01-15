import { createSlice } from "@reduxjs/toolkit";

const onMessageIdSlice = createSlice({
    name: "onSingleMessageId",
    initialState: null,
    reducers: {
        setOnMessageId: (state, action) => action.payload,
        clearUnsendMessage: () => null
    }
})

export const { setOnMessageId, clearUnsendMessage } = onMessageIdSlice.actions;

export default onMessageIdSlice.reducer;
