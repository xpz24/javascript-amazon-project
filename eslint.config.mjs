import globals from "globals";
import pluginJs from "@eslint/js";
import jasminePlugin from 'eslint-plugin-jasmine';
import nodePlugin from 'eslint-plugin-n';

export default [
  {
    plugins: {
      jasmine: jasminePlugin,
      nodePlugin: nodePlugin
    },
    languageOptions: {
      globals: {
        ...globals.browser, // Assuming browser globals are required globally
        ...globals.node,    // Adding Node.js globals for general purpose
        ...globals.jasmine  // Jasmine globals for testing
      },
      parserOptions: {
        // ecmaVersion: "latest",  // latest is default
        // sourceType: 'module', // module is default
        ecmaFeatures: {
          impliedStrict: true, // Enable support for ES modules
        }
      }
    },
    rules: {
      ...pluginJs.configs.recommended.rules, // General recommended rules
      ...jasminePlugin.configs.recommended.rules
    }
  },
  {
    ...nodePlugin.configs["flat/recommended"],
    rules: {
      'n/exports-style': ['error', 'exports']
    }
  }
];