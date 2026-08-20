const {
    defineConfig,
} = require("eslint/config");

const globals = require("globals");
const nova = require("eslint-plugin-nova");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    languageOptions: {
        globals: {
            ...globals.node,
            ...nova.environments.nova.globals,
        },

        ecmaVersion: 2018,
        sourceType: "module",
        parserOptions: {},
    },

    extends: compat.extends("eslint:recommended"),

    plugins: {
        nova,
    },

    rules: {},
}]);
