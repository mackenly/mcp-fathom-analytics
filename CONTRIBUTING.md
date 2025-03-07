# Contributing to MCP Fathom Analytics

Thank you for your interest in contributing to the MCP Fathom Analytics project! This document outlines the process for contributing to this project and how to get your changes merged.

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- npm (v8 or newer)
- Git

### Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```
   git clone https://github.com/mackenly/mcp-fathom-analytics.git
   cd mcp-fathom-analytics
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a branch for your feature or bugfix:
   ```
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Building the Project

To compile the TypeScript files to JavaScript, run:

```
npm run build
```

This will output the compiled JavaScript to the `dist/` directory.

### Testing Your Changes

To test your changes locally, you can use `npm link`:

```
npm link
```

This will create a symlink to your local project, allowing you to run it locally using:

```
npx mcp-fathom-analytics
```

### Code Style

- Follow the existing code style (use @mackenlyfathom-api for API calls rather than making them directly)
- Use meaningful variable and function names
- Write comments for complex logic

## Submitting Changes

1. Commit your changes with a descriptive message:
   ```
   git commit -am "Add feature: your feature description"
   ```

2. Push to your fork:
   ```
   git push origin feature/your-feature-name
   ```

3. Create a Pull Request (PR) from your fork to the main repository
   - Provide a clear description of the changes
   - Link any relevant issues

## Release Process

### For Maintainers

1. Update the version in `package.json` and version in `index.ts` following [semantic versioning](https://semver.org/)
2. Run `npm run build` to compile the TypeScript files
3. Manually publish to npm

## Reporting Bugs

Please report bugs by opening an issue in the GitHub repository. Include:

- Description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node.js version, etc.)

## Feature Requests

Feature requests are welcome. Please provide:

- Clear description of the feature
- Use cases
- Any design ideas or proposals

## License

By contributing to this project, you agree that your contributions will be licensed under the project's license (see [LICENSE](LICENSE) file).