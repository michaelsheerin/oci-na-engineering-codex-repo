---
name: cpq-rate-card-reconciliation-based-on-gold-standard-rate-card
description: "This prompt reconciles a newly generated CPQ rate card against the approved local Gold Standard Rate Card created in Prompt 'Generate Gold Standard Rate Card for CPQ Reconciliation'. This provides a repeatable validation process for future quotes and identifies whether the current CPQ Unit Selling"
---

# CPQ Rate Card Reconciliation based on Gold-Standard-Rate-Card

Use this skill when the user's request matches the skill description. Follow the user's direct instructions when they conflict with this workflow.

## Required input form

Before executing this workflow, check whether every required input below already has a clear value in the user's request or the current conversation.

If one or more values are missing, call `strategic_install_required_input_form.collect_required_inputs` once with only the entries below that are still missing. Preserve each label and required setting:

```json
{
  "message": "Complete the required inputs before this skill continues.",
  "inputs": [
    {
      "label": "Path for Gold-Standard-Rate-Card file generated in the prerequisite prompt",
      "required": true
    },
    {
      "label": "CPQ Link to the current rate card requiring reconciliation",
      "required": true
    },
    {
      "label": "Output folder (optional)",
      "required": false
    }
  ]
}
```

Tell the user the form collects the values needed for this workflow. After a successful submission, use the returned values as the workflow inputs and continue. If the user cancels, declines, or leaves a required field blank, do not execute the workflow. Explain which value is still needed.

## Purpose and use case

This prompt reconciles a newly generated CPQ rate card against the approved local Gold Standard Rate Card created in Prompt 'Generate Gold Standard Rate Card for CPQ Reconciliation'.

This provides a repeatable validation process for future quotes and identifies whether the current CPQ Unit Selling Price matches the established customer net unit price. The prompt extracts the current CPQ rate card and compares each Selling Price to the gold-standard price generated in Prompt 1, using SKU and Unit Qty/Range together. 

The output provides a concise list of SKUs where discrepancies occur, and what the target Discount and Net Selling Price should be reconciled to.

## Prerequisites

- Complete 'Generate Gold Standard Rate Card for CPQ Reconciliation' Prompt

