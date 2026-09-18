# Strategic Install Required Input Form

Install this Codex plugin once to let Strategic Install skills collect non-sensitive Required Inputs in a Codex form.

## One-time setup

1. Open a terminal and run:

   ```powershell
   codex plugin marketplace add https://github.com/michaelsheerin/oci-strategic-install-codex-repo.git --sparse .agents/plugins --sparse plugins/strategic-install-required-input-form
   ```

2. Open Plugins, choose the new Strategic Install marketplace, then install **Strategic Install Required Input Form**.

The form service sends no requests to Oracle systems and stores no submitted values. Do not enter passwords, API keys, access tokens, payment data, or other secrets into a form.
