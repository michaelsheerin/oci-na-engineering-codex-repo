# sr access

## Purpose and use case

When a user needs to retrieve, validate, analyze, troubleshoot, or report on Oracle Service Requests (SRs), use this skill to extract SRs from notifications, retrieve SR details through the REST API, deduplicate and analyze the data, and create or update SR/OCID workbooks.

## Codex skill

- Skill name: sr-access
- Skill description: When a user needs to retrieve, validate, analyze, troubleshoot, or report on Oracle Service Requests (SRs), use this skill to extract SRs from notifications, retrieve SR details through the REST API, deduplicate and analyze the data, and create or update SR/OCID workbooks.
- Skill package: skill-packages/sr-access.zip

## Prerequisites

| Prerequisite |
| --- |
| Access to the SR notification source |
| Oracle SR REST API access and endpoint |
| Valid .env configuration and bearer token |
| Latest sr-access scripts/package |

## Required inputs

| Required input |
| --- |
| SR notification source |
| Target API endpoint/environment |
| Account/customer scope |

## Expected output and next steps

Produce a validated SR dataset and the requested SR analysis or reporting output using the latest available sr-access scripts. The workflow should extract unique SR numbers from the supplied notification source, retrieve detailed SR information from the configured Oracle SR REST API, remove duplicates while preserving the unique SR population, validate retrieval results and identify missing or incomplete records, run the applicable SR metrics and analysis, and add or update required SR attributes such as stuck reasons or other supported derived fields. When requested, create or update the SR/OCID workbook using the established structure. Report any retrieval failures, missing SRs, authentication or API issues, and data-quality anomalies. Clearly identify the source data, scope, execution date, assumptions, and limitations. The final result should be internally consistent, contain no unintended duplicates, reconcile the input SR population with retrieved records, and clearly distinguish retrieved, derived, and manually provided values.

## Additional Instructions and Post-Run Notes

Always use the latest version of the SR workflow and available custom scripts, and do not manually recreate functionality that an existing script already supports. Treat the SR notification source as the starting point for determining the SR population unless the user provides another authoritative list. Preserve the original SR numbers while normalizing and deduplicating them. Use the configured API endpoint and do not hardcode any customer- or environment-specific endpoint. Keep credentials out of generated artifacts and mask tokens or secrets in logs and error messages. When API calls return partial results or errors, clearly distinguish successfully retrieved SRs, SRs not found or not returned, and SRs affected by authentication, authorization, connectivity, throttling, or other API errors. Before producing a workbook or report, validate record counts, uniqueness, required fields, and reconciliation between the source SR list and retrieved dataset. Use the established scripts for retrieval, deduplication, analysis, workbook creation or updates, missing SR handling, stuck-reason handling, and troubleshooting. When multiple scripts can perform the same task, use the established script designed for that operation and preserve its expected inputs and outputs. Do not overwrite an existing workbook or source dataset without determining whether the requested action is an update, append, replacement, or new output. Document assumptions, exceptions, and unresolved data issues so downstream users can distinguish workflow limitations from actual SR conditions.

## Skill package

This workflow is delivered as a downloadable skill package. Download and extract the package before installing the included skill.

- Package file: skill-packages/sr-access.zip
- Original filename: sr-access.zip
- Package size: 38648 bytes
- SHA-256: 60a6533d068f968604091cf748043cbe88295782521072676eefc67c1a1ec5f5
- Contents:
  - .env
  - .env.example
  - .gitignore
  - agents/openai.yaml
  - HOW_TO_USE_SR_ANALYSIS.md
  - inputs/sr_numbers.example.txt
  - prepare_shareable_package.ps1
  - scripts/add_manual_sr_ocid_entry.ps1
  - scripts/add_missing_srs_to_desktop_workbook.py
  - scripts/add_stuck_reason_column.ps1
  - scripts/analyze_sr_metrics.py
  - scripts/create_sr_ocid_excel.ps1
  - scripts/extract_sr_numbers_from_workbook.py
  - scripts/extract_union_srs.py
  - scripts/fetch_sr_details.py
  - scripts/seed_details_for_union.py
  - scripts/update_requested_sr_workbook.ps1
  - scripts/write_sr_workbook.ps1
  - SKILL.md

