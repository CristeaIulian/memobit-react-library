# Security policy

## Reporting a vulnerability

If you find a security issue in `@memobit/libs`, **please do not open a public GitHub issue**. Public disclosure before a fix is available puts users at risk.

Use one of these channels instead:

- **Preferred** — [Open a private vulnerability report on GitHub](https://github.com/CristeaIulian/memobit-react-library/security/advisories/new) (Security tab → "Report a vulnerability"). This keeps the discussion private until a fix ships.
- **Or** — Email **iulianx@gmail.com** with the details.

Please include:

- A clear description of the issue and its impact.
- Steps to reproduce, ideally with a minimal code sample.
- The affected version(s) of `@memobit/libs`.
- Any suggested mitigation, if you have one.

You can expect an initial response within a few business days. Once the issue is confirmed, a fix will be released as a patch version and a GitHub Security Advisory will be published crediting the reporter (unless you prefer to remain anonymous).

## Supported versions

Only the most recent minor release on the latest major version receives security fixes.

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

## Scope

**In scope**

- The `@memobit/libs` package published to npm and its build output (`dist/`).
- Source code in this repository.

**Out of scope**

- Vulnerabilities in third-party dependencies — please report those to the upstream project. We will pick up the fix once it lands upstream.
- Issues that require the attacker to already control the developer's machine or build environment.
- UI/UX issues, missing features, or general code-quality concerns — those belong in regular issues or PRs.

## Coordinated disclosure

If you have a fix or workaround in mind, please share it in the private report; we'll coordinate the release timing and credit you in the advisory. If a CVE is appropriate, it will be requested via the GitHub Security Advisory flow.
