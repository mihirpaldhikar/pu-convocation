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
import {JSX} from "react";
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
    Text
} from "@react-email/components";

export default function VerificationPasscodeEmail(): JSX.Element {
    return (
        <Html lang={"en"}>
            <Font fontFamily={"montserrat"} fallbackFontFamily={"Helvetica"}
                  webFont={{
                      url: "https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2",
                      format: "woff2"
                  }}
                  fontStyle={"normal"}
                  fontWeight={"500"}
            />
            <Tailwind>
                <Body className={"bg-gray-100 mx-auto my-12"}>
                    <Container className={"p-8 rounded-t-xl bg-white flex flex-col"}>
                        <Section className={"flex flex-col items-center justify-center"}>
                            <Img src={"https://assets.puconvocation.com/logos/full_university_logo.png"}
                                 className={"w-full"}/>
                            <Heading className={"text-red-600 text-center font-bold"}>
                                {"{{convocationNumber}}"}<sup>th</sup> Convocation
                            </Heading>
                        </Section>
                        <Section>
                            <Text className={"text-xl font-bold"}>
                                Hello {"{{studentName}}"}!
                            </Text>
                        </Section>
                        <Section>
                            <Text className={"font-normal"}>
                                Congratulations on your remarkable achievement! Today marks the culmination of years
                                of
                                hard
                                work, dedication, and unwavering perseverance. As you walk across the stage and
                                receive
                                your
                                degree, know that Parul University beams with pride.
                            </Text>
                            <Text>
                                Below is the verification code that you will need to share with your
                                Faculty/Coordinator
                                after scanning your
                                Unique QR Code displayed on your Profile after which you will receive your Degree.
                            </Text>
                        </Section>
                        <Section className={"flex flex-col items-center justify-center w-full tracking-wider"}>
                            <Text
                                className={"text-2xl bg-red-100 w-fit px-5 py-3 rounded-xl text-red-600 font-mono font-bold"}>
                                {"{{verificationCode}}"}
                            </Text>
                        </Section>
                        <Section className={"my-5 flex flex-col items-center justify-center"}>
                            <Button href={`{{passURL}}`}
                                    className={"bg-yellow-300 text-black font-bold px-5 py-3 rounded-xl"}>
                                View Your Pass
                            </Button>
                        </Section>
                        <Section>
                            <Text>
                                We've watched you grow, evolve, and blossom into the extraordinary individual you
                                are
                                today. From late-night study
                                sessions in the library to lively debates in classrooms, your journey has been
                                filled
                                with unforgettable memories.
                                We'll cherish the grand events that brought us all together - the vibrant cultural
                                festivals, the exhilarating
                                sports competitions, and the thought-provoking conferences.
                            </Text>
                            <Text>
                                Parul University will miss your infectious energy, your inquisitive spirit, and your
                                passion for learning. But as
                                you embark on this exciting new chapter, remember that you'll always be a part of
                                our
                                family. Go forth and conquer
                                the world, knowing that you carry with you the knowledge, skills, and values
                                instilled
                                in you during your time
                                here.
                            </Text>
                            <Text>
                                Congratulations once again, graduate! The future is yours to shape. Make us proud!
                            </Text>
                        </Section>
                        <Section>
                            <Text>
                                With warmest regards,
                            </Text>
                            <Link href={"https://paruluniversity.ac.in"} className={"text-red-600 font-bold"}>
                                Parul University
                            </Link>
                        </Section>
                    </Container>
                    <Container
                        className={"p-8 rounded-b-xl bg-red-50 flex flex-col justify-center items-center w-full"}>
                        <Section className={"text-gray-500"}>
                            <Text className={"text-center"}>
                                Developed with love by {" "}
                                <Link
                                    href={"https://mihirpaldhikar.com"}
                                    className={"text-red-600 font-bold underline"}>
                                    Mihir Paldhikar
                                </Link> {" "}
                                & {" "}
                                <Link
                                    href={"https://www.linkedin.com/in/suhani-shah-o13"}
                                    className={"text-red-600 font-bold underline"}>
                                    Suhani Shah
                                </Link> {" "}
                                for our seniors.
                            </Text>
                            <Text className={"text-center text-xs"}>
                                This mail was sent to you because you are going to get your degree certificate. This
                                mail contains the verification
                                code required for the convocation.
                            </Text>
                            <Text className={"text-center text-xs"}>
                                This mail is machine generated. Please do not reply.
                            </Text>
                            <Text className={"text-center text-xs"}>
                                &copy; {"{{year}}"} Parul University
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