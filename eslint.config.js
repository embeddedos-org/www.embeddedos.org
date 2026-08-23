/**
 * ESLint flat config.
 *
 * Scope decision: this config lints for **correctness**, not style. Prettier
 * already owns formatting (`pnpm format:check`), so no stylistic rules are
 * enabled here — two tools disagreeing about whitespace is a standing cost for
 * no benefit.
 *
 * `eslint-plugin-react-hooks` v7 ships a `recommended-latest` preset that
 * includes the React Compiler rules (purity, immutability, set-state-in-effect
 * and friends). Those are deliberately not enabled: they are a large, opinionated
 * change to impose on an existing codebase in the same commit that introduces
 * linting at all. The two rules that catch genuine bugs — hook ordering and
 * stale closures — are enabled instead.
 */
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";

export default tseslint.config(
  {
    // Build output, vendored patches and binary assets are not ours to lint.
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "patches/**",
      "drizzle/**",
    ],
  },

  // TypeScript: client, server, shared, tests and e2e specs.
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    plugins: { "unused-imports": unusedImports },
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // TypeScript resolves identifiers itself, and does it correctly for
      // type-only and ambient names. ESLint's own copy only adds false
      // positives on a TS codebase.
      "no-undef": "off",

      // Deliberately a warning, not an error. The remaining `any`s sit at
      // external boundaries — the generated SDK surface, the storage client and
      // a Vite plugin shim — where the honest type genuinely is unknown at the
      // call site. Replacing them is a typing exercise with real risk of
      // asserting a shape the runtime does not guarantee, so they stay visible
      // rather than being either silenced or rushed.
      "@typescript-eslint/no-explicit-any": "warn",

      // Unused *imports* are delegated to unused-imports, which unlike the
      // typescript-eslint rule can autofix them — the difference between a
      // 113-line manual edit and `pnpm lint:fix`. The base rule is disabled so
      // the two do not both report the same identifier.
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",

      // A leading underscore is the established way to mark a binding that
      // exists for its position (destructuring, unused catch) rather than use.
      "unused-imports/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },

  // React hook correctness, only where React actually runs.
  {
    files: ["client/**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // Build and audit scripts: plain Node ESM, no TypeScript to lean on, so
  // `no-undef` stays on here and needs real globals.
  //
  // Browser globals are included deliberately. scripts/prerender.mjs and
  // scripts/audit-mobile.mjs drive Playwright, and the bodies of their
  // page.evaluate() callbacks are serialised and run in the page — so
  // `document` and `window` are genuinely in scope there despite the file
  // itself being Node.
  {
    files: ["**/*.mjs"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: { ...globals.node, ...globals.browser },
    },
  },

  // Scripts served to the browser as-is, not bundled.
  {
    files: ["client/public/**/*.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "script",
      globals: globals.browser,
    },
  },

  // This config file itself, and any other root-level ESM JavaScript.
  {
    files: ["*.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: globals.node,
    },
  }
);
