/**
 * @file Design selection.
 */
(function ($, Drupal, drupalSettings) {
  "use strict";

  Drupal.behaviors.designSelection = {
    attach: function (context) {

      $('.design-selection', context).on('select2-init', function (event) {
        let config = $(event.target).data('select2-config');
        let designSelect = $(event.target).data('designSelect');

        const templateHandler = function (parentHandler, design) {
          const parentDesign = design;
          return function (option, container) {
            if (parentHandler) { parentHandler(option, container); }
            if (!option.id) { return option.text; }
            if (!parentDesign) { return option.text; }

            const link_designs = [
              'hero-link-design',
              'banner-link-design',
            ];
            let design = parentDesign;

            if (link_designs.includes(parentDesign)) {
              design = 'link-design';
            }

            const item = design + '--' + option.element.value;
            const thumb = item + '-thumbnail.jpg';
            const pathToThumb = drupalSettings.designSelect.pathToImages + thumb;

            return $(`
              <div class="design-selection__wrapper">
                <span>${option.text}</span>
                <img src="${pathToThumb}" data-hover-desc="${option.text}" data-hover-image="${item}" class="design-selection__thumbnail" />
              </div>
            `);
          };
        };

        config.templateResult = templateHandler(config.templateResult, designSelect);
        config.minimumResultsForSearch = -1;
        config.theme = 'default design-selection';
        $(event.target).data('select2-config', config);
      });
    }
  };

  const designSelectionImageXOffset = 32;
  const designSelectionImageYOffset = 32;

  $(document).on('mouseenter', '.select2-container--open .design-selection__thumbnail', function(event) {
    const image = $(this).data('hover-image');
    const description = $(this).data('hover-desc');
    const pathToImage = drupalSettings.designSelect.pathToImages + image + '.jpg';
    $('body').append(`
      <p id="design-selection-preview" class="design-selection__image-wrapper">
        <img class="design-selection__image"src="${pathToImage}" alt="${description}" />
        <span class="design-selection__description">${description}</span>
      </p>
    `);
    $('#design-selection-preview')
      .css('top',(event.pageY - designSelectionImageYOffset) + 'px')
      .css('left',(event.pageX + designSelectionImageXOffset) + 'px')
      .fadeIn(200);
  }).on('mousemove', '.select2-container--open .design-selection__thumbnail', function(event) {
    let dp = $('#design-selection-preview')
    let height = dp.height();
    dp.css('top',(event.pageY - designSelectionImageYOffset - height) + 'px')
      .css('left',(event.pageX + designSelectionImageXOffset) + 'px');

  }).on('mouseleave', '.select2-container--open .design-selection__thumbnail', function(){
    $('#design-selection-preview').fadeOut(200).remove();
  });

})(jQuery, Drupal, drupalSettings);
