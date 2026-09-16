import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parsePrompt, promptFiles } from "./prompt-metadata.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = path.join(repositoryRoot, "skills");
const promptsRoot = path.join(repositoryRoot, "prompts");
const errors = [];
const files = [];

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
