/*
 * Copyright (c) PU Convocation Management System Authors
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

import Image from "next/image";
import UniversityLogo from "@public/assets/logo.png";

export default function Home() {
    return (
        <section className={"flex min-h-dvh"}>
            <div className="m-auto">
                <div className={"flex flex-col space-y-6 items-center"}>
                    <Image
                        src={UniversityLogo}
                        alt={"Parul University"}
                        priority={true}
                        fetchPriority={"high"}
                        className={"w-44"}
                    />
                    <div className={"flex flex-col items-center space-y-2"}>
                        <h1 className={"font-extrabold text-3xl"}>
                            <span className={"text-red-600"}>Parul</span> University
                        </h1>
                        <h3 className={"font-bold"}>Convocation Management System</h3>
                    </div>
                </div>
            </div>
        </section>
    );
}
