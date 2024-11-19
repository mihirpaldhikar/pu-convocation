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

import {TransactionDatasource} from "../datasource/index.js";
import {Transaction} from "../entities/index.js";
import {default as Database} from "../MongoDBConnector.js";
import {Collection, ObjectId} from "mongodb";
import {endOfDay, formatISO} from "date-fns";
import {TransactionRequest} from "../../dto/index.js";

export default class TransactionRepository implements TransactionDatasource {
  private transactionCollection: Collection<Transaction>;

  public constructor() {
    this.transactionCollection =
      Database.collection<Transaction>("transactions");
  }

  async createTransaction(
    transactionRequest: TransactionRequest,
  ): Promise<string | null> {
    const transactionId = new ObjectId();
    const { acknowledged } = await this.transactionCollection.insertOne({
      _id: transactionId,
      studentEnrollmentNumber: transactionRequest.enrollmentNumber,
      authorizedBy: transactionRequest.authorizedBy,
      createdAt: formatISO(endOfDay(new Date())),
    });

    if (!acknowledged) {
      return null;
    }

    return transactionId.toString();
  }

  async transactionExists(
    enrollmentNumber: string,
  ): Promise<Transaction | null> {
    return await this.transactionCollection.findOne({
      studentEnrollmentNumber: enrollmentNumber,
    });
  }
}
