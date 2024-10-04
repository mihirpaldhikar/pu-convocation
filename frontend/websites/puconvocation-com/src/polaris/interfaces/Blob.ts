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

import type Block from "./BlockSchema";

/**
 * @interface Blob
 *
 * @description Blob is a collection of blocks in the semantic manner. A Blob contains all the information required by the Polaris to create rich content editing experience.
 */

interface Blob {
  id: string;
  name?: string;
  description?: string;
  author?: string;
  blocks: Block[];
}

export default Blob;
