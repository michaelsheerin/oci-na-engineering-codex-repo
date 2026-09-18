---
name: generate-a-weekly-dedicated-pool-capacity-report
description: "Use this prompt to create a current weekly capacity report for a dedicated pool across selected regions and availability domains. It queries live Compute Admin inventory, validates Global-AD and Tenant-AD mappings from authoritative metadata, produces one current-date CSV per Global-AD, and builds a"
---

# Generate a Weekly Dedicated-Pool Capacity Report

Use this skill when the user's request matches the skill description. Follow the user's direct instructions when they conflict with this workflow. Before running the workflow, confirm that every Required input has a value. If a value is missing, ask the user for it before continuing. Users may provide values as `- Input name = value`.

## Purpose and use case

Use this prompt to create a current weekly capacity report for a dedicated pool across selected regions and availability domains. It queries live Compute Admin inventory, validates Global-AD and Tenant-AD mappings from authoritative metadata, produces one current-date CSV per Global-AD, and builds a consolidated Excel workbook with Hypervisors and Summary tabs.

Run this prompt when the report needs current dedicated-pool capacity data, shape-level OCPU and memory calculations, and an optional standard VM capacity view. It does not modify source inventory or prior-date report files.

## Prerequisites

- Customer in Dedicated Pool
- C4PO Access and MCP Server Configuration (see link)

