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
            const thumb = item + '-thumbnail.jpg';
            const pathToThumb = drupalSettings.designSelect.pathToImages + thumb;

            // Craft template and return it.
            return $(`
              <div class="design-selection__wrapper">
                <span>${option.text}</span>
                <img src="${pathToThumb}" data-hover-desc="${option.text}" data-hover-image="${item}" class="design-selection__thumbnail" />
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
    }
  };

  // Offsets for the image position.
  const designSelectionImageXOffset = 32;
  const designSelectionImageYOffset = 32;

  /**
   * When design selection thumbnail is being hovered, load a bigger image
   * of the thumbnail and present it next to the mouse cursor.
   */
  $(document).on('mouseenter', '.select2-container--open .design-selection__thumbnail', function(event) {
    const image = $(this).data('hover-image');
    const description = $(this).data('hover-desc');
    const pathToImage = drupalSettings.designSelect.pathToImages + image + '.jpg';

    // Craft a new element for the design selection preview image.
    $('body').append(`
      <p id="design-selection-preview" class="design-selection__image-wrapper">
        <img class="design-selection__image"src="${pathToImage}" alt="${description}" />
        <span class="design-selection__description">${description}</span>
      </p>
    `);

    // Initialize the preview position.
    $('#design-selection-preview')
      .css('top',(event.pageY - designSelectionImageYOffset) + 'px')
      .css('left',(event.pageX + designSelectionImageXOffset) + 'px')
      .fadeIn(200);
  // When mouse is moved, move along with the cursor.
  }).on('mousemove', '.select2-container--open .design-selection__thumbnail', function(event) {
    let dp = $('#design-selection-preview')
    let height = dp.height();
    dp.css('top',(event.pageY - designSelectionImageYOffset - height) + 'px')
      .css('left',(event.pageX + designSelectionImageXOffset) + 'px');
  // When mouse leaves the thumbnail, remove the preview element.
  }).on('mouseleave', '.select2-container--open .design-selection__thumbnail', function(){
    $('#design-selection-preview').fadeOut(200).remove();
  });

})(jQuery, Drupal, drupalSettings);
