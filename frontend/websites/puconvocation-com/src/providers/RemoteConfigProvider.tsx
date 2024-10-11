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

export type RemoteConfigAction =
  | {
      type: "SET_CONFIG";
      payload: {
        config: RemoteConfig;
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

const defaultRemoteConfig: RemoteConfig = {
  id: "66f43d29e72a9f955579c4ea",
  active: true,
  images: {
    carousel: [
      {
        url: "https://assets.puconvocation.com/images/J8dtdhGcH2wg4T8zkWwZW.avif",
        description: "Parul University",
      },
      {
        url: "https://assets.puconvocation.com/images/rZbzniVmT4N8VWeYtGKUX.avif",
        description: "Parul University",
      },
      {
        url: "https://assets.puconvocation.com/images/x6hPktFnZ2tYzbkpHNg9a.avif",
        description: "Parul University",
      },
      {
        url: "https://assets.puconvocation.com/images/R6ACVfcrf3KKeyaGr9rr2.avif",
        description: "Parul University",
      },
    ],
    hero: {
      url: "https://assets.puconvocation.com/images/4VLYHL9DKhfjpz4ZyMyH7.avif",
      description: "Parul University",
    },
    aboutUs: {
      url: "https://assets.puconvocation.com/images/AGrNHGTqDKr9JVw8LnVJa.avif",
      description: "Parul University",
    },
  },
  instructions: {
    show: false,
    document: "",
  },
  countdown: { show: false, endTime: 0 },
  attendeesLocked: true,
  groundMappings: [],
};

const configReducer = (
  remoteConfig: RemoteConfig = defaultRemoteConfig,
  action: RemoteConfigAction,
): RemoteConfig => {
  switch (action.type) {
    case "SET_CONFIG": {
      return {
        ...action.payload.config,
      };
    }
    case "SET_ENCLOSURE": {
      remoteConfig.groundMappings[action.payload.index] = {
        ...action.payload.enclosure,
      };
      return {
        ...remoteConfig,
      };
    }
    default: {
      return remoteConfig;
    }
  }
};

export const RemoteConfigContext = createContext<{
  remoteConfig: RemoteConfig;
  dispatch: Dispatch<RemoteConfigAction>;
}>({
  remoteConfig: defaultRemoteConfig,
  dispatch: () => undefined,
});

export interface RemoteConfigProviderProps {
  children: ReactNode;
  remoteConfig: RemoteConfig | null;
}

const RemoteConfigProvider = ({
  children,
  remoteConfig,
}: RemoteConfigProviderProps) => {
  const [state, dispatch] = useReducer(
    configReducer,
    remoteConfig ?? defaultRemoteConfig,
  );

  return (
    <RemoteConfigContext.Provider
      value={{
        remoteConfig: state,
        dispatch: dispatch,
      }}
    >
      {children}
    </RemoteConfigContext.Provider>
  );
};

export default RemoteConfigProvider;
