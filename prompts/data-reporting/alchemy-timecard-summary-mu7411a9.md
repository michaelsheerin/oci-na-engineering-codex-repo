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

Prerequisite link: [Open instructions](https://dtcoac-orasenatdpltinfomgmt03-ia.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fshared%2FNA%20Alchemy%2FAlchemy%20Dashboards)

## Required inputs

| Required input |
| --- |
| CSV download from Alchemy Analytics (Time Keeper Details -> Filter your name -> Export Activity Hour Log) |

## Expected output and next steps

A dashboard showing your hours logged in Alchemy by week or month and broken down by account.

## Additional Instructions and Post-Run Notes

To export Alchemy Activity CSV, navigate to the Time Keeper Details tab, filter for your name under ECA Name, click Apply. 

Then navigate to the Activity Hour log table, click the three dots, and Export as CSV. Save in any target folder.

Related instructions: [Open instructions](https://dtcoac-orasenatdpltinfomgmt03-ia.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fshared%2FNA%20Alchemy%2FAlchemy%20Dashboards)

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
required_inputs: ["CSV download from Alchemy Analytics (Time Keeper Details -> Filter your name -> Export Activity Hour Log)"]
expected_output: "A dashboard showing your hours logged in Alchemy by week or month and broken down by account."
next_steps: ""
additional_instructions_notes: "To export Alchemy Activity CSV, navigate to the Time Keeper Details tab, filter for your name under ECA Name, click Apply. \n\nThen navigate to the Activity Hour log table, click the three dots, and Export as CSV. Save in any target folder."
additional_instructions_link: "https://dtcoac-orasenatdpltinfomgmt03-ia.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fshared%2FNA%20Alchemy%2FAlchemy%20Dashboards"
skill_name: "alchemy-timecard-summary"
skill_description: "A way to summarize your hours logged in Alchemy by week and month, and broken down by account."
skill_path: "skills/alchemy-timecard-summary/SKILL.md"
prerequisites: ["Access to Alchemy and Alchemy Analytics"]
prerequisite_link: "https://dtcoac-orasenatdpltinfomgmt03-ia.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fshared%2FNA%20Alchemy%2FAlchemy%20Dashboards"
contact_name: "Nicholas Chin"
contact_email: "nicholas.chin@oracle.com"
source_issue: ""
last_reviewed: "2026-09-18"
-->
