# Codex C4PO MCP Server Setup

## Purpose and use case

### THIS IS NOT A PROMPT

Follow Confluence page instructions to access C4PO MCP Server to enable Codex to query direct APIs

https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=20005791874

## Codex skill

- Skill name: `codex-c4po-mcp-server-setup`
- Skill description: ### THIS IS NOT A PROMPT Follow Confluence page instructions to access C4PO MCP Server to enable Codex to query direct APIs https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=20005791874
- Skill file: `skills/codex-c4po-mcp-server-setup/SKILL.md`

## Prerequisites

| Prerequisite |
| --- |
| See Confluence for prerequisites |
| Note: Windows does not require brew installation |

Prerequisite link: [Open instructions](https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=20005791874)

## Required inputs

| Required input |
| --- |
| When authenticating - authenticate with ocna-saml (yubikey) |

## Expected output and next steps

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

## Prompt text

```text
https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=20005791874
```

## Contact

- Name: Michael Sheerin
- Email: michael.sheerin@oracle.com

## Source

Submitted directly from the Prompt Library.

## Record details

| Field | Value |
| --- | --- |
| Category | data-reporting |
| Submitted | 2026-09-18 |

<!-- prompt-metadata
title: "Codex C4PO MCP Server Setup"
description: "### THIS IS NOT A PROMPT Follow Confluence page instructions to access C4PO MCP Server to enable Codex to query direct APIs https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=20005791874"
category: "data-reporting"
tags: []
required_inputs: ["When authenticating - authenticate with ocna-saml (yubikey)"]
expected_output: "Codex able to query Compute Admin MCP server"
next_steps: ""
additional_instructions_notes: "Compute Admin MCP sessions can time out after about one hour and require authentication refresh. Use the matching recovery path below before sending the next Compute Admin request.\n\n### A. Current Compute Admin task already worked\n\n1. Stay in the same task.\n2. Send the next request.\n3. Do not wait or start a new task.\n\n### B. New task in any project\n\n1. Click the pencil icon to create a new project task.\n2. Wait for the blank “What should we work on?” page.\n3. Start a two-minute timer.\n4. Do not type, send a message, navigate away, or close Codex during the two-minute wait.\n5. After two full minutes, send the Compute Admin request as the first message.\n\n### C. Codex was closed, or a new day has started\n\n1. Open PowerShell.\n2. Run:\n\n```powershell\noci session refresh --profile \"bmc_operator_access\" --auth security_token\noci session validate --profile \"bmc_operator_access\" --auth security_token\n```\n\n3. If validation succeeds, open Codex.\n4. Open the required project.\n5. Click the pencil icon to create a new task.\n6. On the blank task page, wait two full minutes.\n7. Send the Compute Admin request.\n\n### D. Validation fails\n\n1. Run:\n\n```powershell\noci session authenticate --tenancy-name \"bmc_operator_access\" --profile-name \"bmc_operator_access\" --auth security_token --region us-phoenix-1\n```\n\n2. Complete the OCNA-SAML browser sign-in.\n3. Wait for PowerShell to return to its prompt.\n4. Fully close Codex.\n5. Reopen Codex.\n6. Open the required project.\n7. Click the pencil icon to create a new task.\n8. Wait two full minutes on the blank task page.\n9. Send the Compute Admin request."
additional_instructions_link: ""
skill_name: "codex-c4po-mcp-server-setup"
skill_description: "### THIS IS NOT A PROMPT Follow Confluence page instructions to access C4PO MCP Server to enable Codex to query direct APIs https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=20005791874"
skill_path: "skills/codex-c4po-mcp-server-setup/SKILL.md"
prerequisites: ["See Confluence for prerequisites","Note: Windows does not require brew installation"]
prerequisite_link: "https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=20005791874"
contact_name: "Michael Sheerin"
contact_email: "michael.sheerin@oracle.com"
source_issue: ""
last_reviewed: "2026-09-18"
-->
