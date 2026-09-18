import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parsePrompt, promptFiles } from "./prompt-metadata.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const promptsRoot = path.join(repositoryRoot, "prompts");
const indexPath = path.join(promptsRoot, "README.md");
const submissionUrl = "https://oci-na-engineering-prompt-library.msheerin01.workers.dev/?view=submit";
const browseUrl = "https://michaelsheerin.github.io/oci-na-engineering-codex-repo/";

function displayCategory(category) {
  return (category || "other").replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function escapeCell(value) {
  return String(value || "Not provided.").replaceAll("|", "\\|").replaceAll("\n", " ");
}

function skillSlug(value) {
  return String(value || "prompt").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64) || "prompt";
}

function skillPath(record) {
  if (record.skill_path) return record.skill_path;
  const candidate = path.join(repositoryRoot, "skills", skillSlug(record.skill_name || record.title), "SKILL.md");
  return fs.existsSync(candidate) ? `skills/${skillSlug(record.skill_name || record.title)}/SKILL.md` : "";
}

const records = promptFiles(promptsRoot)
  .map(parsePrompt)
  .filter((record) => record.errors.length === 0)
  .map((record) => {
    const metadata = record.metadata;
    return {
      ...metadata,
      relativePath: path.relative(promptsRoot, record.filePath).replaceAll(path.sep, "/"),
      skillPath: skillPath(metadata),
    };
  })
  .sort((a, b) => String(a.title).localeCompare(String(b.title)));

const grouped = new Map();
for (const record of records) {
  const category = record.category || "other";
  if (!grouped.has(category)) grouped.set(category, []);
  grouped.get(category).push(record);
}

const sections = [...grouped.entries()]
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([category, categoryRecords]) => {
    const rows = categoryRecords
      .map((record) => {
        const skill = record.skillPath ? `[$${escapeCell(record.skill_name || skillSlug(record.title))}](../${encodeURI(record.skillPath)})` : "Prompt only";
        return `| [${escapeCell(record.title)}](./${encodeURI(record.relativePath)}) | ${skill} | ${escapeCell(record.description)} | ${escapeCell(record.contact_name)} |`;
      })
      .join("\n");
    return `## ${displayCategory(category)}\n\n| Workflow | Codex skill | Use case | Contact |\n| --- | --- | --- | --- |\n${rows}`;
  });

const content = `# Prompt and Skill Library

Each workflow form submission creates a readable prompt record and a paired Codex skill file. No review or manual publishing step is required.

[Browse with search and filters](${browseUrl}) · [Submit a workflow](${submissionUrl}) · [Browse skill files](../skills/) · Use GitHub repository search with \`path:prompts\` or \`path:skills\` to find workflows.

${records.length ? `This library contains ${records.length} workflow record${records.length === 1 ? "" : "s"}.` : "No workflow records have been added yet."}

${sections.join("\n\n")}
`;

fs.writeFileSync(indexPath, content);
console.log(`Built prompt index with ${records.length} prompt record(s).`);
