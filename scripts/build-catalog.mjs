import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parsePrompt, promptFiles } from "./prompt-metadata.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const promptsRoot = path.join(repositoryRoot, "prompts");
const outputPath = path.join(repositoryRoot, "docs", "catalog.json");

function section(body, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const headingMatch = new RegExp(`^## ${escaped}[ \\t]*\\r?$`, "m").exec(body);
  if (!headingMatch) return "";

  const lineEnd = body.indexOf("\n", headingMatch.index);
  const content = body.slice(lineEnd < 0 ? body.length : lineEnd + 1);
  const nextHeading = content.search(/^##[ \\t]+/m);
  return (nextHeading < 0 ? content : content.slice(0, nextHeading)).trim();
}

function cleanPromptText(value) {
  return value
    .replace(/^(?:`{3,}[^\r\n]*\r?\n)+/i, "")
    .replace(/(?:\r?\n`{3,}\s*)+$/, "")
    .trim();
}

function requiredInputs(value, fallback = "") {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  const source = String(value || fallback || "").trim();
  if (!source) return [];
  return source.split("\n").map((item) => item.replace(/^\s*(?:[-*+]\s+|\d+[.)]\s+)/, "").trim()).filter(Boolean);
}

function skillSlug(value) {
  return String(value || "prompt").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64) || "prompt";
}

function skillPath(metadata) {
  if (metadata.skill_path) return metadata.skill_path;
  const name = skillSlug(metadata.skill_name || metadata.title);
  const candidate = path.join(repositoryRoot, "skills", name, "SKILL.md");
  return fs.existsSync(candidate) ? `skills/${name}/SKILL.md` : "";
}

const records = promptFiles(promptsRoot)
  .map(parsePrompt)
  .filter((record) => record.errors.length === 0)
  .map(({ filePath, metadata, body }) => {
    const generatedSkillPath = skillPath(metadata);
    return {
    title: metadata.title,
    description: metadata.description,
    category: metadata.category,
    tags: Array.isArray(metadata.tags) ? metadata.tags : [],
    requiredInputs: requiredInputs(metadata.required_inputs, section(body, "Required inputs")),
    expectedOutput: metadata.expected_output,
    nextSteps: metadata.next_steps,
    additionalInstructionsNotes: metadata.additional_instructions_notes || section(body, "Additional Instructions and Pre-Run Notes") || section(body, "Additional instructions and notes"),
    additionalNotesLink: metadata.additional_instructions_link || metadata.post_execution_link || "",
    skillName: metadata.skill_name || (generatedSkillPath ? skillSlug(metadata.title) : ""),
    skillDescription: metadata.skill_description || (generatedSkillPath ? String(metadata.description || "").replace(/\s+/g, " ").trim().slice(0, 300) : ""),
    skillPath: generatedSkillPath,
    prerequisites: metadata.prerequisites || section(body, "Prerequisites"),
    prerequisiteLink: metadata.prerequisite_link || "",
    postExecutionSteps: metadata.post_execution_steps || section(body, "After the prompt runs"),
    postExecutionLink: metadata.post_execution_link || "",
    contactName: metadata.contact_name,
    contactEmail: metadata.contact_email,
    sourceIssue: metadata.source_issue || "",
    lastReviewed: metadata.last_reviewed,
    useCase: section(body, "Purpose and use case") || section(body, "Use case and purpose"),
    promptText: cleanPromptText(section(body, "Prompt text")),
    path: path.relative(repositoryRoot, filePath).replaceAll(path.sep, "/"),
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

fs.writeFileSync(outputPath, `${JSON.stringify(records, null, 2)}\n`);
console.log(`Built catalog with ${records.length} prompt record(s).`);
