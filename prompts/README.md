# Prompt and Skill Library

Each workflow form submission creates a readable prompt record and a paired Codex skill file. No review or manual publishing step is required.

[Browse with search and filters](https://michaelsheerin.github.io/oci-strategic-install-codex-repo/) · [Submit a workflow](https://oci-strategic-install-prompt-library.msheerin01.workers.dev/?view=submit) · [Browse skill files](../skills/) · Use GitHub repository search with `path:prompts` or `path:skills` to find workflows.

This library contains 5 workflow records.

## Customer Preparation

| Workflow | Codex skill | Use case | Contact |
| --- | --- | --- | --- |
| [Test](./customer-preparation/test-mthgbfn3.md) | [$test](../skills/test/SKILL.md) | test | Michael Sheerin |

## Data Reporting

| Workflow | Codex skill | Use case | Contact |
| --- | --- | --- | --- |
| [Codex C4PO MCP Server Setup](./data-reporting/codex-c4po-mcp-server-setup-mtlqxl90.md) | [$codex-c4po-mcp-server-setup](../skills/codex-c4po-mcp-server-setup/SKILL.md) | ### NOT A PROMPT Follow Confluence page instructions to access C4PO MCP Server to enable Codex to query direct APIs https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=20005791874 | Michael Sheerin |
| [CPQ Rate Card Reconciliation based on Gold-Standard-Rate-Card](./data-reporting/prompt-2.md) | [$cpq-rate-card-reconciliation-based-on-gold-standard-rate-card](../skills/cpq-rate-card-reconciliation-based-on-gold-standard-rate-card/SKILL.md) | This prompt reconciles a newly generated CPQ rate card against the approved local Gold Standard Rate Card created in Prompt 'Generate Gold Standard Rate Card for CPQ Reconciliation'. This provides a repeatable validation process for future | Michael Sheerin |
| [Generate a Weekly Dedicated-Pool Capacity Report](./data-reporting/dedicated-pool-capacity-report.md) | [$generate-a-weekly-dedicated-pool-capacity-report](../skills/generate-a-weekly-dedicated-pool-capacity-report/SKILL.md) | Use this prompt to create a current weekly capacity report for a dedicated pool across selected regions and availability domains. It queries live Compute Admin inventory, validates Global-AD and Tenant-AD mappings from authoritative metadat | Michael Sheerin |
| [Generate Gold Standard Rate Card for CPQ Reconciliation](./data-reporting/prompt-1.md) | [$generate-gold-standard-rate-card-for-cpq-reconciliation](../skills/generate-gold-standard-rate-card-for-cpq-reconciliation/SKILL.md) | This prompt establishes a local Gold Standard Rate Card from a previously validated CPQ quote. This approved CPQ baseline creates a consistent reference point for reconciliation analysis of future CPQ quotes. The prompt also compares the p | Michael Sheerin |
