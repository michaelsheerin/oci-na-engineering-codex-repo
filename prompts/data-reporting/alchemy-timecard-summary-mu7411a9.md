# Alchemy Timecard Summary

## Purpose and use case

A way to summarize your hours logged in Alchemy by week and month, and broken down by account.

## Codex skill

- Skill name: `alchemy-timecard-summary`
- Skill description: A way to summarize your hours logged in Alchemy by week and month, and broken down by account.
- Skill file: `skills/alchemy-timecard-summary/SKILL.md`

## Prerequisites

| Prerequisite |
| --- |
| Access to Alchemy and Alchemy Analytics |

## Required inputs

| Required input |
| --- |
| CSV download from Alchemy Analytics -> Time Keeper Details -> Activity Hour Log |

## Expected output and next steps

A dashboard showing your hours logged in Alchemy by week or month and broken down by account.

## Additional Instructions and Post-Run Notes

Open index.html to start

## Prompt text

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

## Contact

- Name: Nicholas Chin
- Email: nicholas.chin@oracle.com

## Source

Submitted directly from the Prompt Library.

## Record details

| Field | Value |
| --- | --- |
| Category | data-reporting |
| Submitted | 2026-09-18 |

<!-- prompt-metadata
title: "Alchemy Timecard Summary"
description: "A way to summarize your hours logged in Alchemy by week and month, and broken down by account."
category: "data-reporting"
tags: []
required_inputs: ["CSV download from Alchemy Analytics -> Time Keeper Details -> Activity Hour Log"]
expected_output: "A dashboard showing your hours logged in Alchemy by week or month and broken down by account."
next_steps: ""
additional_instructions_notes: "Open index.html to start"
additional_instructions_link: ""
skill_name: "alchemy-timecard-summary"
skill_description: "A way to summarize your hours logged in Alchemy by week and month, and broken down by account."
skill_path: "skills/alchemy-timecard-summary/SKILL.md"
prerequisites: ["Access to Alchemy and Alchemy Analytics"]
prerequisite_link: ""
contact_name: "Nicholas Chin"
contact_email: "nicholas.chin@oracle.com"
source_issue: ""
last_reviewed: "2026-09-18"
-->
