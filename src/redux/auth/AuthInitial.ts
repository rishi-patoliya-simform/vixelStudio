import type { ErrorResponse, UserResponse } from '../../types';

/**
 * The state of the authentication process.
 * @typedef {Object} AuthStateType
 * @property {UserResponse | undefined} user - The user object if the user is authenticated.
 * @property {boolean} isLoading - Whether the authentication process is in progress.
 * @property {boolean} isLoggedIn - Whether the user is currently logged in.
 * @property {ErrorResponse | undefined} error - The error object if there was an error.
 */
export interface AuthStateType {
  user?: UserResponse;
  isLoading: boolean;
  isLoggedIn: boolean;
  error?: ErrorResponse;
}

/**
 * Defining the initial state of the auth reducer.
 * @returns {AuthStateType} The initial state of the auth reducer.
 */
const INITIAL_STATE: AuthStateType = {
  user: undefined,
  isLoading: false,
  isLoggedIn: false,
  error: undefined
};

export default INITIAL_STATE;
