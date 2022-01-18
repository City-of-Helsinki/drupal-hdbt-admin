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
                return $(`
                  <span style="align-items: center; display: flex; height: 100%;">
                    <span class="hdbt-icon hdbt-icon--${iconName}" aria-hidden="true"></span>
                    <span style="margin-left: 8px;">${option.text}</span>
                  </span>
                `);
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
