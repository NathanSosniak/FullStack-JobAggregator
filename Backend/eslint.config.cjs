const js = require("@eslint/js");

module.exports = [
  {
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
      },
    },
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: {
        require: "readonly",
        jest: "readonly",
        test: "readonly",
        expect: "readonly",
        afterEach: "readonly",
        describe: "readonly",
        beforeEach: "readonly",
      },
    },
  },
];
