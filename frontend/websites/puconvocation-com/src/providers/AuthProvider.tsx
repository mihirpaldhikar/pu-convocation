/*
 * Copyright (c) PU Convocation Management System Authors
 *
 * This software is owned by PU Convocation Management System Authors.
 * No part of the software is allowed to be copied or distributed
 * in any form. Any attempt to do so will be considered a violation
 * of copyright law.
 *
 * This software is protected by copyright law and international
 * treaties. Unauthorized copying or distribution of this software
 * is a violation of these laws and could result in severe penalties.
 */

import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";
import { Account } from "@dto/index";
import { AuthService } from "@services/index";

export type AuthAction =
  | {
      type: "SET_ACCOUNT";
      payload: {
        account: Account | null;
      };
    }
  | {
      type: "LOADING";
      payload: {
        loading: boolean;
      };
    }
  | {
      type: "SIGN_OUT";
      payload: {
        account: null;
      };
    };

export type AuthState = {
  account: Account | null;
  loading: boolean;
  authService: AuthService;
};

const initialAuthState: AuthState = {
  account: null,
  loading: true,
  authService: new AuthService(),
};

const authReducer = (
  state: AuthState = initialAuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case "SET_ACCOUNT": {
      return {
        ...state,
        account: action.payload.account,
        loading: false,
      };
    }
    case "SIGN_OUT": {
      return {
        ...state,
        account: null,
      };
    }
    case "LOADING": {
      return {
        ...state,
        loading: action.payload.loading,
      };
    }
    default: {
      return state;
    }
  }
};

export const AuthContext = createContext<{
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
}>({
  state: initialAuthState,
  dispatch: () => undefined,
});

export interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  return (
    <AuthContext.Provider
      value={{
        state: state,
        dispatch: dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth Hook must be used within the Auth Provider");
  }
  return context;
};

export default AuthProvider;
