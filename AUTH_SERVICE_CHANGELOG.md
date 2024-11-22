## 3.0.0-beta.2 (November 19, 2024)

### Breaking Changes:

- Remove GCP from Environment.kt along with redundant fields.

### New:

- Add the ability to add an invitation request message in SQS so that invitation emails can be sent to the users by email-job.

### Miscellaneous:

- Refactor message string for sending invitation emails through AWS SQS to incorporate latest API changes.
- Refactor Environment.kt by making it more explicit.
- Upgrade Kotlin plugin to v2.0.21 and Ktor plugin to v3.0.1


## 3.0.0-beta.1 (October 30, 2024)

### Fixes:

- Fix an issue in which the wrong RSA Public and Private Key Pair was used for generating Refresh Token.

## 3.0.0-canary.1 (October 25, 2024)

### Breaking Changes:

- Add a service field in Environment.kt for effectively handling service config such as address, port and discovery service address.

### New:

- Add a route for fetching all the accounts with IAM Policies.
- Restrict a critical IAM Policy to be excluded from updating and retrieving from the database for allPolicies routes.
- Add a route for fetching all the IAM Policies.
- Add authorization check before any companion services can access /iam/authorized route and verify if that the user has a specific IAM Role assigned.
- Add the ability to send invitations to users which enables them to create their own account.
- Add InMemoryCache as an extra cache layer along with Distributed Redis Cache for high throughput response.
- Add internal route for other services of the system to verify if the account is authorized to perform specific operation.
- Add caching capabilities to passkeys related invocations.
- Add caching capabilities to accounts related invocations.
- Add support for Redis for caching data.
- Add the ability to prevent operations on endpoint if the account is not present in the associated rule set.
- Add restrictions to the account such as not issuing security tokens or registering passkeys for authentication if the account is suspended.

### Fixes:

- Fix an issue in which Account entity ObjectId serialization.
- Fix an issue in which the principal field was created instead of iamRoles field in AccountWithIAMRoles DTO.
- Fix an issue in which PKC Options and Assertions Data of Passkey stored in Distributed Cache were not getting invalidated after successful authentication.
- Fix an issue in which SocketException with Broken Pipe Message was thrown due to missing implementation of connection closing.
- Fix an issue in which IllegalArgumentException was thrown if the identifier didn't pass through any of the RegexValidators or ObjectId checks.
- Fix an issue in which NullPointer Exception was thrown due to marshaling issue with Jackson and GSON for Passkeys credentials. Also, Fix an issue in which proper authentication strategy was not propagated due to cached values after new account is created.
- Fix an issue in which authentication was not completed with passkeys when their exits both passkeys and password for an account.

### Miscellaneous:

- Refactor updating IAM policies principals from IAM route to Accounts route.
- Refactor Repositories to manage cache instead of Controllers.
- Refactor Cache Service by integrating InMemory Cache in the class itself without creating a separate instance of InMemory Cache.
- Refactor CacheService by using use construct of Kotlin to effectively release the JedisPool resources after the consumption.
- Refactor IAM route to check if an account has a specific IAM Role assigned to perform an operation.
- Refactor UAC to IAM and rewrite IAM Roles for better management across the services.
- Migrate from GSON to Jackson inorder to achieve better marshaling and unmarshalling performance of the entities and DTOs.
- Refactor codebase to use the new Result construct for better communication between the layers.
- Refactor JsonWebToken.
- Refactor Codebase by removing duplicates and repeated codes.

## 2.0.0 (June 4, 2024)

### New:

- Add support for passkeys.
- Passkeys are default Authentication Strategy while authenticating.
- Implement Role Based Access Control (RBAC) to authorize user based on the Account Type.
- Add restrictions to account such as not issuing security tokens or register passkeys for authentication if the account is suspended.
- Add routes to get most secure authentication strategy for an account during authentication.
- Add ability to restrict the creation of new Account if the account requesting do not have authority to create new accounts.

### Fix:

- Fix an issue in which the unauthenticated and unauthorized account was able to register passkeys

### Miscellaneous:

- Rename accounts/signin route to accounts/authenticate
- Rename accounts/signup route to accounts/new for creating new accounts.

## 1.0.0 (May 22, 2024)

Initial Public Release.