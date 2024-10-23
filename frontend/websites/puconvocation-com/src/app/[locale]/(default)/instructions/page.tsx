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

import Markdown from "react-markdown";

export default async function InstructionsPage() {
  const response = await fetch(
    "https://assets.puconvocation.com/documents/instructions.md",
  );
  return (
    <div className={"min-h-screen w-full p-5 lg:p-10"}>
      <Markdown className={"prose prose-h1:text-red-800"}>
        {await response.text()}
      </Markdown>
    </div>
  );
}
