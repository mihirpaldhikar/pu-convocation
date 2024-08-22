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

import { JSX } from "react";
import Link from "next/link";
import { Logo } from "@components/ui";

interface NavbarProps {
  hidden: boolean;
}

export default function Navbar({ hidden }: NavbarProps): JSX.Element {
  return (
    <header
      className={`${
        hidden ? "hidden" : "flex"
      } fixed z-50 h-20 w-full items-center justify-between border-b border-b-gray-300 bg-white/70 px-16 backdrop-blur-3xl`}
    >
      <div className="flex items-center">
        <Link href={"/"}>
          <Logo />
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link href={"/login"}>
          <button className="flex items-center rounded-2xl bg-black px-4 py-2 text-white">
            <span className="mr-2">Login</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 33 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24.7259 25.7469C23.7652 24.4748 22.5222 23.4432 21.0948 22.7334C19.6675 22.0235 18.0948 21.6548 16.5007 21.6563C14.9066 21.6548 13.3339 22.0235 11.9066 22.7334C10.4792 23.4432 9.23621 24.4748 8.27544 25.7469M24.7259 25.7469C26.6008 24.0793 27.923 21.8811 28.5198 19.444C29.1167 17.0069 28.9585 14.4459 28.0665 12.1007C27.1744 9.75545 25.5904 7.73682 23.5247 6.31249C21.459 4.88816 19.0092 4.12541 16.5 4.12541C13.9908 4.12541 11.541 4.88816 9.47527 6.31249C7.40957 7.73682 5.82564 9.75545 4.93355 12.1007C4.04146 14.4459 3.88335 17.0069 4.48019 19.444C5.07703 21.8811 6.40063 24.0793 8.27544 25.7469M24.7259 25.7469C22.4627 27.7656 19.5334 28.8793 16.5007 28.875C13.4675 28.8797 10.539 27.7659 8.27544 25.7469M20.6257 13.4063C20.6257 14.5003 20.1911 15.5495 19.4175 16.3231C18.6439 17.0967 17.5947 17.5313 16.5007 17.5313C15.4067 17.5313 14.3575 17.0967 13.5839 16.3231C12.8103 15.5495 12.3757 14.5003 12.3757 13.4063C12.3757 12.3122 12.8103 11.263 13.5839 10.4894C14.3575 9.71585 15.4067 9.28126 16.5007 9.28126C17.5947 9.28126 18.6439 9.71585 19.4175 10.4894C20.1911 11.263 20.6257 12.3122 20.6257 13.4063Z"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </Link>
      </div>
    </header>
  );
}
