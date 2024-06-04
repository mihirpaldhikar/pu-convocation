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