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
            const basePath = drupalSettings.designSelect.pathToImages;
            const thumbnail = item + '.svg';
            const fallback = drupalSettings.designSelect.fallbackImage;

            // Craft the image template.
            const imageTemplate = $(`
              <div class="design-selection__wrapper">
                <span>${option.text}</span>
                <img src="" data-hover-title="${option.text}" data-hover-image="${item}" class="design-selection__thumbnail" />
              </div>
            `);

            // In case the thumbnail image is not found, replace with default image.
            fetch(basePath + thumbnail).then(function(response) {
              return (response.ok)
                ? imageTemplate.children('img').attr('src', basePath + thumbnail)
                : imageTemplate.children('img').attr('src',basePath + fallback);
            });

            // Return the image template.
            return imageTemplate;
          };
        };

        // Configuration overrides for the design select tool.
        config.templateResult = templateHandler(config.templateResult, designSelect);
        config.minimumResultsForSearch = -1;
        config.theme = 'default design-selection';
        config.fallbackImage = drupalSettings.designSelect.fallbackImage;
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
