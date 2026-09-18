---
name: alchemy-timecard-summary
description: "A way to summarize your hours logged in Alchemy by week and month, and broken down by account."
---

# Alchemy Timecard Summary

Use this skill when the user's request matches the skill description. Follow the user's direct instructions when they conflict with this workflow.

## Required input form

Before executing this workflow, check whether every required input below already has a clear value in the user's request or the current conversation.

If one or more required values are missing and `na_engineering_required_input_form.collect_required_inputs` is available, call it once with only the entries below that are still missing. Preserve each label and required setting:

```json
{
  "message": "Complete the required inputs before this skill continues.",
  "inputs": [
    {
      "label": "CSV download from Alchemy Analytics (Time Keeper Details -> Filter your name -> Export Activity Hour Log)",
      "required": true
    }
  ]
}
```

If the form tool is unavailable, ask the user for each missing required value in chat. Use the same label names and leave the value blank after each equals sign. Omit entries whose values are already clear:

```text
Inputs:

- CSV download from Alchemy Analytics (Time Keeper Details -> Filter your name -> Export Activity Hour Log) =
```

Tell the user the form or chat prompt collects the values needed for this workflow. After a successful form submission or a chat reply with every required value, use those values as the workflow inputs and continue. If the user cancels, declines, or leaves a required value blank, do not execute the workflow. Explain which value is still needed.

## Purpose and use case

A way to summarize your hours logged in Alchemy by week and month, and broken down by account.

## Prerequisites

- Access to Alchemy and Alchemy Analytics

Prerequisite link: [Open instructions](https://dtcoac-orasenatdpltinfomgmt03-ia.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fshared%2FNA%20Alchemy%2FAlchemy%20Dashboards)

## Required inputs

- CSV download from Alchemy Analytics (Time Keeper Details -> Filter your name -> Export Activity Hour Log)

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
- Summary metrics for total hours and number of customers shown
- One stacked bar chart showing hours by customer across the selected periods

Daily view requirements:
- Label each day with its weekday and date, such as `Mon, Aug 18`.
- Include the weekday in hover labels and accessible descriptions.

Time-sensitive summary metric:
- In daily and monthly views, show the largest selected period and its hours.
- In weekly view, replace “Largest period” with “Latest week.”
- “Latest week” must show the total hours in the most recent displayed week and label that week’s date range. Do not use the highest-hour week for this metric.

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

To export Alchemy Activity CSV, navigate to the Time Keeper Details tab, filter for your name under ECA Name, click Apply. 

Then navigate to the Activity Hour log table, click the three dots, and Export as CSV. Save in any target folder.

Related instructions: [Open instructions](https://dtcoac-orasenatdpltinfomgmt03-ia.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fshared%2FNA%20Alchemy%2FAlchemy%20Dashboards)
