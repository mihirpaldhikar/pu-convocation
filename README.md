![Parul University](https://assets.puconvocation.com/logos/banner.svg)

A highly scalable system to manage everything related to convocation at a university campus.

The system uses cutting-edge technologies like Passkeys for Authentication.
An In-House developed IAM solution for Authorization, Robust Seat Allocations Algorithms, which automatically assigns
seats based on the availability and taking into factors such as reserved spots.

## Tech Stack

- **Ktor**: A Kotlin framework for creating Microservices and RESTful APIs
- **Next.js**: For a website and management system.
- **MongoDB**: A highly scalable NoSQL database for datastore.
- **Redis**: For distributing cache across the services making it blazing fast to retrieve data without querying the
  database.
- **AWS ECS**: A fully managed container orchestration service that helps you to more efficiently deploy, manage, and
  scale containerized applications
- **AWS CloudFront**: A Globally distributed CDN with Edge for delivering static assets such as images, JS files, CSS,
  and Fonts.
- **AWS Lambda**: A serverless compute for managing tasks such as running Seat Allocation Algorithm, Sending Emails
  on-demand.
- **AWS SQS**: A message queue that allows services to send messages between each and offload tasks to AWS Lambda.
- **AWS SES**: For sending Emails to the users.
- **Apache Kafka**: A Scalable message broker for streaming telemetry data which is processed and converted to
  Analytical Data.

## Runtime and SDKs

- Node.js `v22.x`
- Amazon Corretto `v22`

## Recommendations

- Use of [**IntelliJ IDEA Ultimate**](https://www.jetbrains.com/idea) is recommended for Ktor.
- For Website development, [Visual Studio Code](https://code.visualstudio.com)
  or [**IntelliJ IDEA Ultimate**](https://www.jetbrains.com/idea) (recommended IDE) can be used.

## Authors

- [**Mihir Paldhikar**](https://mihirpaldhikar.com) - System Architect, Project Lead, and Manager
- [**Suhani Shah**](https://github.com/Suhani-013) - Frontend Lead

## License

The software is covered by Proprietary License. Please see the license [here](./LICENSE.md).

#### Copyright © PU Convocation Management System Authors
