## 2.4.0 (December 3, 2024)

### New:
- Verification Passcode emails are skipped for attendees whose primary key has "DUPLICATE" or "NO-ENR" strings in them.

## 2.3.0 (November 30, 2024)

### Miscellaneous:
- Rename Environmental Variable for SQS Queue for sending notifications.
- Upgrade pnpm to v9.14.4

## 2.2.0 (November 30, 2024)

### New:
- Add the ability to encrypt attendee data saved as CSV format with AES256 encryption standard.

### Fixes:
- Fix an issue in which the zip-encryption was not use ES6+ imports scheme.

### Miscellaneous:
- Refactor creating zip logic into a separate function inorder to support TypeScript.

## 2.1.0 (November 29, 2024)

### New:
- Add the ability to generate a CSV file for attendee data and upload it to assets.puconvocation.com
- Add the ability to update attendee csv file URL in remote-config.

### Fixes:
- Fix an issue in which the seat allocation was not being terminated if total attendees left were 0.

## 2.0.0 (November 27, 2024)

> [!IMPORTANT]
> seat-allocation-job has been renamed to attendee-job.

### New:

- Implement functionality to send passcode emails when attendee data is locked. If attendee data is not locked, proceed
  with seat allocation.

---

## 1.0.1 (November 25, 2024)

### Fixes:

- Fix an issue in which the seats were not allocated with respect to the reserved seats.

---

## 1.0.0 (November 25, 2024)

Initial Release.