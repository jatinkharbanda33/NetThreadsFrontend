import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  initialState: null,
  name: 'user',
  reducers: {
    changeUser: (state,action) =>{
        return action.payload;
    },
    changeName:(state,action)=>{
      return {...state,name:action.payload};
    },
    changeUsername:(state,action)=>{
      return {...state,username:action.payload};
    },
    changeVerifiedStatus:(state,action)=>{
      return {...state,verified:action.payload};
    }
  }
});

export const { changeUser,changeName,changeUsername,changeVerifiedStatus } = userSlice.actions;

export default userSlice.reducer;
