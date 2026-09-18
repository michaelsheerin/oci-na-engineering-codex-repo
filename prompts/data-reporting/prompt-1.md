# Generate Gold Standard Rate Card for CPQ Reconciliation

## Purpose and use case

This prompt establishes a local Gold Standard Rate Card from a previously validated CPQ quote. This approved CPQ baseline creates a consistent reference point for reconciliation analysis of future CPQ quotes. In large accounts with many ODs, Addendums, custom-SKUs or contract language, SPA/SPM/CPQ can often and repeatedly produce Net Unit Price/Selling Price errors. This prompt produces a local standard that is isolated from these computing errors. 
The prompt also compares the CPQ standard to SPA Rate Card if additional manual validation is needed.

## Codex skill

- Skill name: `generate-gold-standard-rate-card-for-cpq-reconciliation`
- Skill description: This prompt establishes a local Gold Standard Rate Card from a previously validated CPQ quote. This approved CPQ baseline creates a consistent reference point for reconciliation analysis of future CPQ quotes. In large accounts with many ODs, Addendums, custom-SKUs or contract language, SPA/SPM/CPQ c
- Skill file: `skills/generate-gold-standard-rate-card-for-cpq-reconciliation/SKILL.md`

## Prerequisites

| Prerequisite |
| --- |
| CPQ Access |

## Required inputs

| Required input |
| --- |
| CPQ Link of Previously Validated Rate Card |
| File Path of CSV Extract from SPA Rate Card |
| Output folder (optional) |

## Expected output and next steps

Excel file called Gold-Standard-Rate-Card.xlsx with following tabs:

<html xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:dt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882"
xmlns="http://www.w3.org/TR/REC-html40">

<head>

<meta name=ProgId content=OneNote.File>
<meta name=Generator content="Microsoft OneNote 15">
</head>

<body lang=en-US style='font-family:Calibri;font-size:11.0pt'>
<!--StartFragment-->

<div style='direction:ltr'>


Excel Tabs | Content
-- | --
CPQ-Gold-Standard | Read-only   source extraction from the trusted CPQ quote. Includes Product Category, SKU,   description, metric, discount fields, quantity, list price, selling price,   overage price, and LOA.
SPA-Rate-Card_YYYY-MM-DD | SPA   source data after zero net-price rows are removed and remaining rows are   sorted by Net Unit Price in ascending order. The date reflects the source   file Date Modified value.
CPQ-Gold_to_SPA   Validation | Editable   comparison view. Includes SKU, Product Name, Product Category,   CPQ-Selling-Price, Rate-Card-Net-Price, and CPQ-SPA-Difference. This will be   manually evaluated by sales teams to reconcile differences and edit   CPQ-Gold-Standard tab.



</div>

<!--EndFragment-->
</body>

</html>

## Additional Instructions and Post-Run Notes

Once complete, you will have a local Gold-Standard Rate Card to compare and reconcile future CPQ quotes. See the link below for the prompt to identify those discrepancies and provide reconciliation suggestions.
If you want to validate this CPQ quote against the SPA Rate Card, see the last tab in the file for a list of SKUs with net unit price discrepancies. You must then manually assess (e.g. via ODs, Addendums, etc.) which net unit price is accurate and adjust the Gold-Standard tab accordingly.

Related instructions: https://oci-strategic-install-prompt-library.msheerin01.workers.dev/?view=prompt&prompt=prompts%2Fdata-reporting%2Fprompt-2.md

## Prompt text

