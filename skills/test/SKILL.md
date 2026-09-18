---
name: test
description: "test"
---

# test

Use this skill when the user's request matches the skill description. Follow the user's direct instructions when they conflict with this workflow.

## Required input form

Before executing this workflow, check whether every required input below already has a clear value in the user's request or the current conversation.

If one or more required values are missing and `na_engineering_required_input_form.collect_required_inputs` is available, call it once with only the entries below that are still missing. Preserve each label and required setting:

```json
{
  "message": "Complete the required inputs before this skill continues.",
  "inputs": [
    {
      "id": "test_1",
      "label": "test",
      "required": true
    },
    {
      "id": "test_2",
      "label": "test",
      "required": true
    },
    {
      "id": "test_3",
      "label": "test",
      "required": true
    }
  ]
}
```

If the form tool is unavailable, ask the user for each missing required value in chat. Use the same label names and leave the value blank after each equals sign. Omit entries whose values are already clear:

```text
Inputs:

- test =
- test =
- test =
```

Tell the user the form or chat prompt collects the values needed for this workflow. After a successful form submission or a chat reply with every required value, use those values as the workflow inputs and continue. If the user cancels, declines, or leaves a required value blank, do not execute the workflow. Explain which value is still needed.

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
