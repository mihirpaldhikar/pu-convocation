## 1.0.0-rc.3 (December 2, 2024)

### Fixes:
- Fix an issue in which the URL for authorization checks with auth-service was having a typo.


## 1.0.0-rc.2 (December 1, 2024)

### New:
- Add a route to fetch all the attendees in an enclosure.

## 1.0.0-rc.1 (December 1, 2024)

#### This is Release Candidate 1

### Fixes:
- Fix an issue in which the RemoteConfig entity was not in-sync with the latest changes made with API calls.

## 1.0.0-beta.10 (November 30, 2024)

### Breaking Changes:
- Rename Email Queue to Notification Queue inorder to send notifications through multiple channels instead of only sending emails.

### New:
- Upgrade to Kotlin version 2.1.0

## 1.0.0-beta.9 (November 30, 2024)

### Miscellaneous:
- Add csvFile field in RemoteConfig.Attendee entity to comply with latest Database model changes.

## 1.0.0-beta.8 (November 28, 2024)

### Breaking Changes:
- Refactor IAM related operations to comply with latest changes made in auth-service.

## 1.0.0-beta.7 (November 28, 2024)

### Fixes:

- Fix an issue in which AWS S3 sdk was closing connection.

## 1.0.0-beta.6 (November 27, 2024)

### Miscellaneous:

- Rename lambda invocation of seat-allocation-job to attendee-job to comply with the latest project changes.

## 1.0.0-beta.4 (November 26, 2024)

### Miscellaneous:

- Remove redundant environmental variables from Environment.kt

## 1.0.0-beta.3 (November 23, 2024)

### New:

- Seats are now allocated after attendee data is uploaded instead of allocating seats when data is locked.
- Upgrade to JDK v22 for building docker container image.

### Miscellaneous:

- Refactor AttendeeController.uploadAttendees method to check file extension with Apache FilenameUtils.
- Add suspended property in AccountWithIAMRoles.kt

## 1.0.0-beta.2 (November 19, 2024)

### New:

- Transaction Requests are now added to AWS SQS and processed by Lambda functions for higher throughput.

### Fixes:

- Fix an issue in which cache was not being invalidated after an object for uploaded to S3 bucket.

## 1.0.0-beta.1 (November 18, 2024)

### Breaking Changes:

- Migrate from Google Cloud Storage to AWS S3. Also, remove GCP from Environment.kt along with redundant fields.
- Update the attendee field in RemoteConfig entity to use timestamps for preventing unlocking of the lists before 3 days
  from when it was locked.

### Fixes:

- Fix the multipart deprecation warning in AttendeeController.uploadAttendees method.
- Fix an issue in which a negation check was missing for an offline flag in Kafka Service.

### Miscellaneous:

- Refactor KafkaService.kt to skip initialization of kafka brokers if the offline flag is set.

## 1.0.0-canary.1 (October 25, 2024)

> [!IMPORTANT]
> Attendee Service and Analytics Service have been merged into Dynamics Service.

### New:

- Add the ability to generate a thumbnail image when a new image gets uploaded.
- Add a search route for attendee, enabling fuzzy searching attendee based on the names.
- Add Routes for uploading instructions source file.
- Add Routes for view and uploading assets.
- Add Kafka for streaming raw data, which will be further refined to create analytical data.
- Add InMemoryCache as an extra cache layer along with Distributed Redis Cache for high throughput response.
- Add Enclosure Mapping in Website Config.
- Add routes to fetch and update website configurations dynamically from the console.

### Fixes:

- Fix an issue in which the reserved file of Row DTO in RemoteConfig.kt was missing.
- Fix remote host address in telemetry.
- Add Service Authorization to comply with the latest API changes in auth-service.
- Fix an issue in which Pagination for Attendees List was not working as expected.
- Fix missing Jackson Annotations for marshaling in ChangeRemoteConfigRequest.kt
- Fix an issue in which SocketException with Broken Pipe Message was thrown due to missing implementation of connection
  closing.
- Fix Enclosure Typo in entities and DTO.

### Miscellaneous:

- Refactor AuthService.kt to use Service Discovery for finding out the address and port of service dynamically.
- Refactor WebsiteConfig to RemoteConfig and add the ability to release new config without affecting the old one.
- Refactor WebsiteConfig inorder to comply with the latest changes to Enclosure Mappings.
- Refactor Repositories to manage cache instead of controllers.
- Refactor AuthService to comply with the latest IAM policy changes.
- Migrate from GSON to Jackson inorder to achieve better marshaling and unmarshalling performance of the entities and
  DTOs.
- Refactor codebase to use the new Result construct for better communication between the layers.