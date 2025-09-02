import { createSlice } from '@reduxjs/toolkit';
import { getProfileAPI, loginAPI } from '@/apis/user';
import { setToken as _setToken, getToken, removeToken } from '@/utils';

const userStore = createSlice({
  name: 'user',
  initialState: {
    token: getToken(),
    userInfo: {},
  },
  //   同步修改方法
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      _setToken(action.payload);
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
    clearUserInfo(state) {
      state.token = '';
      removeToken();
      state.userInfo = {};
    },
  },
});

// 解构出actionCreater
const { setToken, setUserInfo, clearUserInfo } = userStore.actions;

// 获取reducer函数
const userReducer = userStore.reducer;

// 异步方法，完成登录获取token
function fetchLogin(loginForm) {
  return async (dispatch) => {
    const response = await loginAPI(loginForm);
    dispatch(setToken(response.data.token));
  };
}
function fetchUserInfo() {
  return async (dispatch) => {
    const response = await getProfileAPI();
    dispatch(setUserInfo(response.data));
  };
}

export { clearUserInfo, fetchLogin, fetchUserInfo, setToken };

export default userReducer;
