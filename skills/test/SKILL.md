---
name: test
description: "test"
---

# test

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
      "label": "test",
      "required": true
    },
    {
      "label": "test",
      "required": true
    },
    {
      "label": "test",
      "required": true
    }
  ]
}
```

Use the chat prompt only after a complete deferred-tool search finds no embedded required-input form service.


After that search finds no embedded required-input form service, post this chat prompt for the missing required values. Use the same label names, leave the value blank after each equals sign, and omit entries whose values are already clear:

```text
Inputs:

- test =
- test =
- test =
```

If the form returns unsubmitted, cancelled, or blank required values, do not continue and do not switch to chat collection. State that the embedded form needs submission, then stop.

After a successful form submission or a chat reply with every required value, use those values as the workflow inputs and continue.


## Prerequisites

- test
- test

## Required inputs

- test
- test
- test

## Workflow instructions

```text
test123
```

## Expected output

test

## Additional Instructions and Post-Run Notes

test
