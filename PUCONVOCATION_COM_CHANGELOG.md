## 2.0.0 (June 5, 2024)

### New:

- Add support for AVIF image format to optimize images.
- Add Passkey authentication support.
- Create `config.ts` for contents and images for easier management and maintenance.
- Add middleware to check if account is suspended and restrict the access.
- Add Role Based Access control to show options based on privileges of currently authenticated account.
- Add Route to create new account if currently authenticated account has privilege to do so.
- Add ability to register new passkeys for currently authenticated account.

### Fixes:

- Fix an issue in which the hero image was getting stretched on tablet form factor devices.
- Fix an issue in which the website was slowly rendered due to carousel.

### Miscellaneous:

- Rename /auth/signin route to /authenticate
- Upgrade dependencies to latest versions.
- Rename AuthService.signIn method to AuthService.authenticate
- Add AccountType field to comply with latest auth-service API changes.


## 1.0.4 (May 22, 2024)

### New:

- Add Progress bar while the attendee details are being fetched.

### Fixes:

- Fix home page UI by making it a server component instead of client component for better performance and optimization.
- Fix hero image for better accessibility.

### Miscellaneous:

- Change Enclosure Metadata to comply with latest venue changes.
- Refactor Carousel for easier management of the images.

## 1.0.3 (May 22, 2024)

### Fixes:

- Fix an issue in which it was not possible to scroll the seat map with the mouse.
- Fix an issue in which seat map was not getting properly rendered as per the enclosure metadata.

## 1.0.2 (May 22, 2024)

### Fixes:

- Fix Footer.

## 1.0.1 (May 23, 2024)

### New:

- Add sharp for optimising images on the fly in the formats supported by the user-agents.
- Add carousel, about us section in home page.
- Set default background color to off-white for better visibility, readability and to reduce eye strain.

### Fixes:

- Fix an issue in which search was not working if the convocation id is in different case.
- Fix an issue in which the request to check if the user is authenticated to auth-service was called on home page
  instead of auth or console page.
- Fix an issue in which for mobile views, the Ticket component was rendered below the venue map instead on rendering
  above.
- Fix an issue in which scrollbars was overlapping the seats in the Seat Map.
- Fix an issue in which enter from text was showing NONE when no direction was specified.
- Fix an issue in which two navbar were rendering in the console.

## 1.0.0 (May 22, 2024)

Initial Public Release.