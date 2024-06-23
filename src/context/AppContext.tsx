import React, {createContext, useReducer, ReactNode} from 'react';
import {AppState, AppContextValue, Action} from '../types';

const initialState: AppState = {
  isLoggedIn: false,
  user: null,
  homes: [],
  error: null,
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    case 'SET_HOMES':
      return {
        ...state,
        homes: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const AppProvider = ({children}: {children: ReactNode}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{state, dispatch}}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
