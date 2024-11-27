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

import {Enclosure} from "../database/index.js";

export function totalEnclosureSeats(enclosure: Enclosure): number {
    let seats = 0;
    for (let row of enclosure.rows) {
        const reserved = row.reserved.split(",").filter((r) => !isNaN(parseInt(r))).length;
        seats += row.end - row.start - reserved + 1;
    }
    return seats;
}
