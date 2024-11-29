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