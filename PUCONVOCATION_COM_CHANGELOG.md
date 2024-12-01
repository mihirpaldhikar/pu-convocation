## 3.0.0-rc.4 (December 2, 2024)

### New:
- Add the ability to send telemetry for analytics.

## 3.0.0-rc.3 (December 2, 2024)

### Fixes:
- Fix an issue in which the new row created in ground mapper form was not following the database entity structure.

### Miscellaneous:
- Refactor computation of the next row letter in ground mapper form.

## 3.0.0-rc.2 (December 1, 2024)

### New:
- Implement an aerial view feature in the Attendee Console, allowing authenticated users to visualize the seating arrangement from a top-down perspective.
- Add the ability to highlight reserved seats in Seat Map, along with legends specifying the difference.

## 3.0.0-rc.1 (December 1, 2024)

#### This is Release Candidate 1

### Fixes:
- Fix an issue in which router was missing as a dependency in the dependency array of CountDown layout.

### Miscellaneous:
- Refactor Date Picker UI in the general settings page, which is responsible for managing countdown.
- Refactor RemoteConfig Provider to efficiently and automatically sync changes with the database, thus streamlining AutoSave of the settings.
- Upgrade pnpm to v9.14.4

## 3.0.0-beta.15 (November 30, 2024)

### New:
- Add the ability to download attendee data in csv file format from the console if the user is authorized.

## 3.0.0-beta.14 (November 28, 2024)

### New:
- Add IAM Checks to the general settings page.
- Add form Validations and IAM checks to the ground settings page.
- Implement Navigation to Landing Page from Console NavBar.
- Add the ability to update system settings.
- Add required credits in the footer.

### Fixes:
- Fix an issue in which the redirection after successful authentication was not working as expected.

### Miscellaneous:
- Refactor the attendee page layout to render a ground map more prominently.
- Refactor the countdown component to use the date-fns library to compute remaining time.

## 3.0.0-beta.13 (November 28, 2024)

### Breaking Changes:
- Refactor IAM Related operations to comply with latest changes made in auth-service which streamlines the Access Management.

### New:
- Add IAM checks to Image Picker to check if user is authorized to upload images.
- Add IAM checks to the Account Manager page to render contents and add restrictions based on authorization.
- Add IAM checks to the Attendee Control-plane.
- Add validations in the account invitations form.

## 3.0.0-beta.12 (November 28, 2024)

### Miscellaneous:

- The DynamicIcon component was removed to reduce the overall bundle size.
- Refactor the Dialog component to comply with the design system.
- Refactor console home page and analytics page to be rendered on a client instead of server rendered inorder to improve
  performance.

## 3.0.0-beta.11 (November 27, 2024)

### New:

- Static assets are now served by CloudFront CDN instead of being served by the next.js server.
- Disable powered by header to be sent with the response.
- The seat map is now automatically scrolled to a target seat instead of manually scrolling the row.
- Add the ability to upload a CSV file and parse it to fill an account invitation form.
- Implement a button to remove an entry from account invitations form.
- Add Link to university logo in authentication and account creation forms to navigate back home.
- Add sanity checks for IAM Policies when a CSV file is uploaded to the Account Invitations form.
- The Designation field is now optional while creating an account.

### Fixes:

- Fix color contrast for copyright notice in authenticate route.
- Fix an issue in which the seat map was auto scrolling even when the target seat is viewport.
- Fix an issue in which the Attendee Table was not following sitting arrangement hierarchy.

### Miscellaneous:

- Remove shadow from the checkbox.
- Remove shadow from the select component.
- Refactor component structure hierarchy of Account Manager Page.
- Move Account Manager page from /accountmanager route to /account/manager route.
- Rename Invitation From to AccountCreation From.
- Improve UI consistency and visual hierarchy for the settings pages.
- Temporarily remove instruction tab in settings.
- Refactor Attendee Control-plane UI to match with the design system.

## 3.0.0-beta.9 (November 26, 2024)

### Miscellaneous:

- Refactor Seat Map to be rendered in ascending order instead of descending order. Also Refactor UI for active row.

## 3.0.0-beta.8 (November 23, 2024)

### Fixes:

- Fix an issue in which the sendInvitation method of AuthController.ts was calling the wrong API endpoint URL.

