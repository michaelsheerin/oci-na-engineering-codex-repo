import fs from "node:fs";
import path from "node:path";
import { inflateRawSync } from "node:zlib";
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
  "`collect_required_inputs`",
  "`required_input_form`",
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
  const workflowStart = content.indexOf("## Workflow instructions\n");
  const trigger = requiredInputFormRules[0];
  const discovery = requiredInputFormRules[1];
  const invoke = requiredInputFormRules[6];
  const fallback = requiredInputFormRules[8];
  if (workflowStart >= 0 && content.indexOf(trigger) > workflowStart) errors.push(`${relativePath}: Place the required-input-form trigger rule before workflow instructions.`);
  if (content.indexOf(discovery) > content.indexOf(invoke) || content.indexOf(invoke) > content.indexOf(fallback)) errors.push(`${relativePath}: Place deferred-tool discovery and form invocation before the chat fallback rule.`);
}

function skillSlug(value) {
  return String(value || "prompt").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64) || "prompt";
}

function packagePath(value) {
  return /^skill-packages\/[a-z0-9]+(?:-[a-z0-9]+)*\.zip$/.test(value || "") ? value : "";
}

function packageArchivePath(value) {
  const rawPath = String(value || "").replaceAll("\\", "/").replace(/\/+/g, "/");
  const normalized = rawPath.endsWith("/") ? rawPath.slice(0, -1) : rawPath;
  if (!normalized || rawPath.startsWith("/") || /^[a-zA-Z]:/.test(normalized) || normalized.split("/").some((part) => !part || part === "." || part === "..")) throw new Error("contains an unsafe file path");
  return normalized;
}

function zipUint16(bytes, offset) {
  if (offset < 0 || offset + 2 > bytes.length) throw new Error("is truncated");
  return bytes.readUInt16LE(offset);
}

function zipUint32(bytes, offset) {
  if (offset < 0 || offset + 4 > bytes.length) throw new Error("is truncated");
  return bytes.readUInt32LE(offset);
}

function zipEnd(bytes) {
  for (let offset = bytes.length - 22; offset >= Math.max(0, bytes.length - 0xffff - 22); offset -= 1) {
    if (zipUint32(bytes, offset) === 0x06054b50 && offset + 22 + zipUint16(bytes, offset + 20) === bytes.length) return offset;
  }
  throw new Error("is not a valid ZIP archive");
}

function packageSkillContent(content) {
  const normalized = content.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const frontMatter = normalized.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontMatter) throw new Error("SKILL.md must start with YAML front matter");
  const yamlScalar = (value) => String(value || "").trim().replace(/^(?:\"([^\"]*)\"|'([^']*)')$/, (_, doubleQuoted, singleQuoted) => doubleQuoted ?? singleQuoted);
  const packageName = yamlScalar(frontMatter[1].match(/^name:\s*(.+)$/m)?.[1]);
  const description = yamlScalar(frontMatter[1].match(/^description:\s*(.+)$/m)?.[1]);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(packageName)) throw new Error("SKILL.md front matter name must use lowercase letters, numbers, and hyphens");
  if (!description) throw new Error("SKILL.md front matter requires a description");
  return packageName;
}

function packageNamingMismatch(packageName) {
  return `Skill package naming mismatch. SKILL.md defines the skill name as "${packageName}".\n\nRename the ZIP file to: ${packageName}.zip\nRename the top-level folder inside the ZIP to: ${packageName}\n\nThen upload the renamed ZIP file.`;
}

