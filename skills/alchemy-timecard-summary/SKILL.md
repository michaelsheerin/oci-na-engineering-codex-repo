---
name: alchemy-timecard-summary
description: "A way to summarize your hours logged in Alchemy by week and month, and broken down by account. This prompt will auto-extract your reporter hours from Alchemy Analytics, and provide an in-app dashboard of your hours based on Quarter, Month, Week, Account, etc."
---

# Alchemy Timecard Summary

Use this skill when the user's request matches the skill description. Follow the user's direct instructions when they conflict with this workflow.
## Required input form

When a user invokes this skill without the required CSV, open the embedded required-input form as the first task action.

When one or more declared required inputs are missing, open the embedded required-input form as the first task action.

Before treating `na_engineering_required_input_form.collect_required_inputs` as unavailable, search the complete tool catalog, including deferred MCP tools, for:

- `mcp__na_engineering_required_input_form__collect_required_inputs`
- `collect_required_inputs`
- `required_input_form`

A missing entry from the initially visible tool list does not establish tool unavailability.

If `mcp__na_engineering_required_input_form__collect_required_inputs` exists, invoke it immediately. Do not ask for required inputs in chat first.


If one or more required values are missing, invoke `mcp__na_engineering_required_input_form__collect_required_inputs` immediately with only the entries below that are still missing. Preserve each label and required setting:

```json
{
  "message": "Complete the required inputs before this skill continues.",
  "inputs": [
    {
      "label": "Reporter Name",
      "required": true
    }
  ]
}
```

Use the chat prompt only after a complete deferred-tool search finds no embedded required-input form service.

After that search finds no embedded required-input form service, post this chat prompt for the missing required values. Use the same label names, leave the value blank after each equals sign, and omit entries whose values are already clear:

```text
Inputs:

- Reporter Name =
```

If the form returns unsubmitted, cancelled, or blank required values, do not continue and do not switch to chat collection. State that the embedded form needs submission, then stop.

After a successful form submission or a chat reply with every required value, use those values as the workflow inputs and continue.


## Purpose and use case

A way to summarize your hours logged in Alchemy by week and month, and broken down by account.
This prompt will auto-extract your reporter hours from Alchemy Analytics, and provide an in-app dashboard of your hours based on Quarter, Month, Week, Account, etc.

## Prerequisites

- Access to Alchemy and Alchemy Analytics

Prerequisite link: [Open instructions](https://dtcoac-orasenatdpltinfomgmt03-ia.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fshared%2FNA%20Alchemy%2FAlchemy%20Dashboards)

## Required inputs

- Reporter Name

## Workflow instructions

```text
When the user provides an ECA Name (or Reporter Name) and asks to review Alchemy hours, retrieve the matching Activity Hour Log CSV during the current run, then return an inline interactive dashboard in the conversation.

Use this Alchemy dashboard:
https://dtcoac-orasenatdpltinfomgmt03-ia.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fshared%2FNA%20Alchemy%2FAlchemy%20Dashboards

Download workflow:

1. Navigate to the Alchemy dashboard.
2. Open the Time Keeper Details tab.
3. Set the ECA Name filter to the user-provided name.
4. Click Apply.
5. Open the Menu above Activity Hour Log.
6. Select Export, then CSV.
7. Save the export as the active visual.
8. Process the downloaded CSV during the current run.

Use the existing authenticated browser session. If authentication blocks access, ask the user to complete sign-in before continuing.

If the automated CSV export or download fails:

1. State the failed step.
2. Direct the user to manually open the dashboard link.
3. Tell the user to open Time Keeper Details.
4. Tell the user to filter ECA Name to the requested name and click Apply.
5. Tell the user to open the Activity Hour Log Menu and select Export, then CSV.
6. Tell the user to upload or attach the exported CSV in the conversation.
7. Once the CSV is attached, process it during the current run without attempting another automated download unless the user requests one.

Do not create a separate application, local web server, file-picker workflow, or standalone website unless explicitly requested.

Required CSV columns:
- Customer Name
- Day Submitted, formatted as MM/DD/YYYY
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
- “Latest week” must show total hours in the most recent displayed week and label that week’s date range.
- Do not use the highest-hour week for the Latest week metric.

Default state:
- All customers
- Monthly grouping
- Latest 4 months

Parse and aggregate the downloaded or user-provided CSV during the run. Keep the source file unchanged. If required columns are missing or no usable records remain, clearly explain the issue rather than guessing.

Deliver the dashboard as an inline visualization in the current conversation, followed by a brief plain-language summary of the relevant customer-hours comparison.
```

## Expected output

A dashboard, embedded in Codex, showing your hours logged in Alchemy by week or month and broken down by account.

## Additional Instructions and Post-Run Notes

If Codex fails to export the CSV from Alchemy Analytics, you can manually export and point Codex to the file.

To export Alchemy Activity CSV, navigate to the Time Keeper Details tab, filter for your name under ECA Name, click Apply. 

Then navigate to the Activity Hour log table, click the three dots, and Export as CSV. Save in any target folder.

Related instructions: [Open instructions](https://dtcoac-orasenatdpltinfomgmt03-ia.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fshared%2FNA%20Alchemy%2FAlchemy%20Dashboards)
