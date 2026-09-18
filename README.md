# NA Engineering Codex Prompt Library

A shared library of proven Codex prompts and reusable skills for RAs supporting NA Engineering work.

The library turns effective individual workflows into reusable team assets. Each form submission creates a reader-friendly prompt record and a paired `SKILL.md` file for Codex. The goal is faster, more consistent work without losing the context required for sound judgment.

## Start here

- [Browse prompts](https://michaelsheerin.github.io/oci-na-engineering-codex-repo/)
- [Submit a prompt](https://oci-na-engineering-prompt-library.msheerin01.workers.dev/?view=submit)
- [Read the contribution guide](CONTRIBUTING.md)
- [Use the prompt record template](prompts/_template.md)

## How to use this repository

1. Search the library by skill name, use case, category, or tag.
2. Open the workflow record and confirm its prerequisites and required inputs fit your task.
3. Copy the prompt for a one-time run, or download `SKILL.md` for continued Codex use.
4. Review the result, complete the listed follow-up steps, and improve the record when you find a better approach.

## How the library is organized

Each prompt record is a standalone Markdown file in `prompts/<category>/`. Each paired skill lives in `skills/<skill-name>/SKILL.md`. This keeps the content readable in GitHub, gives every workflow a permanent link, and preserves revision history.

The public Browse prompts page supports full-text search, category filters, creator filters, sorting, and category counts. GitHub-native browsing uses the category folders, prompt record links, and GitHub code search. Submitters do not need to edit an index or understand the folder structure.

| Location | Purpose |
| --- | --- |
| `prompts/` | Versioned prompt records |
| `skills/` | Downloadable `SKILL.md` files for Codex |
| `prompts/_template.md` | Standard record format for direct pull requests |
| `docs/` | Searchable GitHub Pages catalog |
| `scripts/` | Catalog generation and content validation |

## Sharing standard

Share prompts that are reusable, specific, and safe for colleagues to adopt. Before you submit, remove customer data, credentials, internal identifiers, personal information, and non-public content. Describe required inputs without pasting sensitive examples. No review or manual publishing step occurs after submission.

Workflow records retain the details supplied in the form:

1. Title
2. Detailed use case and purpose
3. Skill name and activation description
4. Prerequisites and prerequisite link
5. Prompt text and required inputs
6. Expected output, constraints, and follow-up steps
7. Contributor name and email

See [CONTRIBUTING.md](CONTRIBUTING.md) for submission guidance.
