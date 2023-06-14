// module.exports = {
//   parser: '@typescript-eslint/parser',
//   parserOptions: {
//     project: 'tsconfig.json',
//     tsconfigRootDir: __dirname,
//     sourceType: 'module',
//   },
//   plugins: ['@typescript-eslint/eslint-plugin','@typescript-eslint','jest', 'prettier', 'import', 'unused-imports'],
//   extends: [
//     // airbnb规范
//     'airbnb-base',
//     // 兼容typescript的airbnb规范
//     'airbnb-typescript/base',
//     // typescript的eslint插件
//     'eslint:recommended',
//     'plugin:@typescript-eslint/recommended',
//     'plugin:@typescript-eslint/recommended-requiring-type-checking',

//     // 支持jest
//     'plugin:jest/recommended',
//     // 使用prettier格式化代码
//     'prettier',
//     // 整合typescript-eslint与prettier
//     'plugin:prettier/recommended',
//   ],
//   root: true,
//   env: {
//     node: true,
//     jest: true,
//   },
//   ignorePatterns: ['.eslintrc.js'],
//   rules: {
//     '@typescript-eslint/interface-name-prefix': 'off',
//     '@typescript-eslint/explicit-function-return-type': 'off',
//     '@typescript-eslint/explicit-module-boundary-types': 'off',
//     '@typescript-eslint/no-explicit-any': 'off',
//     "import/prefer-default-export": "off",
//     "prettier/prettier": ["warn", {"endOfLine":"auto"}],
//     'no-unused-vars': 0,
//     '@typescript-eslint/no-unsafe-assignment': 0,
//     '@typescript-eslint/no-unsafe-return': 0,
//     '@typescript-eslint/no-unsafe-call': 0,
//     '@typescript-eslint/no-unsafe-member-access': 0,
//     '@typescript-eslint/no-unsafe-argument': 0,
//     '@typescript-eslint/require-await': 0,
//     '@typescript-eslint/no-unused-vars': 'warn',
//     'unused-imports/no-unused-imports': 'warn',
//     "@typescript-eslint/space-before-blocks": 'off',
//     // 'unused-imports/no-unused-vars': [
//     //     'error',
//     //     {
//     //         vars: 'all',
//     //         args: 'none',
//     //         ignoreRestSiblings: true,
//     //     },
//     // ],
//     // 导入模块的顺序
//     'import/order': [
//       'error',
//       {
//           pathGroups: [
//               {
//                   pattern: '@/**',
//                   group: 'external',
//                   position: 'after',
//               },
//           ],
//           alphabetize: { order: 'asc', caseInsensitive: false },
//           'newlines-between': 'always-and-inside-groups',
//           warnOnUnassignedImports: true,
//       },
//     ],
//     'import/extensions': [
//       'error',
//       'ignorePackages',
//       {
//           js: 'never',
//           jsx: 'never',
//           ts: 'never',
//           tsx: 'never',
//       }
//     ],
//     // 导入的依赖不必一定要在 dependencies 的文件
//     'import/no-extraneous-dependencies': [
//     'error',
//       {
//           devDependencies: [
//               '**/*.test.{ts,js}',
//               '**/*.spec.{ts,js}',
//               './test/**.{ts,js}',
//           ],
//       },
//     ],
//     'no-restricted-syntax':[
//       "error",
//       {
//         "selector": "ForInStatement",
//         "message": "不允许使用for..in循环。请改用数组迭代方法。"
//       },
//       {
//         "selector": "LabeledStatement",
//         "message": "本项目不允许使用标记语句。"
//       },
//       {
//         "selector": "WithStatement",
//         "message": "本项目不允许使用'with'语句。"
//       },
//       {
//         "selector": "BinaryExpression[operator='in']",
//         "message": "本项目不允许使用'in'表达式。请改用Array.prototype.includes。"
//       },
//       {
//         "selector": "CallExpression[callee.name='regeneratorRuntime']",
//         "message": "本项目不允许使用regeneratorRuntime。请改用async/await。"
//       },
//       {
//         "selector": "ForOfStatement",
//         "message": "不允许允许使用for..of循环。"
//       }
//     ]
//   },
// };
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  plugins: [
    '@typescript-eslint',
    'jest',
    'prettier',
    'import',
    'unused-imports',
  ],
  extends: [
    // airbnb规范
    // https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb
    'airbnb-base',
    // 兼容typescript的airbnb规范
    // https://github.com/iamturns/eslint-config-airbnb-typescript
    'airbnb-typescript/base',

    // typescript的eslint插件
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md
    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    // 支持jest
    'plugin:jest/recommended',
    // 使用prettier格式化代码
    // https://github.com/prettier/eslint-config-prettier#readme
    'prettier',
    // 整合typescript-eslint与prettier
    // https://github.com/prettier/eslint-plugin-prettier
    'plugin:prettier/recommended',
  ],
  rules: {
    /* ********************************** ES6+ ********************************** */
    'no-console': 0,
    'no-var-requires': 0,
    'no-restricted-syntax': 0,
    'no-continue': 0,
    'no-await-in-loop': 0,
    'no-return-await': 0,
    'no-unused-vars': 0,
    'no-multi-assign': 0,
    'no-param-reassign': [2, { props: false }],
    'import/prefer-default-export': 0,
    'import/no-cycle': 0,
    'import/no-dynamic-require': 0,
    'max-classes-per-file': 0,
    'class-methods-use-this': 0,
    'guard-for-in': 0,
    'no-underscore-dangle': 0,
    'no-plusplus': 0,
    'no-lonely-if': 0,
    'no-bitwise': ['error', { allow: ['~'] }],

    /* ********************************** Module Import ********************************** */

    'import/no-absolute-path': 0,
    'import/extensions': 0,
    'import/no-named-default': 0,
    'no-restricted-exports': 0,

    // 一部分文件在导入devDependencies的依赖时不报错
    'import/no-extraneous-dependencies': [
      1,
      {
        devDependencies: [
          '**/*.test.{ts,js}',
          '**/*.spec.{ts,js}',
          './test/**.{ts,js}',
        ],
      },
    ],
    // 模块导入顺序规则
    'import/order': [
      1,
      {
        pathGroups: [
          {
            pattern: '@/**',
            group: 'external',
            position: 'after',
          },
        ],
        alphabetize: { order: 'asc', caseInsensitive: false },
        'newlines-between': 'always-and-inside-groups',
        warnOnUnassignedImports: true,
      },
    ],
    // 自动删除未使用的导入
    // https://github.com/sweepline/eslint-plugin-unused-imports
    'unused-imports/no-unused-imports': 1,
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'none',
        ignoreRestSiblings: true,
      },
    ],
    /* ********************************** Typescript ********************************** */
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/no-this-alias': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-unnecessary-type-assertion': 0,
    '@typescript-eslint/require-await': 0,
    '@typescript-eslint/no-for-in-array': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-floating-promises': 0,
    '@typescript-eslint/restrict-template-expressions': 0,
    '@typescript-eslint/no-unsafe-assignment': 0,
    '@typescript-eslint/no-unsafe-return': 0,
    '@typescript-eslint/no-unused-expressions': 0,
    '@typescript-eslint/no-misused-promises': 0,
    '@typescript-eslint/no-unsafe-member-access': 0,
    '@typescript-eslint/no-unsafe-call': 0,
    '@typescript-eslint/no-unsafe-argument': 0,
    '@typescript-eslint/ban-ts-comment': 0,

    'prettier/prettier': 0,
  },

  settings: {
    extensions: ['.ts', '.d.ts', '.cts', '.mts', '.js', '.cjs', 'mjs', '.json'],
  },
};
