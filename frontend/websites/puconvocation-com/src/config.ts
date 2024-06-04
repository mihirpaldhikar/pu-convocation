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

export const Config: {
  heroTitle: string;
  aboutUs: string;
  whoWeAre: string;
  carouselImages: Array<{
    url: string;
    alt: string;
  }>;
  credits: Array<{
    name: string;
    credits: Array<{
      name: string;
      link: string;
      bold: boolean;
      underline: boolean;
    }>;
  }>;
} = {
  heroTitle: "PU",
  aboutUs:
    "A multidisciplinary destination of learning and innovation,\n" +
    "                propelling quality in higher education with a record of being\n" +
    "                India’s youngest private university to receive NAAC A++\n" +
    "                accreditation in the first cycle. Situated in Vadodara, Gujarat,\n" +
    "                Parul University, is an embodiment of the nation&apos;s essence\n" +
    "                of cultural heritage blended with modern innovations and\n" +
    "                academic practices for student enrichment, while fostering\n" +
    "                national and global development.",
  whoWeAre:
    "Parul University - Gujarat’s leading private university having the\n" +
    "            foundation of its first Institution laid in 1993 as Parul Group of\n" +
    "            Institutes, and later established and incorporated as Parul\n" +
    "            University in 2015 under the Gujarat Private Universities (Second\n" +
    "            Amendment ) Act of 2009.",
  carouselImages: [
    {
      url: "https://assets.puconvocation.com/images/carousel/1.avif",
      alt: "Parul University Convocation",
    },
    {
      url: "https://assets.puconvocation.com/images/carousel/2.avif",
      alt: "Parul University Convocation",
    },
    {
      url: "https://assets.puconvocation.com/images/carousel/3.avif",
      alt: "Parul University Convocation",
    },
    {
      url: "https://assets.puconvocation.com/images/carousel/4.avif",
      alt: "Parul University Convocation",
    },
  ],
  credits: [
    {
      name: "Developed By",
      credits: [
        {
          name: "Mihir Paldhikar",
          link: "https://mihirpaldhikar.com",
          bold: true,
          underline: true,
        },
        {
          name: "Suhani Shah",
          link: "https://www.linkedin.com/in/suhani-shah-o13",
          bold: true,
          underline: true,
        },
      ],
    },
    {
      name: "Coordinated By",
      credits: [
        {
          name: "Prof. Mohit Rathod",
          link: "https://www.linkedin.com/in/er-mohit-68a447a0",
          bold: false,
          underline: false,
        },
        {
          name: "Manish Rahevar",
          link: "https://www.linkedin.com/in/manish-rahevar-b08a87108",
          bold: false,
          underline: false,
        },
      ],
    },
    {
      name: "Guided By",
      credits: [
        {
          name: "Dr. Swapnil M Parikh",
          link: "https://www.linkedin.com/in/dr-swapnil-parikh-43a90715",
          bold: false,
          underline: false,
        },
        {
          name: "Prof. Sumitra Menaria",
          link: "https://www.linkedin.com/in/sumitra-menaria-0bab23123",
          bold: false,
          underline: false,
        },
      ],
    },
  ],
};
