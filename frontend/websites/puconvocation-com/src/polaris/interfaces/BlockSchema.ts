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

import type Style from "./Style";

export interface BlockSchema {
  id: string;
  style: Style[];
  role: any;
  data: any;
}

/**
 * @type BlockSchema
 *
 * @description BlockSchema is the smallest unit of document which contains all the information required by the parser to render DOM Node.
 *
 * @author Mihir Paldhikar
 */

export default BlockSchema;
