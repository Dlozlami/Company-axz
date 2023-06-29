import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jwt_decode from 'jwt-decode';


const initialState = {
  userData: {
    id:"",
    password: "",
    name: "",
    surname: "",
    email: "",
    bio: "",
    pic: "",
    birthday: "",
    position: "",
    phone: "",
  },
  validPwd: 0,
  validUsername: 0,
  isLoggedIn:false,

};

export const setLogin = createAsyncThunk(
  'login/setLogin',
  async ([username, password],thunkAPI) => {
    const url = `http://localhost:5000/employees/login/`;
    try {
      const resp = await axios.post(url, {username:username,password:password});
      // Retrieve the stored password from the response data

      const storedPassword = resp.data[0].password;

      thunkAPI.dispatch(setValidUsername(1));

      // Compare the password provided by the user with the stored password
      if (password !== storedPassword) {
        thunkAPI.dispatch(setValidPwd(2));
        return;
      }

      thunkAPI.dispatch(setValidPwd(1));
      thunkAPI.dispatch(setUserData(resp.data[0]));
      thunkAPI.dispatch(setIsLoggedIn(true));

      return;
    } 
    
    catch (error) {
      thunkAPI.dispatch(setValidUsername(2));
      thunkAPI.dispatch(setValidPwd(0));
      return thunkAPI.rejectWithValue('something went wrong');
    }
  }
);



const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {

    clearState: (state, { payload }) => {
      state.userData = {
        id:"",
        password: "",
        name: "",
        surname: "",
        email: "",
        bio: "",
        pic: "",
        birthday: "",
        position: "",
        phone: "",
      };
      state.isLoggedIn = false;
      state.employees =[];
    },

    setValidPwd: (state, { payload }) => {
      state.validPwd = payload;
    },

    setValidUsername: (state, { payload }) => {
      state.validUsername = payload;
    },

    setIsLoggedIn: (state, { payload }) => {
      state.isLoggedIn = payload;
    },

    setUserData: (state, { payload }) => {
      state.userData = payload;
    },
    
  },

});

// Include the methods in normal reducers in actions to avoid undefined errors
export const {
  setIsLoggedIn,
  clearState,
  setValidPwd,
  setValidUsername,
  setUserData
} = loginSlice.actions;

export default loginSlice.reducer;
