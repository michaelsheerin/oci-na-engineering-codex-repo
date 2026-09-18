---
name: codex-c4po-mcp-server-setup
description: "### THIS IS NOT A PROMPT Follow Confluence page instructions to access C4PO MCP Server to enable Codex to query direct APIs https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=20005791874"
---

# Codex C4PO MCP Server Setup

Use this skill when the user's request matches the skill description. Follow the user's direct instructions when they conflict with this workflow.

## Required input form

Before executing this workflow, check whether every required input below already has a clear value in the user's request or the current conversation.

If one or more required values are missing and `strategic_install_required_input_form.collect_required_inputs` is available, call it once with only the entries below that are still missing. Preserve each label and required setting:

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

If the form tool is unavailable, ask the user for each missing required value in chat. Use the same label names and leave the value blank after each equals sign. Omit entries whose values are already clear:

```text
Inputs:

- When authenticating - authenticate with ocna-saml (yubikey) =
```

Tell the user the form or chat prompt collects the values needed for this workflow. After a successful form submission or a chat reply with every required value, use those values as the workflow inputs and continue. If the user cancels, declines, or leaves a required value blank, do not execute the workflow. Explain which value is still needed.

## Purpose and use case

### THIS IS NOT A PROMPT

Follow Confluence page instructions to access C4PO MCP Server to enable Codex to query direct APIs

https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=20005791874

## Prerequisites

- See Confluence for prerequisites
- Note: Windows does not require brew installation

Prerequisite link: [Open instructions](https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=20005791874)

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
