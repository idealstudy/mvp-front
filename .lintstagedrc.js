// const path = require('path');

// const buildEslintCommand = (filenames) =>
//   `next lint --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(' --file ')}`;

// module.exports = {
//   // Type check TypeScript files
//   '*.{js,jsx,ts,tsx,json,md,prettierrc,css,scss}': 'npx eslint --fix',
//   '*.{js,jsx,ts,tsx,json,md,prettierrc,css,scss}': 'npm run format',
//   '*.{js,jsx,ts,tsx}': [buildEslintCommand],
// };

const path = require('path');

const buildEslintCommand = (filenames) =>
  `npm run lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
};
