# Contributing a Codex prompt

## Preferred submission method

Use the [Prompt Library submission page](https://oci-na-engineering-prompt-library.msheerin01.workers.dev/?view=submit). Sign in with GitHub, complete the workflow fields, then publish the prompt record with either a generated Codex skill or an uploaded skill package.

Every submission automatically creates a reader-friendly prompt record in [Browse prompts](https://michaelsheerin.github.io/oci-na-engineering-codex-repo/) and either a `skills/<skill-name>/SKILL.md` file or `skill-packages/<skill-name>.zip`, with no review, Issue, or manual publishing step.

## Direct pull request option

Experienced contributors can copy [prompts/_template.md](prompts/_template.md), save it as `prompts/<category>/<short-descriptive-name>.md`, and choose one delivery path. For generated skills, run `node scripts/build-skills.mjs --write` and commit `skills/<skill-name>/SKILL.md`. For packages, commit `skill-packages/<skill-name>.zip` with `skill_delivery: "package"` metadata. Do not edit the catalog manually. The catalog build script reads prompt metadata and validates both delivery paths.

## Submission requirements

Provide the details that help another RA understand and reuse the workflow. Title, Codex skill name, Codex skill description, and one skill delivery source are required. Choose prompt text for a generated skill, or a ZIP package that already includes `SKILL.md`. The remaining fields are optional but make the workflow safer and easier to continue.

| Field | What to include |
| --- | --- |
| Title | A short, action-oriented workflow name |
| Codex skill name | A stable lowercase, hyphen-separated name such as `capacity-analysis` |
| Codex skill description | A concise statement of when Codex should select the skill. This is required. |
| Workflow delivery | Generated `SKILL.md` from prompt text, or an uploaded ZIP package. |
| Use case and purpose | When to use the prompt, the problem it solves, and any limits |
| Prerequisites | Work, access, files, or decisions required before the workflow. Add a link when instructions live elsewhere. |
| Prompt text | The complete reusable workflow, with placeholders for variable values. Required for generated skills. |
| Skill package ZIP | Required for package delivery. It must contain one top-level `<skill-name>/` folder with `<skill-name>/SKILL.md`, plus any scripts, references, or assets. |
| Required inputs | Each input a user needs before running the prompt. Write `None` when no input is required. |
| Expected output | What Codex should produce and how to check it |
| Additional Instructions and Post-Run Notes | Follow-up work, publishing steps, validation checks, edge cases, and an optional link to related instructions |
| Contact | Your name and work email for questions or improvement requests |

## Content standards

- Use placeholders such as `[customer name]`, `[file path]`, and `[reporting period]`.
- State assumptions, constraints, and required validation steps.
- Write prompts that another RA can run without a separate briefing.
- Link to relevant internal documentation when context is necessary.
- Test the prompt before submission.
- Long-form fields preserve plain text and support Markdown headings, bullets, bold text, and links. Pasted web links render as clickable links.
- A skill package must be no larger than 10 MB, contain no more than 100 files or 25 MB after extraction, and use only stored or deflated ZIP entries. Its `SKILL.md` must include the embedded required-input-form rules validated by the repository.

## Do not submit

- Customer data, credentials, tokens, passwords, or private URLs.
- Personal data beyond the contributor contact information requested by the form.
- Proprietary content or source material.
- Prompts whose use depends on unstated access, background knowledge, or manual cleanup.

## Automatic sharing process

1. A contributor signs in with GitHub and submits the form.
2. The service creates or updates a Markdown record in `prompts/<category>/` and either a Codex skill in `skills/<skill-name>/SKILL.md` or a package in `skill-packages/<skill-name>.zip`.
3. The Browse prompts page regenerates automatically.
4. Contributors with repository write access can also add or improve Markdown records through pull requests.

## Updating an existing prompt

Open the record in Browse prompts and select **Edit this workflow**. Explain what changed, why it changed, and how you tested the revised workflow. The Markdown record and its selected skill delivery update together. Package records allow an optional ZIP replacement.
