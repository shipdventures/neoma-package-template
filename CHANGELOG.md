# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.1] - 2025-11-12

### Fixed
- Prevent template repository from publishing to npm when tagged
- Publish job now only runs for packages created from template, not template itself

## [0.3.0] - 2025-11-12

### Fixed
- Replace `{{PACKAGE_NAME}}` placeholder with buildable `package-template` name
- Update setup script to rename `libs/package-template` instead of `libs/PACKAGE_NAME`
- Template now builds, tests, lints, and validates successfully

### Added
- Publish dry-run test in CI workflow to validate package structure
- Complete package-lock.json for reproducible builds

### Changed
- Directory structure uses `libs/package-template` instead of `libs/PACKAGE_NAME`
- All imports and references updated to use `@neoma/package-template`

## [0.2.0] - 2025-11-12

### Added
- Build module on test functionality
- Comprehensive testing infrastructure with fixtures
- Example module with unit tests

### Fixed
- INestApplication typing issues
- Application specialisation improvements

## [0.1.0] - Initial Release

### Added
- Initial Neoma package template structure
- NestJS module scaffolding
- Testing setup with Jest
- ESLint and Prettier configuration
- TypeScript configuration
- Setup script for placeholder replacement
- Comprehensive README documentation

[Unreleased]: https://github.com/shipdventures/neoma-package-template/compare/v0.3.1...HEAD
[0.3.1]: https://github.com/shipdventures/neoma-package-template/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/shipdventures/neoma-package-template/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/shipdventures/neoma-package-template/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/shipdventures/neoma-package-template/releases/tag/v0.1.0