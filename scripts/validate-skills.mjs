import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parsePrompt, promptFiles } from "./prompt-metadata.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = path.join(repositoryRoot, "skills");
const promptsRoot = path.join(repositoryRoot, "prompts");
const errors = [];
const files = [];
const requiredInputFormRules = [
  "When a user invokes this skill without the required CSV, open the embedded required-input form as the first task action.",
  "Before treating `na_engineering_required_input_form.collect_required_inputs` as unavailable, search the complete tool catalog, including deferred MCP tools, for:",
  "`mcp__na_engineering_required_input_form__collect_required_inputs`",
  "A missing entry from the initially visible tool list does not establish tool unavailability.",
  "If `mcp__na_engineering_required_input_form__collect_required_inputs` exists, invoke it immediately. Do not ask for required inputs in chat first.",
  "If one or more required values are missing, invoke `mcp__na_engineering_required_input_form__collect_required_inputs` immediately with only the entries below that are still missing. Preserve each label and required setting:",
  "Use the chat prompt only after a complete deferred-tool search finds no embedded required-input form service.",
  "If the form returns unsubmitted, cancelled, or blank required values, do not continue and do not switch to chat collection. State that the embedded form needs submission, then stop.",
];

function visit(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(filePath);
    if (entry.isFile() && entry.name === "SKILL.md") files.push(filePath);
  }
}

visit(skillsRoot);
const skillFiles = new Set(files.map((filePath) => path.relative(repositoryRoot, filePath).replaceAll(path.sep, "/")));
for (const filePath of files) {
  const relativePath = path.relative(repositoryRoot, filePath).replaceAll(path.sep, "/");
  const content = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
  const frontMatter = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontMatter) {
    errors.push(`${relativePath}: Add YAML front matter with name and description.`);
    continue;
  }
  const name = frontMatter[1].match(/^name:\s*(.+)$/m)?.[1].trim();
  const description = frontMatter[1].match(/^description:\s*(.+)$/m)?.[1].trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name || "")) errors.push(`${relativePath}: name must be lowercase and hyphen-separated.`);
  if (!description) errors.push(`${relativePath}: description is required.`);
  if (!/## Workflow instructions\n[\s\S]*?`{3,}text\n[\s\S]+?\n`{3,}/.test(content)) errors.push(`${relativePath}: Add complete workflow instructions in a text code block.`);
  for (const rule of requiredInputFormRules) {
    if (!content.includes(rule)) errors.push(`${relativePath}: Add the required embedded required-input form rule: ${rule}`);
  }
}

function skillSlug(value) {
  return String(value || "prompt").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64) || "prompt";
}

for (const record of promptFiles(promptsRoot).map(parsePrompt).filter((record) => record.errors.length === 0)) {
  const skillName = skillSlug(record.metadata.skill_name || record.metadata.title);
  const expectedPath = record.metadata.skill_path || `skills/${skillName}/SKILL.md`;
  if (!skillFiles.has(expectedPath)) {
    const promptPath = path.relative(repositoryRoot, record.filePath).replaceAll(path.sep, "/");
    errors.push(`${promptPath}: Add its paired skill file at ${expectedPath}.`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${files.length} Codex skill file(s).`);
