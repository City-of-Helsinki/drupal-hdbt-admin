import path from 'path';
import { globSync } from 'glob';
import { buildAll, watchAndBuild } from '@hdbt/theme-builder/builder';

const __dirname = path.resolve();
const isDev = process.argv.includes('--dev');
const isWatch = process.argv.includes('--watch');
const watchPaths = ['src/js', 'src/scss'];
const outDir = path.resolve(__dirname, 'dist');

// React apps.
const reactApps = {};

// Vanilla JS files.
const jsFiles = globSync('./src/js/**/*.js', {
  // ignore: [],
}).reduce((acc, file) => ({
  ...acc, [path.parse(file).name]: file
}), {});

// SCSS files.
const styles = [
  ['src/scss/styles.scss', 'css/styles.min.css'],
  ['src/scss/ckeditor.scss', 'css/ckeditor.min.css'],
];

// Static files.
const staticFiles = [
  ['node_modules/select2/dist/js/select2.min.js', `${outDir}/js/select2.min.js`],
  ['node_modules/select2/dist/css/select2.min.css', `${outDir}/css/select2.min.css`],
  ['src/fonts/**/*.{woff,eot,ttf,svg}', `${outDir}/fonts`],
];

// Builder configurations.
const reactConfig = { reactApps, isDev, outDir };
const jsConfig = { jsFiles, isDev, outDir };
const cssConfig = { styles, isDev, outDir };
const buildArguments = { outDir, staticFiles, jsConfig, reactConfig, cssConfig };

if (isWatch) {
  watchAndBuild({
    buildArguments,
    watchPaths,
  });
} else {
  buildAll(buildArguments).catch((e) => {
    console.error('❌ Build failed:', e);
    process.exit(1);
  });
}
