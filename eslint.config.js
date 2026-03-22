import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{js,vue}'],
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      'comma-dangle': ['error', 'always-multiline'],
      'vue/attributes-order': ['error', {
        'order': [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          ['UNIQUE', 'SLOT'],
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'ATTR_SHORTHAND_BOOL',
          'ATTR_STATIC',
          'ATTR_DYNAMIC',
          'EVENTS',
          'CONTENT',
        ],
        'alphabetical': true,
      }],
      'vue/multi-word-component-names': ['error', {
        'ignores': ['draggable', 'index'],
      }],
      'vue/component-name-in-template-casing': ['error', 'PascalCase',
        {
          registeredComponentsOnly: false,
          ignores: ['draggable'],
        }],
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
]