## 3.0.0-beta.7 (November 23, 2024)

### New:

- Add an Account Manager page for managing existing accounts and send invitations for new accounts.

### Miscellaneous:

- Remove unnecessary type checks and validations for Response DTO.
- Improve layout sizes for a better UI.

## 3.0.0-beta.6 (November 19, 2024)

### New:

- Prevent rendering of Attendee Upload Option if the attendees are locked.
- Add the ability to upload images in the Image Picker dialog.

### Fixes:

- Fix an issue in which an exception was thrown due to id being null in Interactive Ground Mapper.

### Miscellaneous:

- Refactor Image Picker into a separate component.

## 3.0.0-beta.5 (November 18, 2024)

### New:

- Add the ability to upload attendee data in CSV file format.

## 3.0.0-beta.4 (November 18, 2024)

### New:

- Disable default Next.js Image optimization because images are now well optimized by AWS Cloudfront.
- Ground Map is now rendered dynamically by fetching details remotely from the CDN.
- Add a route to check the health of the website.
- Add a GroundMapper component to interact with the ground map inorder to view or update rows and seats.
- Add Ground Map forms for updating the details such as rows, seats associated with an enclosure on the ground.

### Fixes:

- Remove subtle shadow in input component.

### Miscellaneous:

- Refactor console home page by moving AnalyticsSection and AttendeeSection components outside the default function
  inorder to prevent re-rendering if state inside the default function changes.
- Remove unnecessary providers from the default path module.

## 3.0.0-beta.3 (November 7, 2024)

### New:

- Upgrade to Next.js v15.0.3 and React v19.0.0-rc-66855b96-20241106

### Miscellaneous:

- Add eslint-plugin-jsx-a11y to add linting support for accessibility issues.
- Add React Compiler ESLint Plugin for linting errors associated with React best practices.
- Remove deprecated APIs and replace it with new APIs provided by next-intl.

## 3.0.0-beta.2 (November 6, 2024)

### Fixes:

