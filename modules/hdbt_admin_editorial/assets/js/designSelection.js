/**
 * @file Design selection.
 */
(function ($, Drupal, drupalSettings) {
  "use strict";

  Drupal.behaviors.designSelection = {
    attach: function (context) {

      /**
       * Perform alterations for each "design select" select element, when
       * select2 initialization has been triggered.
       */
      $('.design-selection', context).on('select2-init', function (event) {
        let config = $(event.target).data('select2-config');
        let designSelect = $(event.target).data('designSelect');

        /**
         * TemplateHandler handles each select item in select2 list.
         */
        const templateHandler = function (parentHandler, design) {
          const parentDesign = design;
          return function (option, container) {
            if (parentHandler) { parentHandler(option, container); }
            if (!option.id) { return option.text; }
            if (!parentDesign) { return option.text; }

            // Use unified link designs for all links (buttons).
            const link_designs = [
              'hero-link-design',
              'banner-link-design',
            ];
            let design = parentDesign;

            if (link_designs.includes(parentDesign)) {
              design = 'link-design';
            }

            // Craft path to thumbnails based on item values and base design.
            const item = design + '--' + option.element.value;
            const thumbnail = item + '.svg';
            const pathToThumb = drupalSettings.designSelect.pathToImages + thumbnail;

            // Craft template and return it.
            return $(`
              <div class="design-selection__wrapper">
                <span>${option.text}</span>
                <img src="${pathToThumb}" data-hover-title="${option.text}" data-hover-image="${item}" class="design-selection__thumbnail" />
              </div>
            `);
          };
        };

        // Configuration overrides for the design select tool.
        config.templateResult = templateHandler(config.templateResult, designSelect);
        config.minimumResultsForSearch = -1;
        config.theme = 'default design-selection';
        $(event.target).data('select2-config', config);
      });

      /**
       * Assign image preview to selection thumbnail.
       */
      const selector = '.select2-container--open .design-selection__thumbnail';
      $(selector, context).imagePreviewer(selector, {
        pathToImages: drupalSettings.designSelect.pathToImages,
      });
    }
  };

})(jQuery, Drupal, drupalSettings);
