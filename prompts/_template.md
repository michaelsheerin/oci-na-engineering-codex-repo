# [Action-oriented prompt title]

## Purpose and use case

Describe the problem this workflow solves, the intended audience, and when Codex should select the paired skill.

## Codex skill

- Skill name: `[lowercase-hyphenated-name]`
- Skill description: `[State when Codex should use this workflow and the result it should produce.]`
- Delivery: `generated` or `package`
- Generated skill file: `skills/[lowercase-hyphenated-name]/SKILL.md`
- Package file, when using package delivery: `skill-packages/[lowercase-hyphenated-name].zip`

## Prerequisites

List any work, access, files, or decisions required before the workflow begins. Enter `None` when no prerequisite exists.

Prerequisite instructions: [Optional link to the prerequisite prompt, runbook, or documentation.]

## Required inputs

- [Input one]
- [Input two]

## Expected output and next steps

State what Codex should return. Explain how to validate the result and what action should follow.

## Additional Instructions and Pre-Run Notes

Add context, constraints, pre-run setup, validation guidance, edge cases, follow-up work, or other notes that help someone use this workflow.

Related instructions: [Optional link to a prompt, runbook, or documentation.]

## Prompt text

```text
[Paste the full reusable prompt here. Use placeholders such as [customer name], [time period], and [file path].]
```

For package delivery, replace the generated-skill metadata with the package metadata. Commit `skill-packages/[lowercase-hyphenated-name].zip`, leave `skill_path` empty, and include exactly one top-level `[lowercase-hyphenated-name]/SKILL.md` file in the ZIP. The repository validates the ZIP contents and required embedded input-form rules.

## Contact

- Name: [Contributor name]
- Email: [work email]

## Source

[Link to an issue, pull request, or supporting documentation.]

## Record details

| Field | Value |
| --- | --- |
| Category | [analysis, customer-preparation, data-reporting, project-management, research, technical-work, or writing-communication] |
| Last reviewed | YYYY-MM-DD |

<!-- prompt-metadata
title: "[Action-oriented prompt title]"
description: "[One-sentence summary of the use case and intended value.]"
category: "[analysis | customer-preparation | data-reporting | project-management | research | technical-work | writing-communication]"
tags: ["[tag-one]", "[tag-two]"]
required_inputs:
  - "[Input one]"
  - "[Input two, or None]"
expected_output: "[What Codex should produce.]"
next_steps: "[How the user should review or act on the output.]"
additional_instructions_notes: "[Optional context, constraints, pre-run guidance, follow-up work, or usage guidance.]"
additional_instructions_link: ""
skill_name: "[lowercase-hyphenated-name]"
skill_description: "[State exactly when Codex should use this workflow.]"
skill_delivery: "generated"
skill_path: "skills/[lowercase-hyphenated-name]/SKILL.md"
skill_package_path: ""
skill_package_name: ""
skill_package_size: 0
skill_package_sha256: ""
skill_package_contents: []
prerequisites: "[Prerequisite work, access, or None.]"
prerequisite_link: ""
contact_name: "[Contributor name]"
contact_email: "[work email]"
last_reviewed: "YYYY-MM-DD"
-->
