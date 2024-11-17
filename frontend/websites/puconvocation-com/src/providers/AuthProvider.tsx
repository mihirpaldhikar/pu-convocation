/*
 * Copyright (C) PU Convocation Management System Authors
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

"use client";

import { createContext, Dispatch, ReactNode, useReducer } from "react";
import { Account } from "@dto/index";

export type AuthAction =
  | {
      type: "SET_ACCOUNT";
      payload: {
        account: Account;
      };
    }
  | {
      type: "SIGN_OUT";
    };

const authReducer = (
  account: Account | null = null,
  action: AuthAction,
): Account | null => {
  switch (action.type) {
    case "SET_ACCOUNT": {
      return {
        ...action.payload.account,
      };
    }
    case "SIGN_OUT": {
      return null;
    }
    default: {
      return account;
    }
  }
};

export const AuthContext = createContext<{
  account: Account | null;
  dispatch: Dispatch<AuthAction>;
}>({
  account: null,
  dispatch: () => undefined,
});

export interface AuthProviderProps {
  children: ReactNode;
  account: Account | null;
}

const AuthProvider = ({ children, account }: Readonly<AuthProviderProps>) => {
  const [state, dispatch] = useReducer(authReducer, account);

  return (
    <AuthContext.Provider
      value={{
        account: state,
        dispatch: dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