- Fix an issue in which there was a missing Webauthn API Compatibility Validation in
  Authentication. - [Issue #10](https://github.com/mihirpaldhikar/pu-convocation/issues/10)

### Miscellaneous:

- Reduce build output size by minimizing the overhead associated with barrel imports.

## 3.0.0-beta.1 (November 2, 2024)

### New:

- Set Node.js 22 LTS as the required runtime version.

### Fix:

- Fix an issue in which the instruction page was not rendered with proper typography.
- Fix an issue in which the authentication was not aborted when passkey checks were interrupted by the user.

## 3.0.0-canary.2 (October 29, 2024)

### Fix:

- Fix an issue in which the "TypeError: Response.clone: Body has already been consumed." was thrown due to issue with
  Undici module bundled with Node.js v20+. Until the error is fixed, the Node.js v18 will be used.

## 3.0.0-canary.1 (October 25, 2024)

### Breaking Changes:

- Add support for pnpm package manager. In future releases, the npm support will be removed

### New:

- Upgrade to Next.js 15 and React 19.
- Add the ability to redirect to the error page whenever the webapp cannot connect to the services due to network error.
- Console Sidebar now retains the collapsed state even if the page is refreshed.
- Add initialAttendees props in AttendeeTable so that the data fetched from the server components can be passed as
  initial value, thus resulting in a faster rendering of the contents in the table.
- Add the ability to use thumbnail images while the browser is loading the actual image.
- Add a dedicated route for generating thumbnails for the images instead of generating it when requests arrive to load
  pages.
- Add the ability to show blurred image while the browser is loading the actual image, enhancing the user experience.
- Add a dialog to view all the details of the selected attendee.
- Add the ability to search and dynamically render a list of matched attendees
- Add a method in AuthController.ts for fetching IAM Policies.
- Add AssetsController for managing all the assets used by the system.
- Add Instructions page to dynamically render a Markdown file which contains instructions.
- Add Instructions Banner.
- Add methods to manage the creation of accounts from invitations.
- Add Weekly and Popular countries' analytics.
- Add a Daily traffic analytics chart.
- Add restriction on accessing pages if required iam roles are not associated with currently logged in an account.
- Add Responsive console layout for desktop and mobile devices.
- Add Traffic on specific date analytics.
- Add ability to redirect user to target page after successful authentication.
- Add the ability to switch between supported languages.
- Add Internationalization (i18n) Support to the website. The Default language is English (US).
- Add the ability to remotely change the content of the pages with dynamics-service.
- Add a custom carousel component for images as the react-responsive-carouse library was causing performance issues and
  was not customizable, according to project needs.
- Add Loading indicators for Console Home Page and Navbar Menu for better User Experience.
- Add a scan page for scanning QR Code of the attendee.
- Add QR Code with a new UI to verify and validate attendance and degree certificate transaction.
- Add the ability to register new passkeys for a currently authenticated account.
- Merge Invitations Page into Authenticate Page. The appropriate forms are now dynamically rendered based on URL
  schemes.

### Fixes:

- Fix an issue in which the Instructions were not rendered on the instruction page due to conflict between
  RemoteMarkdown and React 19.
- Fix an issue in which the charts were not rendering due to BREAKING-CHANGES made in Next.js 15 and React 19.
- Fix an issue in which the locale param was deprecated in the latest version on next-intl.
- Fix an issue in which the height of the placeholder of the carousel was more than that of the image.
- Fix an issue in which the Docker build process was throwing ENV warnings.
- Fix an issue in which the carousel images were overlapping each other.
- Fix an issue in which the carousel container was missing the minimum height.
- Fix an issue in which the bottom navigation bar of the console layout was not having a proper z-index.
- Fix an issue in which the middleware did not properly set the new cookies issued by auth-service when
  authorization-token expires and refresh-token is still valid.
- Fix an issue in which the scrollbars were overlapping with the seat map.
- Fix an issue in which the content of the console was rendered behind the bottom navigation bar for mobile view.
- Fix an issue in which the searchAttendee method was called multiple times while the user is still typing.
- Fix invalid title for Authentication Root Layout.
- Fix background color contrast issue for Side Navbar and Bottom Navbar layouts of the console.

### Miscellaneous:

- Refactor Console Home Page to dynamically importing components based on IAM permissions, thus reducing the Bundle
  Size.
- Remove unnecessary initial account fetch while authenticating.
- Refactor the next.config file to use TypeScript instead of Modular JS.
- Refactor codebase to use an asynchronous way to access cookies inorder to comply with BREAKING-CHANGES made in Next.js
    15.
- Refactor params and searchParams in props interfaces to use Promises inorder to comply with BREAKING-CHANGES made by
  next.js 15 for accessing params and searchParams.
- Refactor middleware.ts to cache the account details, thus reducing api calls to the auth-service.
- Refactor middleware.ts to cache the account details, thus reducing api calls to the auth-service.
- Refactor GeographicalMap to fetch map details from CDN instead of directly bundling map data within the codebase. This
  will make the codebase lighter and easier to manager.
- Refactor TrafficOnDateChart and WeeklyTrafficChart to render data provided by their parents.
- Refactor Console Home and Analytics page to be rendered on server. Also, a Popular Countries component is now RSC
- Refactor Console Attendee Page to be a Server Rendered.
- Remove text content such as title and description from the AttendeeTable component.
- Refactor imports for the AttendeeTable component to use a Barrel files scheme.
- Refactor the AttendeeTable component to use the totalAttendeeCount prop to figure out pagination.
- Refactor system_font.ts from root to dedicated fonts' directory.
- Refactor fonts used by the layouts into a dedicated system_font.ts for easier management of the fonts across the
  codebase.
- Refactor Providers are to use data provided by Server Components instead of fetching data on the Client.
- Refactor components directory for easy management of the components.
- Refactor middleware to use regex for protected route path matching.
- Merge console layouts for desktop and mobile into single console layout manager.
- Refactor RemoteConfig DTO inorder to comply with the latest API changes in dynamics-service.
- Refactor Landing Page to Server Component instead of Client Component for faster rendering of the content.
- Remove unnecessary states in Authentication From and add status indicator while authenticating for better user
  experience.
- Refactor WebsiteConfig to RemoteConfig inorder to comply with the latest API changes.
- Refactor QR Code Scanner page to use Sheets inorder to show attendee details instead of redirecting to a new page for
  verification.
- Refactor HttpService methods to use an option object for configuring the http parameters.
- Refactor Account and AuthService to comply with the latest IAM changes.

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