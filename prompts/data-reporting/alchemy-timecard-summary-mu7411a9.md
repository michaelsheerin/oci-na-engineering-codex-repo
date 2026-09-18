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