function validateUploadedPackage(filePath, skillName) {
  const bytes = fs.readFileSync(filePath);
  if (bytes.length < 22 || bytes.length > 10 * 1024 * 1024) throw new Error("must be a ZIP archive no larger than 10 MB");
  const end = zipEnd(bytes);
  const count = zipUint16(bytes, end + 10);
  const directorySize = zipUint32(bytes, end + 12);
  const directoryOffset = zipUint32(bytes, end + 16);
  if (zipUint16(bytes, end + 4) !== 0 || zipUint16(bytes, end + 6) !== 0 || zipUint16(bytes, end + 8) !== count) throw new Error("uses an unsupported multi-volume ZIP archive");
  if (count === 0xffff || directorySize === 0xffffffff || directoryOffset === 0xffffffff) throw new Error("uses unsupported ZIP64 metadata");
  if (count > 120 || directoryOffset + directorySize > bytes.length) throw new Error("has an invalid ZIP directory");
  const entries = [];
  const names = new Set();
  let offset = directoryOffset;
  for (let index = 0; index < count; index += 1) {
    if (zipUint32(bytes, offset) !== 0x02014b50) throw new Error("has an invalid ZIP entry");
    const flags = zipUint16(bytes, offset + 8);
    const method = zipUint16(bytes, offset + 10);
    const compressedSize = zipUint32(bytes, offset + 20);
    const uncompressedSize = zipUint32(bytes, offset + 24);
    const nameLength = zipUint16(bytes, offset + 28);
    const extraLength = zipUint16(bytes, offset + 30);
    const commentLength = zipUint16(bytes, offset + 32);
    const externalAttributes = zipUint32(bytes, offset + 38);
    const localOffset = zipUint32(bytes, offset + 42);
    const nextOffset = offset + 46 + nameLength + extraLength + commentLength;
    if (nextOffset > bytes.length || localOffset >= bytes.length || flags & 1 || (method !== 0 && method !== 8)) throw new Error("has an unsupported or invalid ZIP entry");
    if (((externalAttributes >>> 16) & 0xf000) === 0xa000) throw new Error("contains a symbolic link");
    const rawPath = new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(offset + 46, offset + 46 + nameLength));
    const archivePath = packageArchivePath(rawPath);
    if (names.has(archivePath)) throw new Error("contains duplicate file paths");
    names.add(archivePath);
    if (zipUint32(bytes, localOffset) !== 0x04034b50) throw new Error("has an invalid local ZIP entry");
    const localNameLength = zipUint16(bytes, localOffset + 26);
    const localExtraLength = zipUint16(bytes, localOffset + 28);
    const localNameStart = localOffset + 30;
    const localDataEnd = localNameStart + localNameLength + localExtraLength + compressedSize;
    if (localDataEnd > bytes.length) throw new Error("has truncated ZIP file data");
    const localPath = packageArchivePath(new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(localNameStart, localNameStart + localNameLength)));
    if (localPath !== archivePath) throw new Error("has mismatched local and directory file paths");
    entries.push({ path: archivePath, directory: rawPath.endsWith("/"), method, compressedSize, uncompressedSize, localOffset });
    offset = nextOffset;
  }
  const files = entries.filter((entry) => !entry.directory && !entry.path.startsWith("__MACOSX/") && !entry.path.endsWith("/.DS_Store") && entry.path !== ".DS_Store");
  if (!files.length || files.length > 100 || files.reduce((total, entry) => total + entry.uncompressedSize, 0) > 25 * 1024 * 1024) throw new Error("has too many files or too much extracted content");
  const skillEntries = files.filter((entry) => entry.path.endsWith("/SKILL.md"));
  if (skillEntries.length !== 1) throw new Error("must contain exactly one SKILL.md file");
  const skillEntry = skillEntries[0];
  const localOffset = skillEntry.localOffset;
  if (zipUint32(bytes, localOffset) !== 0x04034b50) throw new Error("has an invalid local file entry");
  const dataStart = localOffset + 30 + zipUint16(bytes, localOffset + 26) + zipUint16(bytes, localOffset + 28);
  const dataEnd = dataStart + skillEntry.compressedSize;
  if (dataEnd > bytes.length) throw new Error("has truncated SKILL.md data");
  const skillBytes = skillEntry.method === 0 ? bytes.subarray(dataStart, dataEnd) : inflateRawSync(bytes.subarray(dataStart, dataEnd));
  if (skillBytes.length !== skillEntry.uncompressedSize) throw new Error("has invalid extracted SKILL.md data");
  const packageName = packageSkillContent(new TextDecoder("utf-8", { fatal: true }).decode(skillBytes));
  const root = `${packageName}/`;
  if (skillName !== packageName || path.basename(filePath) !== `${packageName}.zip` || files.some((entry) => !entry.path.startsWith(root))) throw new Error(packageNamingMismatch(packageName));
}

for (const record of promptFiles(promptsRoot).map(parsePrompt).filter((record) => record.errors.length === 0)) {
  const promptPath = path.relative(repositoryRoot, record.filePath).replaceAll(path.sep, "/");
  if (record.metadata.skill_delivery === "package") {
    const uploadedPackage = packagePath(record.metadata.skill_package_path);
    if (!uploadedPackage) {
      errors.push(`${promptPath}: Add a valid skill_package_path for the uploaded skill package.`);
      continue;
    }
    const uploadedPackagePath = path.join(repositoryRoot, uploadedPackage);
    if (!fs.existsSync(uploadedPackagePath)) errors.push(`${promptPath}: Add its uploaded skill package at ${uploadedPackage}.`);
    else {
      try {
        validateUploadedPackage(uploadedPackagePath, skillSlug(record.metadata.skill_name || record.metadata.title));
      } catch (error) {
        errors.push(`${promptPath}: Uploaded skill package ${error.message}.`);
      }
    }
    if (!Array.isArray(record.metadata.skill_package_contents) || !record.metadata.skill_package_contents.includes("SKILL.md")) errors.push(`${promptPath}: Record the uploaded package contents, including SKILL.md.`);
    continue;
  }
  const skillName = skillSlug(record.metadata.skill_name || record.metadata.title);
  const expectedPath = record.metadata.skill_path || `skills/${skillName}/SKILL.md`;
  if (!skillFiles.has(expectedPath)) {
    errors.push(`${promptPath}: Add its paired skill file at ${expectedPath}.`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${files.length} Codex skill file(s).`);
