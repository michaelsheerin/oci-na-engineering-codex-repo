let app;
const repositoryUrl = "https://github.com/michaelsheerin/oci-strategic-install-codex-repo";
const rawRepositoryUrl = "https://raw.githubusercontent.com/michaelsheerin/oci-strategic-install-codex-repo/main";
const publicLibraryUrl = "https://michaelsheerin.github.io/oci-strategic-install-codex-repo/?view=library";
const publishingServiceUrl = "https://oci-strategic-install-prompt-library.msheerin01.workers.dev";
const categories = ["analysis", "customer-preparation", "data-reporting", "project-management", "research", "technical-work", "writing-communication", "other"];
const submissionDraftKey = "strategic-install-prompt-library-submission-draft";
let prompts = [];

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function cleanText(value) {
  const source = String(value ?? "");
  if (!/<\s*\/?(?:html|head|body|div|meta|table|tr|td|th|p|br)\b/i.test(source)) return source;
  const placeholders = [];
  const protectedSource = source.replace(/<([A-Z][A-Z0-9_-]*)>/g, (_, token) => "__PROMPT_PLACEHOLDER_" + (placeholders.push(token) - 1) + "__");
  const documentFragment = new DOMParser().parseFromString(protectedSource, "text/html");
  return documentFragment.body.textContent.replace(/__PROMPT_PLACEHOLDER_(\d+)__/g, (_, index) => "<" + placeholders[Number(index)] + ">").replace(/\u00a0/g, " ").trim();
}

function inlineMarkdown(value) {
  const protectedParts = [];
  const protect = (html) => "__PROMPT_INLINE_" + (protectedParts.push(html) - 1) + "__";
  const autoLink = (candidate) => {
    const trailing = candidate.match(/[.,;:!?]+$/)?.[0] || "";
    const url = candidate.slice(0, candidate.length - trailing.length);
    return protect('<a href="' + url + '" target="_blank" rel="noreferrer">' + url + "</a>") + trailing;
  };
  const rendered = escapeHtml(value)
    .replace(/`([^`]+)`/g, (_, code) => protect("<code>" + code + "</code>"))
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, url) => protect('<a href="' + url + '" target="_blank" rel="noreferrer">' + label + "</a>"))
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/https?:\/\/[^\s<]+/g, autoLink);
  return rendered.replace(/__PROMPT_INLINE_(\d+)__/g, (_, index) => protectedParts[Number(index)]);
}

function formattedContent(value) {
  const lines = cleanText(value || "Not provided.").replace(/\r/g, "").split("\n");
  const blocks = [];
  let paragraphLines = [];
  let list = null;
  let codeFence = "";
  let codeLines = [];

  const addParagraph = () => {
    if (!paragraphLines.length) return;
    blocks.push("<p>" + inlineMarkdown(paragraphLines.join(" ").replace(/\s+/g, " ").trim()) + "</p>");
    paragraphLines = [];
  };
  const closeList = () => {
    if (!list) return;
    const typeAttribute = list.type === "ol" && list.alpha ? ' type="a"' : "";
    const startAttribute = list.type === "ol" && list.start > 1 ? ' start="' + list.start + '"' : "";
    blocks.push("<" + list.type + typeAttribute + startAttribute + ">" + list.items.map((item) => "<li>" + inlineMarkdown(item) + "</li>").join("") + "</" + list.type + ">");
    list = null;
  };
  const addListItem = (match) => {
    const marker = match[1];
    const type = marker === "-" || marker === "*" || marker === "+" ? "ul" : "ol";
    const alpha = /^[a-zA-Z][.)]$/.test(marker);
    const start = /^\d/.test(marker) ? Number.parseInt(marker, 10) : alpha ? marker[0].toLowerCase().charCodeAt(0) - 96 : 1;
    if (!list || list.type !== type || list.alpha !== alpha) {
      closeList();
      list = { type, alpha, start, items: [] };
    }
    list.items.push(match[2].trim());
  };
  const addTable = (headers, rows) => {
    blocks.push('<div class="rich-table"><table><thead><tr>' + headers.map((cell) => "<th>" + tableCellMarkdown(cell) + "</th>").join("") + "</tr></thead><tbody>" + rows.map((row) => "<tr>" + headers.map((_, cellIndex) => "<td>" + tableCellMarkdown(row[cellIndex] || "") + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>");
  };
  const cells = (line) => line.split("|").map((cell) => cell.trim()).filter(Boolean);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();
    if (codeFence) {
      if (trimmed.startsWith(codeFence)) {
        blocks.push("<pre><code>" + escapeHtml(codeLines.join("\n")) + "</code></pre>");
        codeFence = "";
        codeLines = [];
      } else {
        codeLines.push(line.replace(/^\s{0,4}/, ""));
      }
      continue;
    }
    const fence = trimmed.match(/^(`{3,}|~{3,})/);
    if (fence) {
      addParagraph();
      closeList();
      codeFence = fence[1];
      continue;
    }
    if (!trimmed) {
      addParagraph();
      closeList();
      continue;
    }
    const isTable = trimmed.includes("|") && index + 1 < lines.length && /^[\s|:-]+$/.test(lines[index + 1].trim());
    if (isTable) {
      addParagraph();
      closeList();
      const headers = cells(trimmed);
      const rows = [];
      index += 2;
      while (index < lines.length && lines[index].includes("|")) {
        rows.push(cells(lines[index]));
        index += 1;
      }
      index -= 1;
      addTable(headers, rows);
      continue;
    }
    const heading = trimmed.match(/^#{1,6}\s+(.+)$/);
    const scenario = trimmed.match(/^([A-Z])[.)]\s+(.+)$/);
    if (heading || scenario) {
      addParagraph();
      closeList();
      blocks.push("<h3>" + inlineMarkdown(heading ? heading[1] : scenario[1] + ". " + scenario[2]) + "</h3>");
      continue;
    }
    const listItem = line.match(/^\s*((?:\d+|[a-zA-Z])[.)]|[-*+])\s+(.+)$/);
    if (listItem) {
      addParagraph();
      addListItem(listItem);
      continue;
    }
    closeList();
    paragraphLines.push(trimmed);
  }
  if (codeFence) blocks.push("<pre><code>" + escapeHtml(codeLines.join("\n")) + "</code></pre>");
  addParagraph();
  closeList();
  return '<div class="rich-content">' + blocks.join("") + "</div>";
}

function tableCellMarkdown(value) {
  return '<div class="table-markdown">' + formattedContent(value) + "</div>";
}

