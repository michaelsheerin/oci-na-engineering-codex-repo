---
name: codex-c4po-mcp-server-setup
description: "### THIS IS NOT A PROMPT Follow Confluence page instructions to access C4PO MCP Server to enable Codex to query direct APIs https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=20005791874"
---

# Codex C4PO MCP Server Setup

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
      "label": "When authenticating - authenticate with ocna-saml (yubikey)",
      "required": true
    }
  ]
}
```

Use the chat prompt only after a complete deferred-tool search finds no embedded required-input form service.


After that search finds no embedded required-input form service, post this chat prompt for the missing required values. Use the same label names, leave the value blank after each equals sign, and omit entries whose values are already clear:

```text
Inputs:

- When authenticating - authenticate with ocna-saml (yubikey) =
```

If the form returns unsubmitted, cancelled, or blank required values, do not continue and do not switch to chat collection. State that the embedded form needs submission, then stop.

After a successful form submission or a chat reply with every required value, use those values as the workflow inputs and continue.


## Prerequisites

- See Confluence for prerequisites
- Note: Windows does not require brew installation

Prerequisite link: https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=20005791874

## Required inputs

- When authenticating - authenticate with ocna-saml (yubikey)

## Workflow instructions

```text
https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=20005791874
```

## Expected output

Codex able to query Compute Admin MCP server

## Additional Instructions and Post-Run Notes

Compute Admin MCP sessions can time out after about one hour and require authentication refresh. Use the matching recovery path below before sending the next Compute Admin request.

### A. Current Compute Admin task already worked

1. Stay in the same task.
2. Send the next request.
3. Do not wait or start a new task.

### B. New task in any project

1. Click the pencil icon to create a new project task.
2. Wait for the blank “What should we work on?” page.
3. Start a two-minute timer.
4. Do not type, send a message, navigate away, or close Codex during the two-minute wait.
5. After two full minutes, send the Compute Admin request as the first message.

### C. Codex was closed, or a new day has started

1. Open PowerShell.
2. Run:

```powershell
oci session refresh --profile "bmc_operator_access" --auth security_token
oci session validate --profile "bmc_operator_access" --auth security_token
```

3. If validation succeeds, open Codex.
4. Open the required project.
5. Click the pencil icon to create a new task.
6. On the blank task page, wait two full minutes.
7. Send the Compute Admin request.

### D. Validation fails

1. Run:

```powershell
oci session authenticate --tenancy-name "bmc_operator_access" --profile-name "bmc_operator_access" --auth security_token --region us-phoenix-1
```

2. Complete the OCNA-SAML browser sign-in.
3. Wait for PowerShell to return to its prompt.
4. Fully close Codex.
5. Reopen Codex.
6. Open the required project.
7. Click the pencil icon to create a new task.
8. Wait two full minutes on the blank task page.
9. Send the Compute Admin request.
