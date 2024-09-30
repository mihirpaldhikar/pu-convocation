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

import {useContext} from "react";
import {RemoteConfigContext} from "@providers/RemoteConfigProvider";

const useRemoteConfig = () => {
  const context = useContext(RemoteConfigContext);
  if (!context) {
    throw new Error(
      "useRemoteConfig Hook must be used within the RemoteConfig Provider",
    );
  }
  return context;
};

export default useRemoteConfig;