Prerequisite link: [Open instructions](https://oci-strategic-install-prompt-library.msheerin01.workers.dev/?view=prompt&prompt=prompts%2Fdata-reporting%2Fdedicated-pool-capacity-report.md)

## Required inputs

- Customer or report label
- Exact pool name
- One or more region and availability-domain targets
- One or more exact Hypervisor shapes
- Optional standard VM shape and positive OCPU count
- Output directory (optional)

## Workflow instructions

```text
Use Compute Admin MCP and an authorized SharePoint Excel write capability.

Create a complete weekly dedicated-pool capacity report from current Compute Admin data.

User inputs

Customer / report label:
<ENTER CUSTOMER LABEL>

Pool name:
<ENTER EXACT POOL NAME>

Regions / availability domains to analyze:
<ENTER REGION AND AD TARGETS>

Hypervisor shapes to analyze:
<ENTER ONE OR MORE EXACT HYPERVISOR SHAPES>

Optional standard VM analysis:
<ENTER ONE STANDARD VM SHAPE AND ITS OCPU COUNT, OR LEAVE BLANK>

Output directory:
<ENTER OUTPUT DIRECTORY>

Date:
Use today’s date in America/New_York, formatted MM.DD.YY.

Input validation

- Pool name is required.
- At least one Region and Availability Domain target is required.
- At least one Hypervisor shape is required.
- Standard VM analysis is optional.
- If standard VM analysis is entered, accept exactly one VM shape and one positive OCPU count.
- If more than one standard VM shape is entered, stop and return this error:

Select one standard VM shape only. Run separate reports for each VM shape.

- Do not modify prior-date files.
- Create or replace only current-date output files.

Data rules

For every selected Region and Availability Domain:

1. Query the complete Hypervisor inventory. Fully paginate before filtering or export.
2. Retain only records where:
   - Pool Name equals the supplied Pool Name.
   - State equals ACTIVE.
   - Shape equals one of the supplied Hypervisor shapes.
3. Exclude every Hypervisor where State is not ACTIVE, including DELETED Hypervisors.
4. Do not use historical CSVs or prior workbooks as a data source.
5. Do not accept one empty endpoint response as proof of zero inventory.
6. If the standard Hypervisor endpoint returns zero unexpectedly:
   - Query current pool-host inventory for the same pool and Availability Domain.
   - Fully paginate.
   - De-duplicate Hypervisor IDs.
   - Retrieve current Hypervisor records.
   - Reapply Pool Name, State, and Shape filters.
7. Do not write a partial report.

Global AD and Tenant AD discovery

For every selected Availability Domain:

1. Discover the actual Global-AD identifier from authoritative Compute Admin or C4PO location metadata.
2. Discover the actual logical Tenant-AD mapping from authoritative pool, tenancy, site-group, capacity, or placement metadata.
3. Validate the mapping against current Hypervisor or pool-host records.
4. Do not infer Tenant-AD from AD ordering, name similarity, or a prior report.
5. If an authoritative Tenant-AD mapping is unavailable, stop before writing files and report the unmapped Global-AD values.

Shape capacity discovery

For every supplied Hypervisor shape:

1. Retrieve the current shape specification from Compute Admin.
2. Determine total OCPUs per Hypervisor shape.
3. Determine total memory per Hypervisor shape.
4. Map every Hypervisor row to the total OCPU and total memory for its own Shape.
5. Do not use one fixed total-core or total-memory value across different Hypervisor shapes.
6. Normalize all memory values to GiB before calculations.
7. Do not round memory values before Used-Memory calculation.

CSV output

Create one CSV per selected Global-AD.

Filename format:

HV_<Customer-Label>_<Global-AD>_<MM.DD.YY>.csv

Use this exact base-column order:

ID
Shape
Pool Name
State
Placement State
Available-Cores
Available-Memory

Available-Cores must contain the current Compute Admin available-core value.

Available-Memory must contain the current Compute Admin available-memory value, normalized to GiB.

Workbook output

Create:

<Customer-Label>-Capacity-Overview_<MM.DD.YY>.xlsx

Create a tab named Hypervisors.

Union all current-date CSVs into this tab.

- Retain one header row only.
- Include rows from every selected Global-AD.
- Do not include CSVs from prior dates.
- Do not add custom formatting, tables, colors, filters, or charts.

Use these columns in this exact order:

ID
Shape
Pool Name
State
Placement State
Available-Cores
Available-Memory
Global-AD
Tenant-AD
Total-Cores
Used-Cores
Total-Memory
Used-Memory

For each row:

Global-AD:
Set from the source CSV filename and validated location metadata.

Tenant-AD:
Set from the authoritative Tenant-AD mapping discovered during this run.

Total-Cores:
Set to the total OCPU count for the Hypervisor row’s Shape.

Used-Cores:
Set to:

=Total-Cores - Available-Cores

Use direct row formulas. With the stated column order, the first formula is:

=J2-F2

Total-Memory:
Set to the total memory in GiB for the Hypervisor row’s Shape.

Used-Memory:
Set to:

=Total-Memory - Available-Memory

Use direct row formulas. With the stated column order, the first formula is:

=L2-G2

Optional standard VM analysis

Perform this section only when one standard VM shape and one VM OCPU count are supplied.

Add these columns after Used-Memory:

Available-<VM-OCPU-Count>c-Instances
Available-Usable-Cores

For example, a 28-OCPU VM adds:

Available-28c-Instances
Available-Usable-Cores

Available-<VM-OCPU-Count>c-Instances:
Calculate how many complete standard VMs fit on each individual Hypervisor:

=ROUNDDOWN(Available-Cores / <VM-OCPU-Count>,0)

With the stated column order, the first formula is:

=ROUNDDOWN(F2/<VM-OCPU-Count>,0)

Available-Usable-Cores:
Calculate usable available cores after whole-VM rounding:

=Available-<VM-OCPU-Count>c-Instances * <VM-OCPU-Count>

With the stated column order, the first formula is:

=N2*<VM-OCPU-Count>

If standard VM analysis is blank:

- Omit Available-<VM-OCPU-Count>c-Instances.
- Omit Available-Usable-Cores.
- Omit VM-instance capacity from the Summary pivot table.

Summary tab

Create a second tab named Summary.

Add:

Memory Unit: GiB

Create a pivot table sourced from the Hypervisors tab.

Pivot table rows, in this exact order:

Tenant-AD
Shape

Sort Tenant-AD ascending.
Sort Shape ascending within each Tenant-AD.

Pivot table values, summarized as Sum, in this exact order:

Total-Cores
Used-Cores
Used-Memory
Available-Cores
Available-Memory

If standard VM analysis is supplied, add this final pivot value:

Available-<VM-OCPU-Count>c-Instances

The pivot table must omit Available-Usable-Cores.

Final validation

- Verify every CSV exists.
- Verify workbook data rows equal the sum of all current-date CSV data rows.
- Verify every workbook row has State = ACTIVE.
- Verify no DELETED Hypervisors exist in any CSV or workbook.
- Verify every workbook row has the supplied Pool Name.
- Verify every workbook row has a supplied Hypervisor Shape.
- Verify Total-Cores matches the current OCPU specification for each row’s Shape.
- Verify Used-Cores equals Total-Cores minus Available-Cores.
- Verify Total-Memory matches the current memory specification for each row’s Shape.
- Verify Used-Memory equals Total-Memory minus Available-Memory.
- Verify Available-Memory, Total-Memory, and Used-Memory use GiB.
- Verify Global-AD and Tenant-AD mappings originate from current authoritative metadata.
- Verify formulas fill every data row.
- Verify the Summary pivot includes every Tenant-AD and Shape.
- If standard VM analysis is supplied, verify Available-<VM-OCPU-Count>c-Instances and Available-Usable-Cores formulas fill every data row.
- Report final row counts by Global-AD, Hypervisor Shape, Tenant-AD, and total workbook row count.
```

## Expected output

Current-date CSV files by Global-AD and a consolidated Excel capacity workbook with Hypervisors and Summary tabs.

Review the validation report and resolve inventory or authoritative-mapping errors before using the report.

## Additional Instructions and Post-Run Notes

Requires Compute Admin MCP access and an authorized SharePoint Excel write capability. The prompt stops before writing files when authoritative mapping is unavailable and does not write a partial report.
