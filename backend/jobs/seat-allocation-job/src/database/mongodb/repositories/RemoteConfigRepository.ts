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

import { RemoteConfigDatasource } from "../datasource/index.js";
import { Enclosure } from "../entities/index.js";
import { Collection } from "mongodb";
import { default as Database } from "../MongoDBConnector.js";

export default class RemoteConfigRepository implements RemoteConfigDatasource {
  private remoteConfigCollection: Collection<any>;

  public constructor() {
    this.remoteConfigCollection = Database.collection<any>("remote_config");
  }

  async getGroundMappings(): Promise<Array<Enclosure>> {
    const systemConfig = await this.remoteConfigCollection.findOne({
      active: true,
    });

    return systemConfig.groundMappings;
  }

  async isAttendeeListLocked(): Promise<boolean> {
    const systemConfig = await this.remoteConfigCollection.findOne({
      active: true,
    });

    return systemConfig.attendees.locked;
  }
}
