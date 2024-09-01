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
import { WebsiteConfig } from "@dto/index";
import { DynamicsService } from "@services/index";

export type WebsiteConfigAction =
  | {
      type: "SET_CONFIG";
      payload: {
        config: WebsiteConfig | null;
      };
    }
  | {
      type: "LOADING";
      payload: {
        loading: boolean;
      };
    };

export type WebsiteConfigState = {
  config: WebsiteConfig | null;
  loading: boolean;
  dynamicsService: DynamicsService;
};

const initialWebsiteConfigState: WebsiteConfigState = {
  config: null,
  loading: true,
  dynamicsService: new DynamicsService(),
};

const configReducer = (
  state: WebsiteConfigState = initialWebsiteConfigState,
  action: WebsiteConfigAction,
): WebsiteConfigState => {
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
    default: {
      return state;
    }
  }
};

export const WebsiteConfigContext = createContext<{
  state: WebsiteConfigState;
  dispatch: Dispatch<WebsiteConfigAction>;
}>({
  state: initialWebsiteConfigState,
  dispatch: () => undefined,
});

export interface WebsiteConfigProviderProps {
  children: ReactNode;
}

const WebsiteConfigProvider = ({ children }: WebsiteConfigProviderProps) => {
  const [state, dispatch] = useReducer(
    configReducer,
    initialWebsiteConfigState,
  );

  return (
    <WebsiteConfigContext.Provider
      value={{
        state: state,
        dispatch: dispatch,
      }}
    >
      {children}
    </WebsiteConfigContext.Provider>
  );
};

export const useWebsiteConfig = () => {
  const context = useContext(WebsiteConfigContext);
  if (!context) {
    throw new Error(
      "useWebsiteConfig Hook must be used within the WebsiteConfig Provider",
    );
  }
  return context;
};

export default WebsiteConfigProvider;
