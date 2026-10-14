import {
  createSlice,
  type ActionReducerMapBuilder,
  type Draft,
  type PayloadAction
} from '@reduxjs/toolkit';
import { createAsyncThunkWithCancelToken, unauthorizedAPI } from '../../configs';
import { APIConst, ToolkitAction } from '../../constants';
import INITIAL_STATE, { type AuthStateType } from './AuthInitial';
import type { ErrorResponse, UserResponse } from '../../types';

/**
 * Creates an async thunk action creator that will dispatch actions to the reducer and will sign in the user.
 * @param {string} [typePrefix='auth/signin'] - The prefix for the thunk type.
 * @param {Method} [method='post'] - Method - the HTTP method to use POST.
 * @param {string} [url='/login'] - The url of the signin endpoint.
 * @param {ApisauceInstance} api - The unauthorizedAPI API instance to use.
 */
const signinRequest = createAsyncThunkWithCancelToken<UserResponse>(
  ToolkitAction.signin,
  'POST',
  APIConst.signin,
  unauthorizedAPI
);

/**
 * Creating a auth slice of the redux store
 * @param {AuthStateType} state - The current state of the auth reducer.
 * @param {Action} action - The action to handle.
 * @returns {AuthStateType} The new state of the auth reducer.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: INITIAL_STATE,
  reducers: {
    /**
     * Sets the logged in state.
     * @param {AuthStateType} state - The current auth state.
     * @param {PayloadAction<boolean>} action - The action with the logged in value.
     */
    setLoggedIn: (state: Draft<AuthStateType>, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    /**
     * Logs out the user and resets the entire auth state to its initial value.
     * Clears user data, errors, and login status.
     * @returns {AuthStateType} The reset initial state.
     */
    logout: () => INITIAL_STATE
  },
  extraReducers: (builder: ActionReducerMapBuilder<AuthStateType>) => {
    builder.addCase(signinRequest.pending, (state: Draft<AuthStateType>) => {
      state.isLoading = true;
    });
    builder.addCase(
      signinRequest.fulfilled,
      (state: Draft<AuthStateType>, action: PayloadAction<UserResponse>) => {
        state.isLoading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(
      signinRequest.rejected,
      (state: Draft<AuthStateType>, action: PayloadAction<ErrorResponse | undefined>) => {
        state.isLoading = false;
        state.error = action.payload;
      }
    );
  }
});

/* Exporting the reducer function that will be used in the root reducer. */
export const AuthReducer = authSlice.reducer;

/**
 * Creates an object with all of the actions for the auth slice.
 * @returns {Object} - An object with all of the actions for the auth slice.
 */
export const AuthActions = { ...authSlice.actions, signinRequest };
