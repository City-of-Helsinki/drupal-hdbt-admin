# HDBT Admin theme

## Introduction

HDBT Admin theme is an admin theme for the City of Helsinki. It is based on the contrib theme called Gin. The abbrevation comes from
the words Helsinki Drupal Base Theme. Style follows the [BEM methodology](http://getbem.com/) and javascript is written
as ES6. The JS and SCSS files are compiled and minified with webpack.

## Requirements

This theme requires [Drupal 9](https://www.drupal.org/project/drupal/releases/9.0.0), [recommended PHP version](https://www.drupal.org/docs/system-requirements/php-requirements) and at least [Gin theme 8.x-3.0-beta2]().

Requirements for developing:
- [NodeJS](https://nodejs.org/en/)
- [NPM](https://npmjs.com/)
- optional [NVM](https://github.com/nvm-sh/nvm)

## Commands

| Command       | Description                                                                       |
|---------------|-----------------------------------------------------------------------------------|
| nvm use       | Uses correct Node version chosen for the theme compiler.                          |
| npm i         | Install dependencies and link local packages.                                     |
| npm ci        | Install a project with a clean slate. Use especially in travis like environments. |
| npm run dev   | Compile styles and js for development environment. and watch file changes.        |
| npm run build | Build packages for production. Minify CSS/JS.                                     |

Set up the developing environment by running

    nvm use
    npm i

Explanations for commands.
- `nvm use` : Install and use the correct version of Node.
- `npm i` : As stated above; Install dependencies and link local packages.

Related files.
- `.nvmrc` : Defines the node version used to compile the theme.
- `package.json and package-lock.json` : Defines the node modules for compiling the theme.
- `postcss.config.js and postcss.plugins.js` : Configurations for the postcss-tool that is run when the theme is built.
  You can read more about the tool here: https://postcss.org/
- `webpack.config.js` : Configuration file for the webpack-tool that is used to actually build the theme. Similar tool
  to Gulp or Grunt. Usually if there is something wrong with the compiled theme files the culprit can be found here.

## Structure for files and folders

### The config-folder

The config-folder includes configurations that are used when installing a new project from scratch. These configuration
files are copied under the conf/cmi folder and used there so altering them under theme doesn't change anything unless
you are building a new instance.

### The dist- and src-folders

Under the src-folder there is all the theme components that are being compiled to dist-folder such as css, javascript,
icons and fonts. Dist-folder includes the compiled version of the same information created using the commands listed
under commands-title.

The theme styles under the scss-folder are structured by implementing principles from the itcss architecture but with
small adjustments to make it work for the needs of the project.

### Templates-folder

Under the templates folder the structure is similar to the base-theme stable9 with few additions such as the module
folder that includes templates for the helfi-prefixed modules that are created for this project.

### Translations-folder

Translations-folder includes translations to all the translatable strings that are provided by the hdbt-theme.

## Webpack entries

Any .js file in /src/js/ will be compiled to separate entry and minified into the /dist folder.
Typescript entrypoints must be added separately. See webpack.config.js.

### How to use entries in Drupal libraries

Example:
```
component-library:
  version: 1.x
  css:
    theme:
      dist/css/component-library.min.css: {}
  js:
    dist/js/component-library.min.js: {}
```

Library must be loaded on the page where it's used. It can be added via preprocess function or in a twig template. Read
more about using libraries in Drupal from for example from
[here](https://www.drupal.org/docs/develop/creating-modules/adding-assets-css-js-to-a-drupal-module-via-librariesyml).

## How tos

### How can I add custom translations?
Add your UI translations to ``./translations/{fi/sv}.po`` files like it is explained in Translation in Drupal 8
documentation: https://www.drupal.org/docs/understanding-drupal/translation-in-drupal-8.
These translations consists of:

PHP
```
$this->t('Example', [], ['context' => 'My custom context'])
```
Twig
```
{{ 'Example'|t({}, {'context': 'My custom context'}) }}
```
JS
```
const variable = Drupal.t('Example', {}, {context: 'My custom context'});
```

And the way to add the actual translation in to f.e. `fi.po` is done like so:
```
msgctxt "My custom context"
msgid "Example"
msgstr "Esimerkki"
```

To see these translation changes in an instance, run in container shell:
```
drush locale:check && drush locale:update
```
And then flush all caches from top left drupal admin menu under "Druplicon".

### I have some php linter errors

You can lint or fix php in instance root's shell

To lint
```
vendor/bin/phpcs public/themes/contrib/hdbt_admin --extensions=php,module,theme,inc --ignore="*.js,*.css" --standard=Drupal
```

To fix
```
vendor/bin/phpcbf public/themes/contrib/hdbt_admin --extensions=php,module,theme,inc --ignore="*.js,*.css" --standard=Drupal
```
