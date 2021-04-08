/**
 * @file
 * Select2 icon integration.
 */
(function ($, Drupal, drupalSettings) {
  'use strict';

  Drupal.behaviors.select2IconIntegration = {
    attach: function (context) {
      $('.select2-icon', context).on('select2-init', function (event) {
        let config = $(event.target).data('select2-config');

        const templateHandler = function (parentHandler) {
          return function (option, item) {
            if (parentHandler) { parentHandler(option, item); }
            if (!option.id) { return option.text; }
            if (item) {
              let iconName = $(option.element).attr('data-select2-icon');
              if (iconName) {
                return $(
                  '<span style="align-items: center; display: flex; height: 100%;">' +
                    '<svg class="icon" style="margin-right: 0.5rem; max-width: 2.5rem; max-height: 2.5rem; width: 100%; height: 100%;">' +
                      '<use xlink:href="' + drupalSettings.select2Icon.pathToIcons + '#' + iconName + '" />' +
                    '</svg>' + option.text +
                  '</span>'
                );
              }
            }
          };
        };

        config.templateSelection = templateHandler(config.templateSelection);
        config.templateResult = templateHandler(config.templateResult);
        $(event.target).data('select2-config', config);
      });
    }
  };

})(jQuery, Drupal, drupalSettings);
