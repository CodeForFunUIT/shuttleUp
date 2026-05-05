# Development Rules

* Always follow these principles: **YAGNI** (You Aren't Gonna Need It) — **KISS** (Keep It Simple, Stupid) — **DRY** (Don't Repeat Yourself)
* Activate relevant skills from the skills catalog as needed during the process

## General

* **File Naming**: Use kebab-case with meaningful names that describe the file's purpose — doesn't matter if long, LLMs should understand the purpose from the name alone
* **File Size Management**: Keep individual code files under 200 lines for optimal context management
  * Split large files into smaller, focused components/modules
  * Use composition over inheritance for complex widgets
  * Extract utility functions into separate modules
  * Create dedicated service classes for business logic
* Follow the codebase structure and code standards in `./docs`
* **Do not** simulate or mock the implementation — always implement real code

## Code Quality Guidelines

* Read and follow codebase structure and code standards in `./docs`
* Don't be too harsh on linting, but **make sure there are no syntax errors and code is compilable**
* Prioritize functionality and readability over strict style enforcement and code formatting
* Use reasonable code quality standards that enhance developer productivity
* Use try-catch error handling & cover security standards
* Review code after every implementation

## Pre-commit/Push Rules

* Run linting before commit (`npm run lint` / `flutter analyze`)
* Run tests before push (`npm test` / `flutter test`)
* Keep commits focused on actual code changes
* **DO NOT** commit and push any confidential information (dotenv files, API keys, database credentials, etc.)
* Create clean, professional commit messages without AI references. Use conventional commit format.

## Code Implementation

* Write clean, readable, and maintainable code
* Follow established architectural patterns in `./docs/code-standards.md`
* Implement features according to specifications in `./docs/project-overview-pdr.md`
* Handle edge cases and error scenarios
* **DO NOT** create new enhanced files — update existing files directly