Prerequisite link: [Open instructions](https://oci-strategic-install-prompt-library.msheerin01.workers.dev/?view=prompt&prompt=prompts%2Fdata-reporting%2Fprompt-1.md)

## Required inputs

- Path for Gold-Standard-Rate-Card file generated in the prerequisite prompt
- CPQ Link to the current rate card requiring reconciliation
- Output folder (optional)

## Workflow instructions

```text
One-line description:
Create a read-only CPQ rate-card reconciliation workbook that compares the current CPQ Unit Selling Price against an approved local gold-standard rate card and displays only net-unit-price discrepancies.

Required inputs (or see Required Inputs posted in chat):

CPQ Rate Card Link:
[PASTE CPQ LINK HERE]

Gold-Standard Rate Card File Location:
[PASTE FULL PATH TO Gold-Standard-Rate-Card.xlsx HERE]

Output Directory:
[PASTE OUTPUT DIRECTORY HERE]

Accuracy requirements:

- Treat Unit Selling Price, also referred to as net unit price, as the control point for reconciliation.
- Do not edit, save, submit, modify, or otherwise change anything in CPQ.
- Extract and document rate-card data only.
- Do not reuse a CPQ number, row count, file name, lookup range, or category name from a prior run.
- Build all row counts, formulas, lookup ranges, file names, and sheet ranges dynamically from the supplied inputs.
- Do not delete reconciliation records when filtering. Apply a standard editable Excel table filter.
- Do not use XLOOKUP. Use exact-match VLOOKUP.
- Do not place an @ symbol before any formula.
- Preserve SKU values as text. Preserve prices as numeric values.
- Do not silently substitute a different SKU, quantity range, metric, or product category when a match is absent.

1. Determine the dynamic CPQ identifier

Read the supplied CPQ link. In the params value, identify the digits immediately following id_ and ending before the next pipe character, ampersand, hash, or end of the URL.

Example:
params=id_19180490032|returnURL_SALESCLOUD

CPQ_NUMBER = 19180490032

Use this dynamic naming convention:

Raw export:
CPQ-<CPQ_NUMBER>_Rate-Card.csv

Reconciliation workbook:
CPQ-<CPQ_NUMBER>_Rate-Card-Reconciliation.xlsx

Do not use a CPQ number from any prior file or example.

2. Extract the CPQ rate-card data

Open the supplied CPQ link in read-only mode.

Navigate to:
Discounts > Rate Cards > Expand All

Capture every SKU-level row below All. Do not include category-header rows as SKU records.

For every SKU row, capture these fields:

- Product Category
- SKU
- Usage Item Description
- Metric
- Discount Category
- Unit Qty/Range
- Unit List Price
- Draft At Discount %
- Unit Selling Price
- Overage Selling Price
- LOA

Product Category rules:

- A product-category header applies to every SKU row below it until the next product-category header.
- Populate Product Category on every associated SKU record.
- Do not leave Product Category blank for an SKU row.
- Verify category transitions during extraction.

Extraction completeness rules:

- Expand every category beneath All.
- Continue through the full rate card until no additional SKU records remain.
- Account for virtualized tables, scrolling, pagination, or lazy-loaded rows.
- Verify the final SKU count after extraction.
- Check representative records at the start, middle, end, and each category transition against CPQ.
- Save the complete extracted data as:
  CPQ-<CPQ_NUMBER>_Rate-Card.csv

3. Create the reconciliation workbook

Create this workbook in the supplied output directory:

CPQ-<CPQ_NUMBER>_Rate-Card-Reconciliation.xlsx

Use Aptos Narrow, size 11. Do not apply custom borders, fills, shading, or decorative formatting. Use standard Excel tables only where required for editable filters.

Create these worksheets in this exact order:

1. CPQ-<CPQ_NUMBER> reconciliation
2. CPQ-<CPQ_NUMBER>_Rate-Card
3. gold-standard-rate-card

4. Populate the current CPQ rate-card tab

Create the CPQ-<CPQ_NUMBER>_Rate-Card tab using the complete CPQ extract, including zero-selling-price records.

Use these columns in this order:

- Product Category
- SKU
- Usage Item Description
- Metric
- Discount Category
- Unit Qty/Range
- Unit List Price
- Draft At Discount %
- Unit Selling Price
- Overage Selling Price
- LOA

Do not remove zero-selling-price records from this raw CPQ source tab.

5. Populate and prepare the gold-standard tab

Copy the CPQ-Gold-Standard data from the supplied gold-standard workbook into the gold-standard-rate-card tab.

Do not modify the source gold-standard workbook.

Before creating lookup formulas:

- Remove records where Unit Selling Price equals numeric zero from the gold-standard-rate-card tab in the new reconciliation workbook.
- Preserve all nonzero gold-standard records.
- Verify that no remaining gold-standard Unit Selling Price equals zero.

Use this column order in the gold-standard-rate-card tab:

- Product Category
- SKU
- Usage Item Description
- Metric
- Discount Category
- Unit Qty/Range
- Unit List Price
- Draft At Discount %
- Lookup Key
- Unit Selling Price
- Overage Selling Price
- LOA

6. Build a unique composite lookup key

Do not use SKU alone for the price lookup.

Start with this key:

SKU | Unit Qty/Range

In the gold-standard-rate-card tab, create Lookup Key with this formula pattern:

=B2&"|"&F2

In the reconciliation tab, create Lookup Key with this formula pattern:

=B2&"|"&E2

Before creating the price lookup, test whether SKU plus Unit Qty/Range uniquely identifies every remaining gold-standard record.

If every gold-standard Lookup Key is unique, use SKU | Unit Qty/Range.

If duplicate Lookup Keys remain, expand the composite key in both sheets, in this sequence:

1. SKU | Metric | Unit Qty/Range
2. SKU | Metric | Unit Qty/Range | Product Category

Use the first key structure that produces one unique gold-standard record per key.

Do not proceed with a lookup until the gold-standard key is unique. Record the final key structure in the Lookup Key column.

7. Build the reconciliation tab

Copy only current CPQ records where Unit Selling Price is not numeric zero.

Use these columns in this exact order:

- Product Category
- SKU
- Usage Item Description
- Metric
- Unit Qty/Range
- Unit List Price
- Draft At Discount %
- Unit Selling Price
- Gold-Standard-Selling-Price
- cpq-difference
- adjusted-discount
- Lookup Key

Use an exact-match VLOOKUP against the gold-standard Lookup Key and Unit Selling Price columns.

For the standard SKU | Unit Qty/Range key structure, use this formula pattern in Gold-Standard-Selling-Price:

=VLOOKUP(L2,'gold-standard-rate-card'!$I$2:$J$<LAST_GOLD_STANDARD_ROW>,2,FALSE)

Replace <LAST_GOLD_STANDARD_ROW> dynamically with the final populated gold-standard row.

Use these formulas:

cpq-difference:
=VALUE(H2)-I2

adjusted-discount:
=IFERROR((VALUE(F2)-I2)/VALUE(F2)*100,"")

Interpretation:

- cpq-difference of 0 means the current CPQ Unit Selling Price matches the gold-standard net unit price.
- Positive or negative cpq-difference means the current CPQ net unit price differs from the approved baseline.
- adjusted-discount shows the discount percentage required against the current CPQ Unit List Price to restore the gold-standard Unit Selling Price.

8. Missing-key handling

Do not leave #NAME?, #N/A, #REF!, #VALUE!, #DIV/0!, or “SKU not found” errors in the workbook.

If a current CPQ Lookup Key does not exist in the gold-standard tab:

- Confirm SKU text, Unit Qty/Range, Metric, and Product Category formatting.
- Trim leading and trailing spaces.
- Normalize equivalent quantity-range text consistently in both tabs.
- Recheck the composite-key design.
- If the key still has no gold-standard match, label the result Missing Gold Standard Key.
- Do not assign another row’s price.
- Keep the record visible for account-team review.

9. Apply and persist the editable Excel discrepancy filter
Convert the full reconciliation range into a standard Excel table with filter controls enabled.
Apply an active filter to the cpq-difference column using:
cpq-difference does not equal numeric 0
The saved workbook must open with this filter already active. The filter dropdown alone is insufficient.
Verify the displayed reconciliation sheet after saving and reopening:
- Only nonzero cpq-difference rows appear.
- If every cpq-difference equals 0, only table headers appear.
- Zero-difference records remain in the table.
- Clearing or editing the Excel table filter exposes all retained records.
- Missing Gold Standard Key records remain visible for review.
Do not delete reconciliation records to achieve the filtered result.

10. Final validation

Before delivery, verify all of the following:

- The reconciliation tab is the first worksheet.
- The raw CPQ tab contains every extracted CPQ SKU record.
- The gold-standard tab contains no zero Unit Selling Price records.
- The reconciliation tab contains no zero Unit Selling Price records.
- Every gold-standard Lookup Key is unique.
- Every matched reconciliation record returns the correct gold-standard Unit Selling Price.
- The VLOOKUP range dynamically covers the complete gold-standard data set.
- No formula contains @XLOOKUP or any XLOOKUP formula.
- No formula errors exist.
- The cpq-difference calculation equals current CPQ Unit Selling Price minus Gold-Standard-Selling-Price.
- The adjusted-discount calculation uses the current CPQ Unit List Price and the gold-standard Unit Selling Price.
- The cpq-difference Excel filter excludes numeric zero values without deleting records.
- Spot-check the first, middle, and final reconciliation records.
- Spot-check every SKU with multiple Unit Qty/Range values.
- Save the completed workbook in the specified output directory.

Return the completed workbook path and report:

- CPQ_NUMBER
- Total extracted CPQ SKU records
- Nonzero current CPQ records included in reconciliation
- Nonzero gold-standard records
- Composite lookup-key structure used
- Count of missing gold-standard keys
- Count of visible price discrepancies after the Excel filter
```

## Expected output

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
CPQ-<CPQ_NUMBER>   reconciliation | Editable    reconciliation view containing original data from extracted CPQ rate card,    and:         Target Gold-Standard-Selling-Price that you will         reconcile to via manual edits in CPQ     The Difference in         Gold-Standard and current CPQ Selling Price (for reference only)     The target         Adjusted-Discount that you will apply manually in CPQ to reach the         target Gold-Standard-Selling-Price
CPQ-<CPQ_NUMBER>_Rate-Card | Read-only   local extraction of the current CPQ rate card. Includes all extracted SKU   records, including zero-selling-price rows.
gold-standard-rate-card | Local   copy of the approved gold-standard data. Zero Unit Selling Price records are   removed. Lookup Key combines SKU and Unit Qty/Range to support accurate   tiered-price matching.



</div>

<!--EndFragment-->
</body>

</html>

## Additional Instructions and Post-Run Notes

Once output is generated, the first tab will list all SKUs, product category, etc. with the correct Selling Price and Discount that needs to be inputted in CPQ to arrive at that Selling Price. The sales team needs to manually reconcile CPQ with the provided discount and target net price as produced in the output Excel.
