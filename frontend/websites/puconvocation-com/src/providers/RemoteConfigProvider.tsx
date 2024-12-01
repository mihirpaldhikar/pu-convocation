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
import cloneDeep from "clone-deep";
import { RemoteConfigController } from "@controllers/index";

const remoteConfigController = new RemoteConfigController();

export type RemoteConfigAction =
  | {
      type: "SET_INITIAL_CONFIG";
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
        enclosure: Enclosure;
      };
    }
  | {
      type:
        | "TOGGLE_INSTRUCTIONS_BANNER_VISIBILITY"
        | "TOGGLE_COUNTDOWN_VISIBILITY";
      payload: {
        show: boolean;
      };
    }
  | {
      type: "SET_HERO_IMAGE";
      payload: {
        imageURL: string;
      };
    }
  | {
      type: "CAROUSEL_IMAGE";
      payload: {
        operation: "ADD" | "REMOVE";
        imageURL: string;
      };
    }
  | {
      type: "SET_COUNTDOWN_END_TIME";
      payload: {
        endTime: number;
      };
    }
  | {
      type: "TOGGLE_ATTENDEE_LOCK";
      payload: {
        locked: boolean;
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
  attendees: {
    locked: true,
    updatedAt: "",
    csvFile: "",
  },
  groundMappings: [],
};

const configReducer = (
  remoteConfig: RemoteConfig = defaultRemoteConfig,
  action: RemoteConfigAction,
): RemoteConfig => {
  const newConfig = cloneDeep(remoteConfig, true);

  switch (action.type) {
    case "SET_INITIAL_CONFIG": {
      return newConfig;
    }
    case "SET_ENCLOSURE": {
      const index = newConfig.groundMappings.indexOf(
        newConfig.groundMappings.filter(
          (e) => e.letter === action.payload.enclosure.letter,
        )[0],
      );
      if (index !== -1) {
        newConfig.groundMappings[index] = action.payload.enclosure;
        remoteConfigController
          .changeRemoteConfig({
            type: "groundMappings",
            groundMappings: newConfig.groundMappings,
          })
          .then();
        return newConfig;
      }
      return remoteConfig;
    }
    case "TOGGLE_INSTRUCTIONS_BANNER_VISIBILITY": {
      newConfig.instructions.show = action.payload.show;
      remoteConfigController
        .changeRemoteConfig({
          type: "toggleInstructions",
          showInstructions: newConfig.instructions.show,
        })
        .then();
      return newConfig;
    }
    case "TOGGLE_COUNTDOWN_VISIBILITY": {
      newConfig.countdown.show = action.payload.show;
      remoteConfigController
        .changeRemoteConfig({
          type: "countdown",
          countdown: newConfig.countdown,
        })
        .then();
      return newConfig;
    }
    case "TOGGLE_ATTENDEE_LOCK": {
      newConfig.attendees.locked = action.payload.locked;
      return newConfig;
    }
    case "CAROUSEL_IMAGE": {
      if (
        newConfig.images.carousel.filter(
          (i) => i.url === action.payload.imageURL,
        ).length === 0 &&
        action.payload.operation === "ADD"
      ) {
        newConfig.images.carousel.push({
          url: action.payload.imageURL,
          description: "Image",
        });
        remoteConfigController
          .changeRemoteConfig({
            type: "images",
            images: newConfig.images,
          })
          .then();
      } else if (action.payload.operation === "REMOVE") {
        newConfig.images.carousel = newConfig.images.carousel.filter(
          (i) => i.url !== action.payload.imageURL,
        );
        remoteConfigController
          .changeRemoteConfig({
            type: "images",
            images: newConfig.images,
          })
          .then();
      }
      return newConfig;
    }
    case "SET_HERO_IMAGE": {
      newConfig.images.hero.url = action.payload.imageURL;
      remoteConfigController
        .changeRemoteConfig({
          type: "images",
          images: newConfig.images,
        })
        .then();
      return newConfig;
    }
    case "SET_COUNTDOWN_END_TIME": {
      newConfig.countdown.endTime = action.payload.endTime;
      remoteConfigController
        .changeRemoteConfig({
          type: "countdown",
          countdown: newConfig.countdown,
        })
        .then();
      return newConfig;
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
