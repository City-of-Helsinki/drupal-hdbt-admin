/**
 * Text Highlight plugin
 * Plugin for: http://ckeditor.com/license (GPL/LGPL/MPL: http://ckeditor.com/license)
 */
(function () {
  'use strict';

  CKEDITOR.plugins.add('highlight', {
    lang: ['fi','en'],
    icons: 'highlight',
    hidpi: true,

    init: function (editor) {
      let addButtonCommand = function (buttonName, buttonLabel, commandName, styleDefiniton) {
        if (!styleDefiniton)
          return;

        let style = new CKEDITOR.style(styleDefiniton),
            forms = contentForms[commandName];

        // Listen to contextual style activation.
        editor.attachStyleStateChange(style, function (state) {
          !editor.readOnly && editor.getCommand(commandName).setState(state);
        });

        // Create the command that can be used to apply the style.
        editor.addCommand(commandName, new CKEDITOR.styleCommand(style, {
          contentForms: forms
        }));

        // Register the button, if the button plugin is loaded.
        if (editor.ui.addButton) {
          editor.ui.addButton(buttonName, {
            label: buttonLabel,
            command: commandName,
            toolbar: 'highlight'
          });
        }
      };

      let contentForms = {
          highlight: [
            'span',
            ['span', function (el) {
              let fw = el.classes['highlighted'];
              return fw === 'span';
            }]
          ]
        },
        config = editor.config;

      addButtonCommand('highlight', editor.lang.highlight['highlightText'], 'highlight', config.highlight_text);
    }
  });

  /**
   * The style definition that applies the highlighted style to the text.
   */
  CKEDITOR.config.highlight_text = {
    element: 'span',
    attributes: {'class': 'highlighted'}
  };

})();
