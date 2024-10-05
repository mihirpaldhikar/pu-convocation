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
import { Enclosure, RemoteConfig } from "@dto/index";
import { RemoteConfigController } from "@controllers/index";

export type RemoteConfigAction =
  | {
      type: "SET_CONFIG";
      payload: {
        config: RemoteConfig | null;
      };
    }
  | {
      type: "LOADING";
      payload: {
        loading: boolean;
      };
    }
  | {
      type: "SET_ENCLOSURE";
      payload: {
        index: number;
        enclosure: Enclosure;
      };
    };

export type RemoteConfigState = {
  config: RemoteConfig | null;
  loading: boolean;
  remoteConfigController: RemoteConfigController;
};

const initialConfig: RemoteConfigState = {
  config: null,
  loading: true,
  remoteConfigController: new RemoteConfigController(),
};

const configReducer = (
  state: RemoteConfigState = initialConfig,
  action: RemoteConfigAction,
): RemoteConfigState => {
  switch (action.type) {
    case "SET_CONFIG": {
      return {
        ...state,
        config: action.payload.config,
        loading: false,
      };
    }
    case "LOADING": {
      return {
        ...state,
        loading: action.payload.loading,
      };
    }
    case "SET_ENCLOSURE": {
      state.config!!.groundMappings[action.payload.index] = { ...action.payload.enclosure }
      return {
        ...state,
      };
    }
    default: {
      return state;
    }
  }
};

export const RemoteConfigContext = createContext<{
  state: RemoteConfigState;
  dispatch: Dispatch<RemoteConfigAction>;
}>({
  state: initialConfig,
  dispatch: () => undefined,
});

export interface RemoteConfigProviderProps {
  children: ReactNode;
}

const RemoteConfigProvider = ({ children }: RemoteConfigProviderProps) => {
  const [state, dispatch] = useReducer(configReducer, initialConfig);

  return (
    <RemoteConfigContext.Provider
      value={{
        state: state,
        dispatch: dispatch,
      }}
    >
      {children}
    </RemoteConfigContext.Provider>
  );
};

export default RemoteConfigProvider;
