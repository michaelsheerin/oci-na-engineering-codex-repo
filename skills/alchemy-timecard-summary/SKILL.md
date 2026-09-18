---
name: alchemy-timecard-summary
description: "A way to summarize your hours logged in Alchemy by week and month, and broken down by account."
---

# Alchemy Timecard Summary

Use this skill when the user's request matches the skill description. Follow the user's direct instructions when they conflict with this workflow. Before running the workflow, confirm that every Required input has a value. If a value is missing, ask the user for it before continuing. Users may provide values as `- Input name = value`.

## Purpose and use case

A way to summarize your hours logged in Alchemy by week and month, and broken down by account.

## Prerequisites

- Access to Alchemy and Alchemy Analytics

## Required inputs

- CSV download from Alchemy Analytics -> Time Keeper Details -> Activity Hour Log

## Workflow instructions

```text
Create a local, standalone “Customer Hours Dashboard” from Alchemy CSV exports.
Requirements:
- Package it as files that can be opened locally without a server or installation.
- Include an index.html with all required HTML, CSS, and JavaScript, plus a short README.
- Let the user choose a CSV file from their computer with a file picker; process it entirely locally, with no upload.
- Expect CSV columns: Customer Name, Day Submitted (MM/DD/YYYY), and Hours.
- Show:
  - Total logged hours
  - Number of customers shown
  - Largest time period by hours
  - A stacked bar chart of hours by customer
- Provide controls for:
  - All customers or one selected customer
  - Monthly or weekly grouping
  - Latest 4 periods, latest 8 periods, or all periods
- Default to monthly and latest 4 months; update the range labels to “weeks” when Weekly is selected.
- Make it responsive, readable, and accessible. Use a simple professional dashboard style with chart hover labels for customer, period, and hours.
- Include clear validation messages when the CSV lacks required columns or has no usable rows.
```

## Expected output

A dashboard showing your hours logged in Alchemy by week or month and broken down by account.

## Additional Instructions and Post-Run Notes

Open index.html to start