function name(value) {
  return String(value || "other").replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function href(view, values = {}) {
  return "?" + new URLSearchParams({ view, ...values }).toString();
}

function publisherHref(view, values = {}) {
  return window.location.origin === publishingServiceUrl ? href(view, values) : publishingServiceUrl + href(view, values);
}

function readSubmissionDraft() {
  try {
    const draft = JSON.parse(window.sessionStorage.getItem(submissionDraftKey) || "null");
    return draft && typeof draft === "object" ? draft : null;
  } catch {
    return null;
  }
}

function saveSubmissionDraft(draft) {
  try {
    window.sessionStorage.setItem(submissionDraftKey, JSON.stringify(draft));
  } catch {}
}

function clearSubmissionDraft() {
  try {
    window.sessionStorage.removeItem(submissionDraftKey);
  } catch {}
}

function publishedRecordPath(value) {
  const path = String(value || "");
  return /^prompts\/[a-z0-9-]+\/[a-z0-9-]+\.md$/.test(path) ? path : "";
}

function submissionNotice() {
  const query = new URLSearchParams(window.location.search);
  const status = query.get("submission");
  if (status !== "created" && status !== "updated") return "";
  const path = publishedRecordPath(query.get("record"));
  const recordLink = path ? '<a class="submission-notice-link" href="' + escapeHtml(repositoryUrl + "/blob/main/" + path.split("/").map(encodeURIComponent).join("/")) + '" target="_blank" rel="noreferrer">View Markdown record</a>' : "";
  const action = status === "created" ? "saved" : "updated";
  return '<section id="submission-notice" class="container submission-notice" role="status" aria-live="polite"><div class="submission-notice-copy"><strong>Prompt record ' + action + '.</strong><span>This temporary confirmation will disappear when you close it. The catalog is rebuilding and this library will update automatically after deployment.</span></div>' + recordLink + '<button id="dismiss-submission-notice" class="submission-notice-dismiss" type="button" aria-label="Dismiss status update" title="Dismiss status update">&times;</button></section>';
}

function libraryRedirect(result) {
  const redirect = new URL(publicLibraryUrl);
  redirect.searchParams.set("submission", result.updated ? "updated" : "created");
  const path = publishedRecordPath(result.path);
  if (path) redirect.searchParams.set("record", path);
  return redirect.toString();
}

function creatorKey(record) {
  return [cleanText(record.contactName).trim(), cleanText(record.contactEmail).trim()].filter(Boolean).join(" | ");
}

function displayDate(value) {
  const dateValue = cleanText(value).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return dateValue || "Not provided";
  const date = new Date(`${dateValue}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date);
}

async function copyText(value) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const fallback = document.createElement("textarea");
  fallback.value = value;
  fallback.setAttribute("readonly", "");
  fallback.style.position = "fixed";
  fallback.style.opacity = "0";
  document.body.append(fallback);
  fallback.select();
  const copied = document.execCommand("copy");
  fallback.remove();
  if (!copied) throw new Error("Clipboard access was unavailable.");
}

function skillSlug(value) {
  return String(value || "skill").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64) || "skill";
}

function rawFileUrl(path) {
  return rawRepositoryUrl + "/" + String(path || "").split("/").map(encodeURIComponent).join("/");
}

async function downloadSkill(record) {
  const response = await fetch(rawFileUrl(record.skillPath));
  if (!response.ok) throw new Error("The skill file is not available yet.");
  const blob = await response.blob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${record.skillName || skillSlug(record.title)}-SKILL.md`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function fullText(record) {
  const requiredInputs = requiredInputList(record.requiredInputs);
  return [record.title, record.description, record.category, ...(record.tags || []), record.skillName, record.skillDescription, record.useCase, record.prerequisites, record.promptText, ...requiredInputs, record.expectedOutput, record.nextSteps, record.additionalInstructionsNotes, record.additionalNotesLink, record.postExecutionSteps, record.contactName, record.contactEmail].join(" ").toLowerCase();
}

function requiredInputList(value) {
  const values = Array.isArray(value) ? value : String(value || "").split("\n");
  return values.map((item) => cleanText(item).trim()).filter(Boolean);
}

function requiredInputsTable(value) {
  const inputs = requiredInputList(value);
  if (!inputs.length) return "<p>No required inputs provided.</p>";
  return '<div class="rich-table required-inputs-table"><table><thead><tr><th>Required input</th></tr></thead><tbody>' + inputs.map((item) => "<tr><td>" + tableCellMarkdown(item) + "</td></tr>").join("") + "</tbody></table></div>";
}

function workflowChoiceBlurb() {
  return '<aside class="workflow-choice-blurb"><p class="eyebrow">Choose how to use a workflow</p><div><strong>Copy prompt text</strong><p>Use this for a one-time run in the current Codex task. It does not save the workflow.</p></div><div><strong>Download a Codex skill</strong><p>Use this when the workflow should stay available for future Codex tasks. Save <code>SKILL.md</code> under <code>~/.agents/skills/&lt;skill-name&gt;/</code>, then invoke <code>$skill-name</code>.</p></div></aside>';
}

function page(kicker, title, lead, content, markdownLead = false) {
  const leadContent = markdownLead ? '<div class="lead page-hero-markdown">' + formattedContent(lead) + "</div>" : '<p class="lead">' + lead + "</p>";
  return '<section class="page-hero"><div class="container page-hero-inner"><p class="eyebrow">' + kicker + '</p><h1>' + title + "</h1>" + leadContent + "</div></section>" + content;
}

function legacyHome() {
  const count = prompts.length;
  app.innerHTML = '<section class="hero"><div class="container hero-content"><p class="eyebrow">Knowledge that compounds</p><h1>Reusable Codex prompts for RA work.</h1><p class="lead">A shared workspace for finding proven workflows, understanding their context, and contributing prompts that improve Strategic Install delivery.</p><div class="hero-actions"><a class="button" href="' + href("library") + '">Browse ' + count + ' prompts</a><a class="text-link" href="' + publisherHref("submit") + '">Submit a prompt</a></div></div></section><section class="container purpose-grid"><article><p class="number">01</p><h2>Find</h2><p>Search every record by category, use case, prompt text, inputs, output, notes, or contact details.</p></article><article><p class="number">02</p><h2>Run</h2><p>Open the record, confirm context and inputs, then use sanitized information.</p></article><article><p class="number">03</p><h2>Improve</h2><p>Submit a workflow or edit an existing record so team knowledge stays current.</p></article></section><section class="container action-grid"><a class="action-card" href="' + href("library") + '"><span>Prompt library</span><strong>Browse and filter records</strong><small>' + count + ' published prompts</small></a><a class="action-card" href="' + href("readme") + '"><span>Repository overview</span><strong>Read the purpose and operating model</strong><small>Everything needed to get started</small></a><a class="action-card" href="' + href("contribute") + '"><span>Contribution guide</span><strong>Understand the sharing standard</strong><small>Clear, reusable, safe records</small></a></section>';
}

function home() {
  const count = prompts.length;
  app.innerHTML = '<section class="hero"><div class="container hero-content"><p class="eyebrow">Knowledge that compounds</p><h1>Reusable Codex workflows for RA work.</h1><p class="lead">Find a proven workflow, copy its prompt for a one-time run, or download its Codex skill for continued use.</p><div class="hero-actions"><a class="button" href="' + href("library") + '">Browse ' + count + ' workflows</a><a class="text-link" href="' + publisherHref("submit") + '">Submit a prompt and skill</a></div></div></section><section class="container purpose-grid"><article><p class="number">01</p><h2>Find</h2><p>Search workflow records by skill name, use case, input, output, prerequisite, or follow-up step.</p></article><article><p class="number">02</p><h2>Run once or install</h2><p>Copy a prompt for the current task, or download its SKILL.md file for future Codex work.</p></article><article><p class="number">03</p><h2>Improve</h2><p>Submit a workflow once to produce a readable library record and a reusable Codex skill.</p></article></section><section class="container action-grid"><a class="action-card" href="' + href("library") + '"><span>Workflow library</span><strong>Browse prompts and skills</strong><small>' + count + ' published workflows</small></a><a class="action-card" href="' + href("readme") + '"><span>How it works</span><strong>Read the operating model</strong><small>Understand the two-file output</small></a><a class="action-card" href="' + href("contribute") + '"><span>Contribution guide</span><strong>Prepare a usable skill</strong><small>Field guidance and installation steps</small></a></section>';
}

function legacyAbout() {
  const count = prompts.length;
  const browseLink = href("library");
  const submitLink = publisherHref("submit");
  const contributeLink = href("contribute");
  const repositoryLink = repositoryUrl;
  app.innerHTML = page("About", "Strategic Install Codex Prompt Library", "A shared place for RAs to find, reuse, and improve Codex workflows for Strategic Install work.", '<section class="container about-layout"><section class="about-introduction"><div><h2>Purpose</h2><p>Useful prompt workflows often stay with one person. This library turns those workflows into shared records with the context, inputs, expected output, and contact details needed for reuse.</p><p>Each record has a Markdown source file in GitHub and a searchable entry in the prompt library.</p></div><aside class="about-summary"><span>Current library</span><strong>' + count + '</strong><small>published prompt' + (count === 1 ? "" : "s") + '</small></aside></section><section class="about-section"><div class="section-heading"><div><p class="eyebrow">Start here</p><h2>Library links</h2></div></div><div class="about-action-grid"><a class="about-action-card" href="' + browseLink + '"><span>Browse prompts</span><strong>Search the library</strong><small>Filter by category, creator, and prompt content.</small></a><a class="about-action-card" href="' + submitLink + '"><span>Submit a prompt</span><strong>Share a workflow</strong><small>Add a prompt record directly from the web form.</small></a><a class="about-action-card" href="' + contributeLink + '"><span>Contribution guide</span><strong>Follow the sharing standard</strong><small>Review the record format and content rules.</small></a><a class="about-action-card" href="' + repositoryLink + '" target="_blank" rel="noreferrer"><span>GitHub repository</span><strong>Open the Markdown records</strong><small>View source files, revision history, and repository documentation.</small></a></div></section><section class="about-info-grid"><article class="about-section about-workflow"><p class="eyebrow">How the library works</p><h2>From workflow to shared record</h2><ol><li><span>1</span><div><strong>Find</strong><p>Search records by title, category, use case, inputs, output, notes, or creator.</p></div></li><li><span>2</span><div><strong>Run</strong><p>Review context and required inputs. Replace placeholders with sanitized information.</p></div></li><li><span>3</span><div><strong>Improve</strong><p>Submit a new workflow or edit an existing record when a better approach emerges.</p></div></li></ol></article><article class="about-section about-safety"><p class="eyebrow">Sharing standard</p><h2>Keep records safe and reusable</h2><p>Use placeholders for variable information. Remove customer data, credentials, personal data, internal identifiers, and non-public source material.</p><a class="text-link-dark" href="' + contributeLink + '">Read the contribution guide</a></article></section><section class="about-section"><p class="eyebrow">Repository structure</p><h2>Where information lives</h2><div class="about-table"><table><thead><tr><th>Location</th><th>Purpose</th><th>Use this for</th></tr></thead><tbody><tr><td><a href="' + browseLink + '">Browse Prompts</a></td><td>Searchable web library</td><td>Finding records and opening prompt details.</td></tr><tr><td><a href="' + submitLink + '">Submit a Prompt</a></td><td>Direct record publishing</td><td>Adding a new prompt record without editing repository files.</td></tr><tr><td><a href="' + contributeLink + '">Contribution Guide</a></td><td>Record standards</td><td>Preparing a clear, safe, reusable submission.</td></tr><tr><td><a href="' + repositoryLink + '" target="_blank" rel="noreferrer">GitHub Markdown repository</a></td><td>Source of record history</td><td>Viewing Markdown files, source templates, and revision history.</td></tr></tbody></table></div></section></section>');
}

function legacyContributionGuide() {
  const submitLink = publisherHref("submit");
  const templateLink = repositoryUrl + "/blob/main/prompts/_template.md";
  const repositoryPromptsLink = repositoryUrl + "/tree/main/prompts";
  app.innerHTML = page("Contribution guide", "Share a useful Codex workflow", "Use this guide to prepare a clear, safe prompt record that another RA can understand and reuse.", '<section class="container guide-layout"><section class="guide-introduction"><div><p class="eyebrow">Preferred path</p><h2>Publish through the web form</h2><p>Complete the optional fields, sign in with GitHub, and publish the prompt record. The library updates after the deployment finishes. No Issue or manual approval step follows.</p><div class="guide-actions"><a class="button" href="' + submitLink + '">Submit a prompt</a><a class="button button-secondary" href="' + href("library") + '">Browse prompts</a></div></div><aside class="guide-note"><h3>Before you submit</h3><p>Remove customer data, credentials, personal data, internal identifiers, and non-public source material. Use placeholders for variable information.</p></aside></section><section class="guide-section"><p class="eyebrow">Record requirements</p><h2>What to include</h2><p class="guide-lead">Every form field is optional. Complete the fields that give another RA enough context to run and assess the workflow.</p><div class="guide-table"><table><thead><tr><th>Field</th><th>What to provide</th></tr></thead><tbody><tr><td>Title</td><td>A short, action-oriented name.</td></tr><tr><td>Category</td><td>The work area used to organize and filter the record.</td></tr><tr><td>Use case and purpose</td><td>When to use the prompt, the problem addressed, and known limits.</td></tr><tr><td>Required inputs</td><td>Information, files, or links needed before running the prompt. State <code>None</code> when no input is required.</td></tr><tr><td>Expected output and next steps</td><td>What Codex should produce, how to check the result, and the work that follows.</td></tr><tr><td>Additional instructions and notes</td><td>Constraints, references, edge cases, setup details, or validation notes.</td></tr><tr><td>Prompt text</td><td>The complete reusable prompt. Paste the text or upload a plain-text or Markdown file.</td></tr><tr><td>Contact</td><td>Your name and work email for questions and improvement requests.</td></tr></tbody></table></div></section><section class="guide-info-grid"><article class="guide-section"><p class="eyebrow">Content standard</p><h2>Write for reuse</h2><ul class="guide-checklist"><li>Use placeholders such as <code>[customer name]</code>, <code>[file path]</code>, and <code>[reporting period]</code>.</li><li>State assumptions, constraints, and required validation steps.</li><li>Write enough context for another RA to run the prompt without a separate briefing.</li><li>Link relevant internal documentation when outside context is required.</li><li>Test the prompt before submission.</li></ul></article><article class="guide-section guide-restricted"><p class="eyebrow">Do not submit</p><h2>Keep sensitive content out</h2><ul class="guide-checklist"><li>Customer data, credentials, tokens, passwords, or private URLs.</li><li>Personal data beyond the contributor contact information requested by the form.</li><li>Proprietary content or source material.</li><li>Prompts that depend on unstated access, background knowledge, or manual cleanup.</li></ul></article></section><section class="guide-section"><p class="eyebrow">Publishing flow</p><h2>What happens after submission</h2><ol class="guide-flow"><li><span>1</span><div><strong>Sign in and publish</strong><p>The contributor submits the prompt form through GitHub sign-in.</p></div></li><li><span>2</span><div><strong>Record creation</strong><p>The service creates or updates a Markdown file under the selected prompt category.</p></div></li><li><span>3</span><div><strong>Library update</strong><p>The prompt catalog rebuilds and the record appears in Browse Prompts after deployment.</p></div></li></ol></section><section class="guide-direct"><div><p class="eyebrow">Repository option</p><h2>Work directly in GitHub</h2><p>Experienced contributors can copy the standard Markdown template, save a file under <code>prompts/&lt;category&gt;/</code>, and open a pull request. The catalog build reads record metadata. Do not edit the catalog file by hand.</p></div><div class="guide-actions"><a class="button button-secondary" href="' + templateLink + '" target="_blank" rel="noreferrer">Open record template</a><a class="text-link-dark" href="' + repositoryPromptsLink + '" target="_blank" rel="noreferrer">Browse Markdown records</a></div></section><section class="guide-update"><h2>Update an existing prompt</h2><p>Open the record in Browse Prompts and select Edit this prompt. Explain the change, the reason, and the test performed. Keep the original file when practical so history stays intact.</p></section></section>');
}

function contributionGuide() {
  const submitLink = publisherHref("submit");
  const templateLink = repositoryUrl + "/blob/main/prompts/_template.md";
  const skillsLink = repositoryUrl + "/tree/main/skills";
  app.innerHTML = page("Contribution guide", "Share a reusable Codex workflow", "One submission creates a readable Markdown record for people and a SKILL.md file for Codex.", '<section class="container guide-layout"><section class="guide-introduction"><div><p class="eyebrow">Preferred path</p><h2>Publish through the workflow form</h2><p>Complete the form, sign in with GitHub, and publish both artifacts together. The library refreshes after deployment.</p><div class="guide-actions"><a class="button" href="' + submitLink + '">Submit a prompt and skill</a><a class="button button-secondary" href="' + href("library") + '">Browse the library</a></div></div><aside class="guide-note"><h3>Before you submit</h3><p>Remove customer data, credentials, personal data, internal identifiers, and non-public source material. Replace variable data with placeholders.</p></aside></section><section class="guide-section"><p class="eyebrow">Required for a Codex skill</p><h2>What the form produces</h2><div class="guide-table"><table><thead><tr><th>Field</th><th>Purpose</th></tr></thead><tbody><tr><td>Title</td><td>Names the reader-friendly Markdown workflow record.</td></tr><tr><td>Codex skill name</td><td>A stable lowercase, hyphen-separated name, invoked as <code>$skill-name</code>.</td></tr><tr><td>Codex skill description</td><td>Tells Codex when the workflow applies.</td></tr><tr><td>Skill instructions and prompt text</td><td>Provides the full reusable workflow. Users may copy it for a one-time run or install it as a skill.</td></tr></tbody></table></div></section><section class="guide-info-grid"><article class="guide-section"><p class="eyebrow">Context for continued use</p><h2>Make the workflow operational</h2><ul class="guide-checklist"><li>List prerequisites and link to their instructions when they exist.</li><li>State required inputs, expected output, constraints, and validation checks.</li><li>List the post-execution work and link to the next prompt or runbook.</li><li>Use Markdown headings, bullets, bold text, and links in long-form fields.</li></ul></article><article class="guide-section guide-restricted"><p class="eyebrow">Using a downloaded skill</p><h2>Keep it available in Codex</h2><ol class="guide-checklist"><li>Download <code>SKILL.md</code> from a library record.</li><li>Save it as <code>~/.agents/skills/&lt;skill-name&gt;/SKILL.md</code>.</li><li>Restart Codex if needed.</li><li>Start a new task and type <code>$&lt;skill-name&gt;</code>.</li></ol></article></section><section class="guide-direct"><div><p class="eyebrow">Repository source</p><h2>Review the generated files</h2><p>Each workflow has a Markdown record under <code>prompts/</code> and a paired skill file under <code>skills/</code>.</p></div><div class="guide-actions"><a class="button button-secondary" href="' + templateLink + '" target="_blank" rel="noreferrer">Open record template</a><a class="text-link-dark" href="' + skillsLink + '" target="_blank" rel="noreferrer">Browse skill files</a></div></section></section>');
}

function about() {
  const count = prompts.length;
  const browseLink = href("library");
  const submitLink = publisherHref("submit");
  const contributeLink = href("contribute");
  const skillsLink = repositoryUrl + "/tree/main/skills";
  app.innerHTML = page("About", "Strategic Install Codex Prompt and Skill Library", "A shared library of workflows for Strategic Install RAs. Each published workflow supports a one-time prompt run and continued use as a Codex skill.", '<section class="container about-layout"><section class="about-introduction"><div><h2>Two outputs from one workflow</h2><p>Each submission creates a readable Markdown record under <code>prompts/</code> and a paired <code>SKILL.md</code> file under <code>skills/</code>.</p><p>Use the library record to understand context, prerequisites, expected results, and follow-up work. Copy the prompt for a one-time task. Download the skill file when the workflow should stay available in Codex.</p></div><aside class="about-summary"><span>Current library</span><strong>' + count + '</strong><small>published workflow' + (count === 1 ? "" : "s") + '</small></aside></section><section class="about-section"><div class="section-heading"><div><p class="eyebrow">Start here</p><h2>Choose your path</h2></div></div><div class="about-action-grid"><a class="about-action-card" href="' + browseLink + '"><span>Browse workflows</span><strong>Find prompts and skills</strong><small>Search by use case, input, prerequisite, or skill name.</small></a><a class="about-action-card" href="' + submitLink + '"><span>Publish a workflow</span><strong>Create both files</strong><small>Use the guided form and GitHub sign-in.</small></a><a class="about-action-card" href="' + contributeLink + '"><span>Contribution guide</span><strong>Prepare a usable skill</strong><small>Review required fields and installation steps.</small></a><a class="about-action-card" href="' + skillsLink + '" target="_blank" rel="noreferrer"><span>Skill files</span><strong>View generated SKILL.md files</strong><small>Review the Codex-ready source in GitHub.</small></a></div></section><section class="about-info-grid"><article class="about-section about-workflow"><p class="eyebrow">How to use a workflow</p><h2>Copy once or install for later</h2><ol><li><span>1</span><div><strong>Find</strong><p>Search the workflow library and read the record before use.</p></div></li><li><span>2</span><div><strong>Copy prompt</strong><p>Copy the prompt text into the current Codex task for a one-time run. This does not save the workflow.</p></div></li><li><span>3</span><div><strong>Install skill</strong><p>Download <code>SKILL.md</code>, save it under <code>~/.agents/skills/&lt;skill-name&gt;/</code>, then start a new task with <code>$skill-name</code>.</p></div></li></ol></article><article class="about-section about-safety"><p class="eyebrow">Sharing standard</p><h2>Keep workflows safe and reusable</h2><p>Use placeholders for variable information. Remove customer data, credentials, personal data, internal identifiers, and non-public source material.</p><a class="text-link-dark" href="' + contributeLink + '">Read the contribution guide</a></article></section></section>');
}

function library() {
  const activeCategories = [...new Set(prompts.map((record) => record.category || "other"))].sort();
  const categoriesOptions = activeCategories.map((value) => '<option value="' + value + '">' + name(value) + '</option>').join("");
  const creators = [...new Set(prompts.map(creatorKey).filter(Boolean))].sort((left, right) => left.localeCompare(right));
  const creatorOptions = creators.map((value) => '<option value="' + escapeHtml(value) + '">' + escapeHtml(value) + '</option>').join("");
  app.innerHTML = page("Prompt and skill catalog", "Browse the library", "Find a reusable workflow, then copy its prompt or download its Codex skill for continued use.", submissionNotice() + '<section class="library-section"><div class="container"><div class="section-heading"><div><p class="eyebrow">Search and filter</p><h2>Prompt and skill records</h2></div><p id="result-count" class="result-count"></p></div>' + workflowChoiceBlurb() + '<p class="filter-description">Search includes titles, skill names and descriptions, categories, use cases, prerequisites, prompt text, expected output, additional instructions, and creator details.</p><div class="filters"><label><span>Search</span><input id="search" type="search" placeholder="Search the prompt and skill library"></label><label><span>Category</span><select id="category"><option value="">All categories</option>' + categoriesOptions + '</select></label><label><span>Creator</span><select id="creator"><option value="">All creators</option>' + creatorOptions + '</select></label><label><span>Sort</span><select id="sort"><option value="title">Title, A to Z</option><option value="newest" selected>Newest first</option></select></label><button id="clear-filters" class="button button-secondary clear-filters">Clear filters</button></div><div class="table-wrap"><table class="prompt-table prompt-overview"><thead><tr><th>Workflow</th><th>Codex skill</th><th>Category</th><th>Creator</th><th>Updated</th><th><span class="sr-only">View details</span></th></tr></thead><tbody id="prompt-list"></tbody></table></div></div></section>');

  const dismissNotice = document.querySelector("#dismiss-submission-notice");
  if (dismissNotice) dismissNotice.addEventListener("click", () => {
    document.querySelector("#submission-notice")?.remove();
    const query = new URLSearchParams(window.location.search);
    query.delete("submission");
    query.delete("record");
    window.history.replaceState({}, "", window.location.pathname + (query.size ? "?" + query.toString() : ""));
  });

  const search = document.querySelector("#search");
  const category = document.querySelector("#category");
  const creator = document.querySelector("#creator");
  const sort = document.querySelector("#sort");
  const count = document.querySelector("#result-count");
  const list = document.querySelector("#prompt-list");
  const update = () => {
    const visible = prompts.filter((record) => (!category.value || record.category === category.value) && (!creator.value || creatorKey(record) === creator.value) && (!search.value || fullText(record).includes(search.value.toLowerCase()))).sort((left, right) => sort.value === "newest" ? String(right.lastReviewed || "").localeCompare(String(left.lastReviewed || "")) : String(left.title).localeCompare(String(right.title)));
    count.textContent = visible.length + " of " + prompts.length + " prompts";
    list.innerHTML = visible.length ? visible.map((record) => {
      const contactName = cleanText(record.contactName).trim() || "Not provided";
      const contactEmail = cleanText(record.contactEmail).trim();
      const creatorCell = '<span class="creator-name">' + escapeHtml(contactName) + '</span>' + (contactEmail ? '<a class="creator-email" href="mailto:' + escapeHtml(contactEmail) + '">' + escapeHtml(contactEmail) + "</a>" : '<span class="creator-email">Not provided</span>');
      const skillCell = record.skillPath ? '<code>$' + escapeHtml(record.skillName || skillSlug(record.title)) + '</code><a class="skill-download-link" href="' + escapeHtml(rawFileUrl(record.skillPath)) + '" download="' + escapeHtml((record.skillName || skillSlug(record.title)) + '-SKILL.md') + '">Download SKILL.md</a>' : '<span class="skill-status">Prompt only</span>';
      return '<tr><td><a class="prompt-title" href="' + href("prompt", { prompt: record.path }) + '">' + escapeHtml(record.title) + '</a></td><td class="skill-cell">' + skillCell + '</td><td class="category-cell">' + escapeHtml(name(record.category)) + '</td><td class="creator-cell">' + creatorCell + '</td><td class="updated-date">' + escapeHtml(displayDate(record.lastReviewed)) + '</td><td><a class="details-button" href="' + href("prompt", { prompt: record.path }) + '">View details</a></td></tr>';
    }).join("") : '<tr><td colspan="6"><div class="empty-state">No prompts or skills match the selected filters.</div></td></tr>';
  };
  [search, category, creator, sort].forEach((element) => element.addEventListener(element === search ? "input" : "change", update));
  document.querySelector("#clear-filters").addEventListener("click", () => { search.value = ""; category.value = ""; creator.value = ""; sort.value = "newest"; update(); });
  update();
}

function prompt(record) {
  const inputs = requiredInputsTable(record.requiredInputs);
  const headerDescription = record.useCase || record.description || "Reusable prompt record.";
  const source = record.sourceIssue ? '<a href="' + escapeHtml(record.sourceIssue) + '" target="_blank" rel="noreferrer">Original form submission</a>' : "Not provided.";
  const markdownRecordUrl = repositoryUrl + "/blob/main/" + record.path.split("/").map(encodeURIComponent).join("/");
  const skillName = record.skillName || skillSlug(record.title);
  const skillAvailable = Boolean(record.skillPath);
  const section = (heading, description, content) => '<section><h2>' + heading + '</h2>' + (description ? '<p class="field-description record-field-description">' + description + "</p>" : "") + content + "</section>";
  const paragraph = (value) => formattedContent(value);
  const promptText = record.promptText || "";
  const promptSection = '<section><div class="prompt-heading"><div><h2>Copy prompt text</h2><p class="section-description">Copy this text when you want to run the workflow once in your current Codex chat. It does not save the workflow for later.</p></div><button id="copy-prompt" class="button button-secondary button-small" type="button"' + (promptText ? "" : " disabled") + '>Copy prompt</button></div><p id="copy-prompt-status" class="copy-prompt-status" aria-live="polite"></p><pre><code>' + escapeHtml(promptText || "No prompt text provided.") + "</code></pre></section>";
  const skillSection = skillAvailable ? '<section class="skill-install"><div class="skill-install-heading"><div><p class="eyebrow">Codex skill</p><h2>Download and install this skill</h2><p>A skill keeps this workflow available across future Codex work. Download the file, then place it in your local Codex skills folder.</p></div><button id="download-skill" class="button" type="button">Download SKILL.md</button></div><dl class="definition-list"><div><dt>Skill name</dt><dd><code>$' + escapeHtml(skillName) + '</code></dd></div><div><dt>Purpose and use case</dt><dd>' + escapeHtml(record.skillDescription || headerDescription) + '</dd></div><div><dt>Prerequisites</dt><dd>' + formattedContent(record.prerequisites || "None provided.") + (record.prerequisiteLink ? '<p><a href="' + escapeHtml(record.prerequisiteLink) + '" target="_blank" rel="noreferrer">Open prerequisite instructions</a></p>' : "") + '</dd></div></dl><ol class="skill-install-steps"><li>Download <code>SKILL.md</code>.</li><li>Create <code>~/.agents/skills/' + escapeHtml(skillName) + '/</code> on your computer and save the downloaded file there as <code>SKILL.md</code>.</li><li>Restart Codex if the skill does not appear.</li><li>In a new Codex task, type <code>$' + escapeHtml(skillName) + '</code>, or make a request that matches the skill description.</li></ol><p id="download-skill-status" class="copy-prompt-status" aria-live="polite"></p></section>' : '<section class="skill-install skill-install-unavailable"><p class="eyebrow">Codex skill</p><h2>Skill download unavailable</h2><p>This legacy record has prompt text only. Its skill file has not been generated yet.</p></section>';
  const details = '<div class="detail-table"><table><tbody><tr><th>Category</th><td>' + name(record.category) + '</td></tr><tr><th>Last updated</th><td>' + escapeHtml(record.lastReviewed || "Not provided") + '</td></tr><tr><th>Markdown record</th><td><a href="' + escapeHtml(markdownRecordUrl) + '" target="_blank" rel="noreferrer"><code>' + escapeHtml(record.path) + "</code></a></td></tr>" + (skillAvailable ? '<tr><th>Skill file</th><td><a href="' + escapeHtml(repositoryUrl + "/blob/main/" + record.skillPath.split("/").map(encodeURIComponent).join("/")) + '" target="_blank" rel="noreferrer"><code>' + escapeHtml(record.skillPath) + "</code></a></td></tr>" : "") + "</tbody></table></div>";
  const additionalNotes = [record.additionalInstructionsNotes, record.postExecutionSteps || record.nextSteps].filter(Boolean).join("\n\n");
  const additionalLink = record.additionalNotesLink || record.postExecutionLink;
  app.innerHTML = page("Prompt and skill record", escapeHtml(record.title), headerDescription, '<section class="container record-layout"><div class="record-actions"><a class="button button-secondary" href="' + href("library") + '">Back to library</a><a class="button" href="' + publisherHref("edit", { prompt: record.path }) + '">Edit this workflow</a></div><article class="record-content">' + workflowChoiceBlurb() + skillSection + section("Purpose and use case", "Explains the problem this workflow solves, its intended audience, and when Codex should select the paired skill.", paragraph(record.useCase || record.skillDescription || record.description)) + section("Prerequisites", "Work, access, setup, files, or decisions required before running this workflow.", paragraph(record.prerequisites || "No prerequisites provided.") + (record.prerequisiteLink ? '<p><a href="' + escapeHtml(record.prerequisiteLink) + '" target="_blank" rel="noreferrer">Open prerequisite instructions</a></p>' : "")) + section("Required inputs", "Files, links, context, or values needed before the workflow runs.", inputs) + section("Expected output", "The result Codex should produce and the checks that confirm a usable outcome.", paragraph(record.expectedOutput)) + promptSection + section("Additional Instructions and Pre-Run Notes", "Constraints, setup guidance, validation checks, edge cases, and follow-up work.", paragraph(additionalNotes || "No additional instructions provided.") + (additionalLink ? '<p><a href="' + escapeHtml(additionalLink) + '" target="_blank" rel="noreferrer">Open related instructions</a></p>' : "")) + section("Contact", "The person to contact with questions about this workflow.", '<dl class="definition-list"><div><dt>Name</dt><dd>' + escapeHtml(record.contactName || "Not provided.") + "</dd></div><div><dt>Email</dt><dd>" + escapeHtml(record.contactEmail || "Not provided.") + "</dd></div></dl>") + section("Source", "Supporting documentation or original submission context.", "<p>" + source + "</p>") + section("Record details", "Repository locations and publication information.", details) + "</article></section>", true);
  const copyButton = document.querySelector("#copy-prompt");
  const copyStatus = document.querySelector("#copy-prompt-status");
  if (copyButton && promptText) {
    copyButton.addEventListener("click", async () => {
      try {
        await copyText(promptText);
        copyButton.textContent = "Copied";
        copyStatus.textContent = "Prompt copied to the clipboard.";
        window.setTimeout(() => { copyButton.textContent = "Copy prompt"; }, 1800);
      } catch {
        copyStatus.textContent = "Copy failed. Select the prompt text and copy it manually.";
      }
    });
  }
  const downloadButton = document.querySelector("#download-skill");
  const downloadStatus = document.querySelector("#download-skill-status");
  if (downloadButton && skillAvailable) {
    downloadButton.addEventListener("click", async () => {
      try {
        await downloadSkill(record);
        downloadButton.textContent = "Downloaded";
        downloadStatus.textContent = "Save the downloaded file as ~/.agents/skills/" + skillName + "/SKILL.md, then restart Codex if needed.";
        window.setTimeout(() => { downloadButton.textContent = "Download SKILL.md"; }, 1800);
      } catch (error) {
        downloadStatus.textContent = error.message || "Download failed. Open the skill file from Record details instead.";
      }
    });
  }
}

function input(label, key, value, rows, description, options = {}) {
  const required = options.required ? " required" : "";
  const pattern = options.pattern ? ' pattern="' + escapeHtml(options.pattern) + '"' : "";
  const readonly = options.readonly ? " readonly" : "";
  const control = rows ? '<textarea id="' + key + '" name="' + key + '" rows="' + rows + '"' + required + readonly + '>' + escapeHtml(value || "") + "</textarea>" : '<input id="' + key + '" name="' + key + '" value="' + escapeHtml(value || "") + '"' + pattern + required + readonly + '>';
  return '<label class="form-field" for="' + key + '"><span>' + label + (options.required ? ' <strong class="required-label">Required</strong>' : "") + "</span><small class=\"field-description\">" + escapeHtml(description) + "</small>" + control + "</label>";
}

function linkField(title, key, value, description) {
  const visible = value ? "" : " hidden";
  const expanded = value ? "true" : "false";
  return '<div class="form-field link-field"><div class="field-title-row"><span>' + title + '</span><button class="text-button add-link-button" type="button" data-link-target="' + key + '" aria-expanded="' + expanded + '">Add a link</button></div><small class="field-description">' + escapeHtml(description) + '</small><div id="' + key + '-panel" class="link-input-panel"' + visible + '><input id="' + key + '" name="' + key + '" type="url" value="' + escapeHtml(value || "") + '" placeholder="https://..."><button class="text-button remove-link-button" type="button" data-link-target="' + key + '">Remove link</button></div></div>';
}

function requiredInputsField(values) {
  const inputs = requiredInputList(values);
  const rows = (inputs.length ? inputs : [""]).map((item, index) => '<tr><td><input name="requiredInput" value="' + escapeHtml(item) + '" placeholder="Required input ' + (index + 1) + '"></td><td><button class="text-button remove-input-button" type="button"' + (inputs.length <= 1 ? " disabled" : "") + '>Remove</button></td></tr>').join("");
  return '<fieldset class="form-field required-inputs-field"><legend>Required inputs</legend><small class="field-description">Files, links, context, or values Codex needs before the workflow runs. Add one required input per row. Markdown renders in the published table, including headings, bold text, inline code, and links.</small><div class="required-inputs-editor"><table><thead><tr><th>Required input</th><th><span class="sr-only">Row actions</span></th></tr></thead><tbody id="required-input-rows">' + rows + '</tbody></table><button id="add-required-input" class="button button-secondary button-small" type="button">Add required input</button></div></fieldset>';
}

function promptTextField(value) {
  return '<fieldset class="form-field prompt-text-field"><legend>Skill instructions and prompt text <strong class="required-label">Required</strong></legend><small class="field-description">The complete workflow Codex should follow. It stays unchanged in the copyable prompt and becomes the instruction section of the generated <code>SKILL.md</code> file. Paste text or upload a plain-text or Markdown file.</small><div class="prompt-text-source" role="radiogroup" aria-label="Prompt text source"><label><input type="radio" name="promptTextSource" value="paste" checked> Paste text</label><label><input type="radio" name="promptTextSource" value="upload"> Upload file</label></div><div id="prompt-text-paste"><textarea id="promptText" name="promptText" rows="16" required>' + escapeHtml(value || "") + '</textarea></div><div id="prompt-text-upload" hidden><input id="promptTextFile" name="promptTextFile" type="file" accept=".txt,.md,.markdown,text/plain,text/markdown"><small class="file-help">Accepted file types: .txt, .md, or .markdown. Maximum size: 60 KB.</small></div></fieldset>';
}

function form(record) {
  const editing = Boolean(record);
  const draft = editing ? null : readSubmissionDraft();
  const value = (key, fallback = "") => draft && Object.hasOwn(draft, key) ? draft[key] : fallback;
  const existingRequiredInputs = record?.requiredInputs || [];
  const selectedCategory = value("category", record?.category || "");
  const categoryOptions = categories.map((category) => '<option value="' + category + '"' + (selectedCategory === category ? " selected" : "") + ">" + name(category) + "</option>").join("");
  const draftMessage = draft ? "Your previous entry was restored after sign-in. Review the fields, then select Publish workflow." : "";
  const skillName = value("skillName", record?.skillName || skillSlug(record?.title));
  const skillDescription = value("skillDescription", record?.skillDescription || record?.useCase || record?.description);
  const additionalNotes = value("additionalNotes", [record?.additionalInstructionsNotes, record?.postExecutionSteps || record?.nextSteps].filter(Boolean).join("\n\n"));
  const sharingStandard = '<article class="form-intro"><h2>' + (editing ? "Update process" : "Create a prompt and Codex skill") + '</h2><p>This submission creates two files: a readable Markdown workflow record for the library and a reusable <code>SKILL.md</code> file for Codex. The same workflow instructions power both outputs.</p><p>Fields marked Required create a valid Codex skill. The remaining fields make the workflow easier to prepare, validate, and continue after execution.</p><p>Remove customer data, credentials, personal data, internal identifiers, and non-public source material. Use placeholders for variable information.</p><div class="form-formatting-note"><strong>Formatting</strong><p>Long-form fields support Markdown headings, bullets, bold text, and links. Prompt text is preserved exactly for copying and is placed inside the generated skill file.</p></div><a class="text-link-dark" href="' + href("contribute") + '">Read the contribution guide</a></article>';
  const categoryField = '<label class="form-field" for="category"><span>Category</span><small class="field-description">The work area used to organize and filter this record.</small><select id="category" name="category"><option value="">Select a category</option>' + categoryOptions + "</select></label>";
  const fields = input("Title", "title", value("title", record?.title), 0, "A concise, action-oriented name for the workflow.", { required: true })
    + categoryField
    + input("Codex skill name", "skillName", skillName, 0, editing && record?.skillPath ? "This stable name is locked after publishing. Users type it after a dollar sign, for example $capacity-analysis." : "A stable lowercase name with hyphens. Users type this after a dollar sign, for example $capacity-analysis.", { required: true, pattern: "[a-z0-9]+(-[a-z0-9]+)*", readonly: editing && Boolean(record?.skillPath) })
    + input("Skill purpose and use case", "skillDescription", skillDescription, 5, "Explain the problem this workflow solves, its intended audience, and when Codex should select the skill. Begin with the task or trigger, then name the intended result.", { required: true })
    + input("Prerequisites", "prerequisites", value("prerequisites", record?.prerequisites), 5, "Work, access, setup, files, or decisions required before running this workflow. Enter None when no prerequisite exists.")
    + linkField("Prerequisite instructions", "prerequisiteLink", value("prerequisiteLink", record?.prerequisiteLink), "Optional link to the prompt, documentation, or runbook that explains the prerequisite.")
    + requiredInputsField(value("requiredInputs", existingRequiredInputs))
    + input("Expected output", "expectedOutput", value("expectedOutput", record?.expectedOutput), 5, "What Codex should produce and the checks that confirm a usable result.")
    + promptTextField(value("promptText", record?.promptText))
    + input("Additional Instructions and Pre-Run Notes", "additionalNotes", additionalNotes, 5, "Constraints, pre-run setup, validation checks, edge cases, follow-up work, and any other context.")
    + linkField("Related instructions", "additionalNotesLink", value("additionalNotesLink", record?.additionalNotesLink || record?.postExecutionLink), "Optional link to a related prompt, runbook, or documentation.")
    + input("Your name", "contactName", value("contactName", record?.contactName), 0, "The person to contact with questions about this record.")
    + input("Your work email", "contactEmail", value("contactEmail", record?.contactEmail), 0, "The work email for questions or feedback about this record.");
  app.innerHTML = page(editing ? "Workflow editor" : "Contribute", editing ? "Edit a prompt and skill" : "Submit a prompt and skill", editing ? "Update the Markdown record and its paired Codex skill together." : "Create a reader-friendly Markdown workflow record and a downloadable Codex skill from one form.", '<section class="container form-layout">' + sharingStandard + '<form id="prompt-form" class="prompt-form" data-path="' + escapeHtml(record?.path || "") + '" data-skill-path="' + escapeHtml(record?.skillPath || "") + '">' + fields + '<div class="form-actions"><button class="button" type="submit">' + (editing ? "Save workflow update" : "Publish prompt and skill") + '</button><a id="cancel-prompt-form" class="button button-secondary" href="' + (editing ? href("prompt", { prompt: record.path }) : href("library")) + '">Cancel</a></div><p id="submission-status" class="submission-status" aria-live="polite">' + escapeHtml(draftMessage) + "</p></form></section>");
  if (draft) document.querySelector("#cancel-prompt-form").addEventListener("click", clearSubmissionDraft);
  const promptTextPaste = document.querySelector("#prompt-text-paste");
  const promptTextUpload = document.querySelector("#prompt-text-upload");
  const promptTextArea = document.querySelector("#promptText");
  const promptTextFile = document.querySelector("#promptTextFile");
  const titleInput = document.querySelector("#title");
  const skillNameInput = document.querySelector("#skillName");
  const setPromptTextSource = () => {
    const uploadSelected = document.querySelector('input[name="promptTextSource"]:checked')?.value === "upload";
    promptTextPaste.hidden = uploadSelected;
    promptTextUpload.hidden = !uploadSelected;
    promptTextArea.disabled = uploadSelected;
    promptTextFile.disabled = !uploadSelected;
  };
  document.querySelectorAll('input[name="promptTextSource"]').forEach((option) => option.addEventListener("change", setPromptTextSource));
  setPromptTextSource();
  const formElement = document.querySelector("#prompt-form");
  const inputRows = document.querySelector("#required-input-rows");
  const refreshInputRows = () => {
    const rows = [...inputRows.querySelectorAll("tr")];
    rows.forEach((row) => { row.querySelector(".remove-input-button").disabled = rows.length === 1; });
  };
  const addInputRow = (value = "") => {
    const row = document.createElement("tr");
    row.innerHTML = '<td><input name="requiredInput" value="' + escapeHtml(value) + '" placeholder="Required input ' + (inputRows.children.length + 1) + '"></td><td><button class="text-button remove-input-button" type="button">Remove</button></td>';
    inputRows.append(row);
    refreshInputRows();
    row.querySelector("input").focus();
  };
  document.querySelector("#add-required-input").addEventListener("click", () => addInputRow());
  inputRows.addEventListener("click", (event) => {
    if (!event.target.matches(".remove-input-button")) return;
    event.target.closest("tr").remove();
    refreshInputRows();
  });
  refreshInputRows();
  document.querySelectorAll(".add-link-button, .remove-link-button").forEach((button) => button.addEventListener("click", () => {
    const key = button.dataset.linkTarget;
    const panel = document.querySelector("#" + key + "-panel");
    const addButton = document.querySelector('.add-link-button[data-link-target="' + key + '"]');
    const isOpening = panel.hidden;
    panel.hidden = !isOpening;
    addButton.textContent = isOpening ? "Hide link" : "Add a link";
    addButton.setAttribute("aria-expanded", String(isOpening));
    if (button.matches(".remove-link-button")) {
      document.querySelector("#" + key).value = "";
      panel.hidden = true;
      addButton.textContent = "Add a link";
      addButton.setAttribute("aria-expanded", "false");
    } else if (isOpening) {
      document.querySelector("#" + key).focus();
    }
  }));
  if (titleInput && skillNameInput && !editing) {
    titleInput.addEventListener("input", () => {
      if (!skillNameInput.dataset.edited) skillNameInput.value = skillSlug(titleInput.value);
    });
    skillNameInput.addEventListener("input", () => { skillNameInput.dataset.edited = "true"; });
  }
  formElement.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    data.requiredInputs = formData.getAll("requiredInput").map((value) => String(value).trim()).filter(Boolean);
    data.useCase = data.skillDescription;
    data.postExecutionSteps = "";
    data.postExecutionLink = "";
    data.existingPath = event.currentTarget.dataset.path;
    data.existingSkillPath = event.currentTarget.dataset.skillPath;
    const status = document.querySelector("#submission-status");
    const button = event.currentTarget.querySelector("button[type=submit]");
    button.disabled = true;
    status.textContent = "Publishing your Markdown record and Codex skill...";
    try {
      const uploadSelected = data.promptTextSource === "upload";
      const uploadedFile = data.promptTextFile;
      delete data.promptTextSource;
      delete data.promptTextFile;
      if (uploadSelected && uploadedFile && typeof uploadedFile.text === "function" && uploadedFile.size > 0) {
        if (!/\.(txt|md|markdown)$/i.test(uploadedFile.name)) throw new Error("Upload a .txt, .md, or .markdown file.");
        if (uploadedFile.size > 60 * 1024) throw new Error("Upload a file no larger than 60 KB.");
        data.promptText = await uploadedFile.text();
        if (data.promptText.length > 60000) throw new Error("Upload a file with 60,000 characters or fewer.");
      } else if (uploadSelected) {
        data.promptText = "";
      }
      const response = await fetch("/api/prompt-submissions", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json().catch(() => ({}));
      if (response.status === 401) {
        if (!editing) saveSubmissionDraft(data);
        status.textContent = "Sign-in is required. Your entry was saved in this browser and will be restored after sign-in.";
        const returnTo = window.location.pathname + window.location.search;
        window.location.assign("/auth/login?return_to=" + encodeURIComponent(returnTo));
        return;
      }
      if (!response.ok) throw new Error(result.error || "The workflow was not published.");
      if (!editing) clearSubmissionDraft();
      window.location.assign(libraryRedirect(result));
    } catch (error) {
      status.textContent = error.message || "The workflow was not published. Try again.";
      button.disabled = false;
    }
  });
}

function simpleMarkdown(text) {
  return escapeHtml(text).replace(/^### (.+)$/gm, "<h3>$1</h3>").replace(/^## (.+)$/gm, "<h2>$1</h2>").replace(/^# (.+)$/gm, "<h1>$1</h1>").replace(/^-\s+(.+)$/gm, "<li>$1</li>").replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br>");
}

async function documentPage(filePath, kicker, title, lead) {
  app.innerHTML = page(kicker, title, lead, '<section class="container document-section"><article id="document-content" class="document-content"><p>Loading document...</p></article></section>');
  const target = document.querySelector("#document-content");
  try {
    const response = await fetch(rawRepositoryUrl + "/" + filePath);
    if (!response.ok) throw new Error("Document unavailable");
    target.innerHTML = "<p>" + simpleMarkdown(await response.text()) + "</p>";
  } catch {
    target.innerHTML = '<p>Open the <a href="' + repositoryUrl + "/blob/main/" + filePath + '">GitHub version</a>.</p>';
  }
}

function render() {
  const query = new URLSearchParams(window.location.search);
  const view = query.get("view") || "home";
  const record = prompts.find((item) => item.path === query.get("prompt"));
  if (view === "library") library();
  else if (view === "readme") about();
  else if (view === "contribute") contributionGuide();
  else if (view === "submit") form();
  else if (view === "prompt" && record) prompt(record);
  else if (view === "edit" && record) form(record);
  else if (view === "prompt" || view === "edit") app.innerHTML = page("Prompt library", "Record not found", "This record is unavailable or the link is out of date.", '<section class="container fallback"><a class="button" href="' + href("library") + '">Back to library</a></section>');
  else home();
}

function initialize() {
  app = document.querySelector("#app");
  if (!app) return;
  const query = new URLSearchParams(window.location.search);
  if ((query.get("view") === "submit" || query.get("view") === "edit") && window.location.origin !== publishingServiceUrl) {
    window.location.replace(publishingServiceUrl + window.location.search);
    return;
  }
  fetch("catalog.json", { cache: "no-store" }).then((response) => response.ok ? response.json() : Promise.reject(new Error("Catalog unavailable"))).then((records) => { prompts = records; render(); }).catch(() => { app.innerHTML = page("Prompt library", "Catalog unavailable", "The prompt records did not load.", '<section class="container fallback"><a class="button" href="' + repositoryUrl + '/tree/main/prompts">Browse prompt records in GitHub</a></section>'); });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
else initialize();
window.addEventListener("popstate", () => { if (app) render(); });
