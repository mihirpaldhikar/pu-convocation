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
import archiver, { ArchiverOptions } from "archiver";

archiver.registerFormat("zip-encrypted", require("archiver-zip-encrypted"));

export async function createZippedBufferWithPassword(
  data: string,
  filename: string,
  password: string,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const archive = archiver.create("zip-encrypted", {
      zlib: { level: 5 },
      encryptionMethod: "aes256",
      password,
    } as unknown as ArchiverOptions);
    const buffers: Buffer[] = [];

    archive.on("data", (buffer: Buffer) => buffers.push(buffer));
    archive.on("end", () => resolve(Buffer.concat(buffers)));
    archive.on("error", (err: Error) => reject(err));

    archive.append(data, { name: filename });
    archive.finalize();
  });
}