## Contact

- Name: Payal Sharma
- Email: payal.sh.sharma@oracle.com





<!-- prompt-metadata
title: "sr access"
description: "When a user needs to retrieve, validate, analyze, troubleshoot, or report on Oracle Service Requests (SRs), use this skill to extract SRs from notifications, retrieve SR details through the REST API, deduplicate and analyze the data, and cr"
category: "analysis"
tags: []
required_inputs: ["SR notification source","Target API endpoint/environment","Account/customer scope"]
expected_output: "Produce a validated SR dataset and the requested SR analysis or reporting output using the latest available sr-access scripts. The workflow should extract unique SR numbers from the supplied notification source, retrieve detailed SR information from the configured Oracle SR REST API, remove duplicates while preserving the unique SR population, validate retrieval results and identify missing or incomplete records, run the applicable SR metrics and analysis, and add or update required SR attributes such as stuck reasons or other supported derived fields. When requested, create or update the SR/OCID workbook using the established structure. Report any retrieval failures, missing SRs, authentication or API issues, and data-quality anomalies. Clearly identify the source data, scope, execution date, assumptions, and limitations. The final result should be internally consistent, contain no unintended duplicates, reconcile the input SR population with retrieved records, and clearly distinguish retrieved, derived, and manually provided values."
next_steps: ""
additional_instructions_notes: "Always use the latest version of the SR workflow and available custom scripts, and do not manually recreate functionality that an existing script already supports. Treat the SR notification source as the starting point for determining the SR population unless the user provides another authoritative list. Preserve the original SR numbers while normalizing and deduplicating them. Use the configured API endpoint and do not hardcode any customer- or environment-specific endpoint. Keep credentials out of generated artifacts and mask tokens or secrets in logs and error messages. When API calls return partial results or errors, clearly distinguish successfully retrieved SRs, SRs not found or not returned, and SRs affected by authentication, authorization, connectivity, throttling, or other API errors. Before producing a workbook or report, validate record counts, uniqueness, required fields, and reconciliation between the source SR list and retrieved dataset. Use the established scripts for retrieval, deduplication, analysis, workbook creation or updates, missing SR handling, stuck-reason handling, and troubleshooting. When multiple scripts can perform the same task, use the established script designed for that operation and preserve its expected inputs and outputs. Do not overwrite an existing workbook or source dataset without determining whether the requested action is an update, append, replacement, or new output. Document assumptions, exceptions, and unresolved data issues so downstream users can distinguish workflow limitations from actual SR conditions."
additional_instructions_link: ""
skill_name: "sr-access"
skill_description: "When a user needs to retrieve, validate, analyze, troubleshoot, or report on Oracle Service Requests (SRs), use this skill to extract SRs from notifications, retrieve SR details through the REST API, deduplicate and analyze the data, and create or update SR/OCID workbooks."
skill_delivery: "package"
skill_path: ""
skill_package_path: "skill-packages/sr-access.zip"
skill_package_name: "sr-access.zip"
skill_package_size: 38648
skill_package_sha256: "60a6533d068f968604091cf748043cbe88295782521072676eefc67c1a1ec5f5"
skill_package_contents: [".env",".env.example",".gitignore","agents/openai.yaml","HOW_TO_USE_SR_ANALYSIS.md","inputs/sr_numbers.example.txt","prepare_shareable_package.ps1","scripts/add_manual_sr_ocid_entry.ps1","scripts/add_missing_srs_to_desktop_workbook.py","scripts/add_stuck_reason_column.ps1","scripts/analyze_sr_metrics.py","scripts/create_sr_ocid_excel.ps1","scripts/extract_sr_numbers_from_workbook.py","scripts/extract_union_srs.py","scripts/fetch_sr_details.py","scripts/seed_details_for_union.py","scripts/update_requested_sr_workbook.ps1","scripts/write_sr_workbook.ps1","SKILL.md"]
prerequisites: ["Access to the SR notification source","Oracle SR REST API access and endpoint","Valid .env configuration and bearer token","Latest sr-access scripts/package"]
prerequisite_link: ""
contact_name: "Payal Sharma"
contact_email: "payal.sh.sharma@oracle.com"
last_reviewed: "2026-10-06"
-->