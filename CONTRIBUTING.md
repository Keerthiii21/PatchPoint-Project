# Contributing to PatchPoint

Thanks for wanting to contribute! This document explains the easiest way to get started and the conventions we follow.

1. File an issue first
- If you find a bug or want a feature, please open an issue with reproduction steps or a clear feature request.

2. Fork, branch, and PR
- Fork the repository and create a branch named with the pattern: `feat/<short-description>` or `fix/<short-description>` or `docs/<short-description>`.
- Submit a pull request to `main` with a clear title and description referencing the related issue (if any).

3. Coding standards
- Follow existing project style (JS/React + Tailwind). Keep changes focused and minimal.
- Use descriptive variable and function names. Avoid one-letter names.

4. Tests & linting
- If you add functionality, include tests where appropriate.
- Run linters & formatters before submitting. We use Prettier/ESLint if configured in the repo.

5. Commit messages
- Use conventional commits briefly: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`.

6. Review process
- A maintainer will review your PR and may request changes. Please respond to review comments promptly.

7. Sensitive data
- Never include secrets, API keys, or credentials in commits. Use environment variables and document needed keys in `README.md`.

8. Local development
- See `README.md` for how to run the backend and frontend locally.

Thank you for contributing — we appreciate your help!