```text
Create a local Gold Standard Rate Card reconciliation workbook.

Inputs (or see Required Inputs above).

SPA Rate Card file:
[PASTE LOCAL SPA RATE CARD FILE PATH]

CPQ Rate Card source:
[PASTE LINK TO A MANUALLY VALIDATED CPQ RATE CARD]

Output directory:
[PASTE OUTPUT DIRECTORY]

Purpose

Create a static local CPQ Gold Standard baseline and compare its net unit prices against the SPA Rate Card. Net unit price is the controlling reconciliation value. List-price changes, discount changes, credits, and SKU launches must not alter the contracted net unit price without account-team approval.

SPA validation uses the lowest nonzero Net Unit Price for each SKU because the SPA Rate Card is first purged of zero-price rows and then sorted by Net Unit Price in ascending order. CPQ zero-selling-price records must remain in the CPQ Gold Standard and Validation tabs.

Scope and controls

1. Treat the supplied CPQ as a manually validated baseline with high confidence.
2. Do not edit, save, change, or submit anything in CPQ. Read and document data only.
3. Do not delete CPQ rows with zero Unit Selling Price.
4. Do not infer a missing value. Preserve source values exactly unless an instruction below requires rounding or filtering.
5. Use Aptos Narrow, size 11. Avoid decorative formatting, borders, and shading. Use standard Excel tables only where filters are required.
6. Do not place an @ symbol before any Excel formula.
7. Use VLOOKUP formulas for compatibility with Excel versions where XLOOKUP returns #NAME?.
8. Save the final workbook as Gold-Standard-Rate-Card.xlsx in the requested output directory.

CPQ extraction

1. Open the supplied CPQ link.
2. Navigate to Discounts > Rate Cards.
3. Expand All.
4. Extract every SKU-level row. Do not include category-header rows as standalone SKU records.
5. Carry the current Product Category value down to every SKU until the next category header.
6. Export these fields in this order:

   Product Category
   SKU
   Usage Item Description
   Metric
   Discount Category
   Unit Qty/Range
   Unit List Price
   Draft At Discount %
   Unit Selling Price
   Overage Selling Price
   LOA

7. Preserve all SKU rows, including rows where Unit Selling Price equals 0.

Workbook structure

Create these worksheets in this order:

1. CPQ-Gold-Standard
2. SPA-Rate-Card_<date-of-download>
3. CPQ-Gold_to_SPA Validation

Use the SPA source file’s Date Modified value for <date-of-download>, formatted as YYYY-MM-DD.

CPQ-Gold-Standard worksheet

1. Load the complete CPQ export into CPQ-Gold-Standard.
2. Retain every extracted field and every SKU row.
3. Retain zero Unit Selling Price rows.
4. Confirm Product Category is populated for every SKU row.
5. Keep SKU values as text.

SPA Rate Card worksheet

1. Load the complete SPA Rate Card file into SPA-Rate-Card_<date-of-download>.
2. Identify the Part Num column and Net Unit Price (USD) column by header name. In the standard SPA export, these are Part Num in column D and Net Unit Price (USD) in column H.
3. Delete only SPA rows where Net Unit Price equals 0.
4. Sort the remaining SPA rows by Net Unit Price in ascending order.
5. Do not delete nonzero duplicate Part Num rows.
6. This sort order ensures VLOOKUP retrieves the lowest nonzero SPA net price for each SKU.

CPQ-Gold_to_SPA Validation worksheet

Create one Validation row for every CPQ-Gold-Standard SKU row, including rows where CPQ Unit Selling Price equals 0.

Use these columns in this exact order:

1. SKU
2. Product Name
3. Metric
4. Unit Qty/Range
5. Product Category
6. CPQ-Selling-Price
7. Rate-Card-Net-Price
8. CPQ-SPA-Difference

Source mapping:

SKU = CPQ-Gold-Standard SKU
Product Name = CPQ-Gold-Standard Usage Item Description
Metric = CPQ-Gold-Standard Metric
Unit Qty/Range = CPQ-Gold-Standard Unit Qty/Range
Product Category = CPQ-Gold-Standard Product Category
CPQ-Selling-Price = CPQ-Gold-Standard Unit Selling Price, rounded to four decimal places

Rate-Card-Net-Price formula:

=IFERROR(VLOOKUP(A2,'SPA-Rate-Card_<date-of-download>'!$D$2:$H$<last-SPA-row>,5,FALSE),"SKU not found")

CPQ-SPA-Difference formula:

=IFERROR(F2-G2,"")

Fill both formulas through the final Validation row.

Apply a standard Excel table to the Validation data. Apply an Excel filter to CPQ-SPA-Difference that excludes 0 values. Do not delete filtered rows. The filter must remain editable in Excel.

Accuracy checks

1. CPQ-Gold-Standard row count must equal the Validation row count.
2. Count zero Unit Selling Price rows in CPQ-Gold-Standard and confirm the same count appears in Validation.
3. Confirm Metric, Unit Qty/Range, Product Category, Product Name, SKU, and CPQ-Selling-Price match the CPQ-Gold-Standard source row by row.
4. Confirm SPA zero-price rows were removed before sorting and lookup.
5. Confirm the SPA Rate Card remains sorted by Net Unit Price ascending.
6. Scan for #REF!, #DIV/0!, #VALUE!, #NAME?, and #N/A errors.
7. Do not replace SKU not found exceptions with fabricated values. Leave them visible for account-team review.
8. Spot-check at least ten records across multiple Product Categories, including one CPQ zero-selling-price record.
9. Confirm the Validation filter excludes only zero CPQ-SPA-Difference results and does not delete data.

Deliverable

Save Gold-Standard-Rate-Card.xlsx in the requested output directory. Report:

- CPQ Gold Standard SKU-row count
- SPA rows removed for zero Net Unit Price
- Validation row count
- CPQ zero-selling-price row count retained in Validation
- Number of SKU not found exceptions
- Number of nonzero CPQ-SPA differences
```

