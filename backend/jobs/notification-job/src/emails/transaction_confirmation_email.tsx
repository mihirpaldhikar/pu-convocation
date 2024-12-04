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
import { TransactionConfirmationEmailRequest } from "../dto/NotificationRequest.js";

export default function TransactionConfirmationEmail({
  recipientName,
  transactionId,
}: Readonly<TransactionConfirmationEmailRequest>): JSX.Element {
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
                Degree Confirmation
              </Heading>
            </Section>
            <Section>
              <Text className={"text-xl font-bold"}>Dear {recipientName},</Text>
            </Section>
            <Section>
              <Text className={"font-normal"}>
                Congratulations! You have been successfully awarded the degree!
              </Text>
              <Text className={"font-normal"}>
                To view the transaction, just click on the button below.
              </Text>
            </Section>
            <Section
              className={"my-5 flex flex-col items-center justify-center"}
            >
              <Button
                href={`https://puconvocation.com/en/transaction?id=${transactionId}`}
                className={
                  "bg-yellow-300 text-black font-bold px-5 py-3 rounded-xl"
                }
              >
                View Transaction
              </Button>
            </Section>
            <Section>
              <Text>Kind regards,</Text>
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
                This mail was sent to you as a confirmation that you have
                received your degree.
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
