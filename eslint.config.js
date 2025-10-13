import pluginVue from "eslint-plugin-vue";
import globals from "globals";

export default [
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.{js,vue}"],
    rules: {
      quotes: ["error", "single"],
      semi: ["error", "never"],
      "comma-dangle": ["error", "always-multiline"]
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];
