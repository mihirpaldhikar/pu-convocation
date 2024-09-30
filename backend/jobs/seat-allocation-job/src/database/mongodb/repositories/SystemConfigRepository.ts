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

import {SystemConfigDatasource} from "../datasource/index.js";
import {Enclosure} from "../entities/index.js";
import {Collection} from "mongodb";
import {default as Database} from "../MongoDBConnector.js";

export default class SystemConfigRepository implements SystemConfigDatasource {
  private systemConfigCollection: Collection<any>;

  public constructor() {
    this.systemConfigCollection = Database.collection<any>("website_configs");
  }

  async enclosureMapping(): Promise<Array<Enclosure>> {
    const systemConfig = await this.systemConfigCollection.find().toArray();

    if (systemConfig.length == 0) {
      return [];
    }
    return systemConfig[0].enclosureMapping;
  }
}
