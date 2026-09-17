import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parsePrompt, promptFiles } from "./prompt-metadata.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const promptsRoot = path.join(repositoryRoot, "prompts");
const write = process.argv.includes("--write");

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
  return value.replace(/^(?:`{3,}[^\r\n]*\r?\n)+/i, "").replace(/(?:\r?\n`{3,}\s*)+$/, "").trim();
}

function oneLine(value, maximum = 300) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maximum);
}

function skillSlug(value) {
  return String(value || "prompt").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64) || "prompt";
}

function linkedInstructions(label, url) {
  return url ? `\n\n${label}: ${url}` : "";
}

function workflowItems(value, fallback = "") {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  const source = String(value || fallback || "").trim();
  if (!source) return [];
  const lines = source.split("\n").filter((line) => line.trim());
  if (lines.length >= 2 && lines[0].includes("|") && /^[\s|:-]+$/.test(lines[1].trim())) {
    return lines.slice(2).map((line) => line.split("|").map((cell) => cell.trim()).filter(Boolean)[0]?.replaceAll("\\|", "|") || "").filter(Boolean);
  }
  return lines.map((item) => item.replace(/^\s*(?:[-*+]\s+|\d+[.)]\s+)/, "").trim()).filter(Boolean);
}

function inputList(value, emptyMessage = "No required inputs were provided.") {
  return value.length ? value.map((item) => `- ${item}`).join("\n") : emptyMessage;
}

function skillFile(record) {
  const fence = "`".repeat(Math.max(3, ...(record.promptText.match(/`+/g) || []).map((value) => value.length + 1)));
  return `---
name: ${record.skillName}
description: ${JSON.stringify(record.skillDescription)}
---

# ${record.title}

Use this skill when the user's request matches the skill description. Follow the user's direct instructions when they conflict with this workflow.

## Prerequisites

${inputList(record.prerequisites, "No prerequisites were provided.")}${linkedInstructions("Prerequisite link", record.prerequisiteLink)}

## Required inputs

${inputList(record.requiredInputs)}

## Workflow instructions

${fence}text
${record.promptText}
${fence}

## Expected output

${record.expectedOutput || "Return the result requested in the workflow instructions."}

## Additional Instructions and Post-Run Notes

${record.additionalNotes || "No additional instructions were provided."}${linkedInstructions("Related instructions", record.additionalNotesLink)}
`;
}

const records = promptFiles(promptsRoot).map(parsePrompt).filter((record) => record.errors.length === 0).map(({ metadata, body }) => {
  const title = metadata.title || "Untitled prompt";
  const skillName = skillSlug(metadata.skill_name || title);
  const useCase = section(body, "Use case and purpose");
  return {
    title,
    skillName,
    skillDescription: oneLine(metadata.skill_description || metadata.description || useCase || title),
    prerequisites: workflowItems(metadata.prerequisites, section(body, "Prerequisites")),
    prerequisiteLink: metadata.prerequisite_link || "",
    requiredInputs: workflowItems(metadata.required_inputs, section(body, "Required inputs")),
    promptText: cleanPromptText(section(body, "Prompt text")),
    expectedOutput: metadata.expected_output || section(body, "Expected output and next steps"),
    additionalNotes: [metadata.additional_instructions_notes || section(body, "Additional Instructions and Post-Run Notes") || section(body, "Additional Instructions and Pre-Run Notes") || section(body, "Additional instructions and notes"), metadata.post_execution_steps || section(body, "After the prompt runs")].filter(Boolean).join("\n\n"),
    additionalNotesLink: metadata.additional_instructions_link || metadata.post_execution_link || "",
  };
});

for (const record of records) {
  if (!record.promptText) throw new Error(`${record.skillName}: Prompt text is required to generate a skill.`);
  const filePath = path.join(repositoryRoot, "skills", record.skillName, "SKILL.md");
  if (write) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, skillFile(record));
  }
  console.log(`${write ? "Wrote" : "Would write"} ${path.relative(repositoryRoot, filePath).replaceAll(path.sep, "/")}`);
}

console.log(`${write ? "Generated" : "Found"} ${records.length} Codex skill file(s).`);
