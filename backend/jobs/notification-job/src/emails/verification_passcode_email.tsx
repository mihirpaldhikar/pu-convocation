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

import * as React from "react";
import { JSX } from "react";
import {
  Body,
  Button,
  Container,
  Font,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { VerificationPasscodeEmailRequest } from "../dto/index.js";

export default function VerificationPasscodeEmail({
  convocationNumber,
  recipientName,
  passcode,
  passURL,
}: Readonly<VerificationPasscodeEmailRequest>): JSX.Element {
  return (
    <Html lang={"en"}>
      <Font
        fontFamily={"montserrat"}
        fallbackFontFamily={"Helvetica"}
        webFont={{
          url: "https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2",
          format: "woff2",
        }}
        fontStyle={"normal"}
        fontWeight={"500"}
      />
      <Tailwind>
        <Body className={"bg-gray-100 mx-auto my-12"}>
          <Container className={"p-8 rounded-t-xl bg-white flex flex-col"}>
            <Section className={"flex flex-col items-center justify-center"}>
              <Img
                src={
                  "https://assets.puconvocation.com/logos/full_university_logo.png"
                }
                className={"w-full"}
              />
              <Heading className={"text-red-600 text-center font-bold"}>
                {convocationNumber}
                <sup>th</sup> Convocation
              </Heading>
            </Section>
            <Section>
              <Text className={"text-xl font-bold"}>Dear {recipientName},</Text>
            </Section>
            <Section>
              <Text className={"font-normal"}>
                Congratulations on reaching this incredible milestone! Today
                signifies the result of your unwavering dedication,
                perseverance, and countless hours of hard work. As you receive
                your degree today, know that we are immensely proud of the
                achievements you have accomplished throughout these years!
              </Text>
              <Text>
                Please use the code below to complete the verification process
                with your Faculty/Coordinator after scanning the Unique QR Code
                displayed on your profile. Once verified, you will receive your
                degree.
              </Text>
            </Section>
            <Section
              className={
                "flex flex-col items-center justify-center w-full tracking-wider"
              }
            >
              <Text
                className={
                  "text-2xl bg-red-100 w-fit px-5 py-3 rounded-xl text-red-600 font-mono font-bold"
                }
              >
                {passcode}
              </Text>
            </Section>
            <Section
              className={"my-5 flex flex-col items-center justify-center"}
            >
              <Button
                href={passURL}
                className={
                  "bg-yellow-300 text-black font-bold px-5 py-3 rounded-xl"
                }
              >
                View Your Pass
              </Button>
            </Section>
            <Section>
              <Text>
                Your time at Parul University has been nothing short of
                extraordinary. We hope your journey with us has been filled with
                invaluable learning and cherished memories. We will always
                fondly remember the vibrant cultural festivals, thrilling sports
                competitions, and all the other events that you were a part of.
                These moments have not only shaped your academic journey but
                have also enriched our university community.
              </Text>
              <Text>
                As you step into this exciting new phase of life, know that you
                will forever remain an important part of our family. We are
                confident that the knowledge, skills, and values you’ve gained
                here will empower you to make a lasting impact in the world!
              </Text>
              <Text>
                Congratulations once again, graduate! The future is yours to
                shape. Make us proud!
              </Text>
            </Section>
            <Section>
              <Text>Warm regards,</Text>
              <Link
                href={"https://paruluniversity.ac.in"}
                className={"text-red-600 font-bold"}
              >
                Parul University
              </Link>
            </Section>
          </Container>
          <Container
            className={
              "p-8 rounded-b-xl bg-red-50 flex flex-col justify-center items-center w-full"
            }
          >
            <Section className={"text-gray-500"}>
              <Text className={"text-center"}>
                Developed with love by{" "}
                <Link
                  href={"https://mihirpaldhikar.com"}
                  className={"text-red-600 font-bold underline"}
                >
                  Mihir Paldhikar
                </Link>{" "}
                &{" "}
                <Link
                  href={"https://www.linkedin.com/in/suhani-shah-o13"}
                  className={"text-red-600 font-bold underline"}
                >
                  Suhani Shah
                </Link>
              </Text>
              <Text className={"text-center text-xs"}>
                This mail was sent to you because you are going to get your
                degree certificate. This mail contains the verification code
                required for the convocation.
              </Text>
              <Text className={"text-center text-xs"}>
                This mail is machine generated. Please do not reply.
              </Text>
              <Text className={"text-center text-xs"}>
                &copy; {new Date().getFullYear()} Parul University
              </Text>
            </Section>
            <Section>
              <Heading className={"text-6xl text-center opacity-50 font-black"}>
                <span className={"text-red-600"}>Parul</span> University
              </Heading>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
