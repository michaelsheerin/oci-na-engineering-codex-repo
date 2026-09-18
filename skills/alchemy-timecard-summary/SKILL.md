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
When the user provides an Alchemy CSV export and asks to review hours, process the supplied file during the current run and return an inline interactive dashboard in the conversation.

Do not create a separate application, local web server, file-picker workflow, or standalone website unless explicitly requested.

Required CSV columns:
- Customer Name
- Day Submitted (`MM/DD/YYYY`)
- Hours

Optional:
- Activity, for contextual breakdowns if useful.

Build one responsive dashboard with:
- Customer filter: all customers or one customer
- Time grouping: daily, weekly, or monthly
- Visible range:
  - Daily: latest 7 days, latest 14 days, or all periods
  - Weekly: latest 4 weeks, latest 8 weeks, or all periods
  - Monthly: latest 4 months, latest 8 months, or all periods
- Summary metrics for total hours, number of customers shown, and largest selected period
- One stacked bar chart showing hours by customer across the selected periods

Default state:
- All customers
- Monthly grouping
- Latest 4 months

Parse and aggregate the CSV during the run. Keep the source file unchanged. If required columns are missing or no usable records remain, clearly explain the issue rather than guessing.

Deliver the dashboard as an inline visualization in the current conversation, followed by a brief plain-language summary of the relevant customer-hours comparison.
```

## Expected output

A dashboard showing your hours logged in Alchemy by week or month and broken down by account.

## Additional Instructions and Post-Run Notes

Open index.html to start