## Contact

- Name: Michael Sheerin
- Email: michael.sheerin@oracle.com

## Source

Submitted directly from the Prompt Library.

## Record details

| Field | Value |
| --- | --- |
| Category | data-reporting |
| Submitted | 2026-09-18 |

<!-- prompt-metadata
title: "Generate Gold Standard Rate Card for CPQ Reconciliation"
description: "This prompt establishes a local Gold Standard Rate Card from a previously validated CPQ quote. This approved CPQ baseline creates a consistent reference point for reconciliation analysis of future CPQ quotes. In large accounts with many ODs"
category: "data-reporting"
tags: []
required_inputs: ["CPQ Link of Previously Validated Rate Card","File Path of CSV Extract from SPA Rate Card","Output folder (optional)"]
expected_output: "Excel file called Gold-Standard-Rate-Card.xlsx with following tabs:\n\n<html xmlns:o=\"urn:schemas-microsoft-com:office:office\"\nxmlns:dt=\"uuid:C2F41010-65B3-11d1-A29F-00AA00C14882\"\nxmlns=\"http://www.w3.org/TR/REC-html40\">\n\n<head>\n\n<meta name=ProgId content=OneNote.File>\n<meta name=Generator content=\"Microsoft OneNote 15\">\n</head>\n\n<body lang=en-US style='font-family:Calibri;font-size:11.0pt'>\n<!--StartFragment-->\n\n<div style='direction:ltr'>\n\n\nExcel Tabs | Content\n-- | --\nCPQ-Gold-Standard | Read-only   source extraction from the trusted CPQ quote. Includes Product Category, SKU,   description, metric, discount fields, quantity, list price, selling price,   overage price, and LOA.\nSPA-Rate-Card_YYYY-MM-DD | SPA   source data after zero net-price rows are removed and remaining rows are   sorted by Net Unit Price in ascending order. The date reflects the source   file Date Modified value.\nCPQ-Gold_to_SPA   Validation | Editable   comparison view. Includes SKU, Product Name, Product Category,   CPQ-Selling-Price, Rate-Card-Net-Price, and CPQ-SPA-Difference. This will be   manually evaluated by sales teams to reconcile differences and edit   CPQ-Gold-Standard tab.\n\n\n\n</div>\n\n<!--EndFragment-->\n</body>\n\n</html>"
next_steps: ""
additional_instructions_notes: "Once complete, you will have a local Gold-Standard Rate Card to compare and reconcile future CPQ quotes. See the link below for the prompt to identify those discrepancies and provide reconciliation suggestions.\nIf you want to validate this CPQ quote against the SPA Rate Card, see the last tab in the file for a list of SKUs with net unit price discrepancies. You must then manually assess (e.g. via ODs, Addendums, etc.) which net unit price is accurate and adjust the Gold-Standard tab accordingly."
additional_instructions_link: "https://oci-strategic-install-prompt-library.msheerin01.workers.dev/?view=prompt&prompt=prompts%2Fdata-reporting%2Fprompt-2.md"
skill_name: "generate-gold-standard-rate-card-for-cpq-reconciliation"
skill_description: "This prompt establishes a local Gold Standard Rate Card from a previously validated CPQ quote. This approved CPQ baseline creates a consistent reference point for reconciliation analysis of future CPQ quotes. In large accounts with many ODs, Addendums, custom-SKUs or contract language, SPA/SPM/CPQ c"
skill_path: "skills/generate-gold-standard-rate-card-for-cpq-reconciliation/SKILL.md"
prerequisites: ["CPQ Access"]
prerequisite_link: ""
contact_name: "Michael Sheerin"
contact_email: "michael.sheerin@oracle.com"
source_issue: ""
last_reviewed: "2026-09-18"
-->
