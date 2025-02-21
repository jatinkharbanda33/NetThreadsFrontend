import { createSlice } from '@reduxjs/toolkit';
export const searchCacheSlice = createSlice({
  initialState: {
    "":{
      values:[],
      page:0
    }
  },
  name: 'searchCache',
  reducers: {
    addInCache: (state, action) => {
      let key= action.payload.key;
      let values=action.payload.values;
      let page=action.payload.page;
      let prevValues=[];
      let newObj= {...state};
      newObj[key]={values:[...prevValues,...values],page:page};
      return newObj;
    }
  }
});

export const {addInCache} = searchCacheSlice.actions;
export default searchCacheSlice.reducer;