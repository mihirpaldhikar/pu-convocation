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
- Fix an issue in which SocketException with Broken Pipe Message was thrown due to missing implementation of connection closing.
- Fix Enclosure Typo in entities and DTO.

### Miscellaneous:

- Refactor AuthService.kt to use Service Discovery for finding out the address and port of service dynamically.
- Refactor WebsiteConfig to RemoteConfig and add the ability to release new config without affecting the old one.
- Refactor WebsiteConfig inorder to comply with the latest changes to Enclosure Mappings.
- Refactor Repositories to manage cache instead of controllers.
- Refactor AuthService to comply with the latest IAM policy changes.
- Migrate from GSON to Jackson inorder to achieve better marshaling and unmarshalling performance of the entities and DTOs.
- Refactor codebase to use the new Result construct for better communication between the layers.