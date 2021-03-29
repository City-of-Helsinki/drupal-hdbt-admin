/**
 * @file Design selection.
 */
(function ($, Drupal, drupalSettings) {
  "use strict";

  function formatState (state, container, design) {
    if (!state.id) { return state.text; }
    const link_designs = [
      'hero-link-design',
      'banner-link-design',
    ];

    if (link_designs.includes(design)) {
      design = 'link-design';
    }

    const item = design + '--' + state.element.value;
    const thumb = item + '-thumbnail.jpg';
    const pathToThumb = drupalSettings.designSelect.pathToImages + thumb;

    return $(`
      <div class="design-selection__wrapper">
        <img src="${pathToThumb}" data-lightbox="${item}" class="design-selection__image" />
        <span>${state.text}</span>
      </div>    
    `);
  }

  function designWatcher (context) {
    $(context)
      .find('select.form-select.design-selection')
      .once('designSelected')
      .each(function() {

        // Initialize select2 for design selection select tag.
        const designSelect = $(this);
        const designSelection = designSelect.select2({
          templateResult: (a, b) => {
            return formatState(a, b, designSelect[0].dataset.designSelect);
          },
          width: '400px',
          minimumResultsForSearch: -1,
        });

        let defaultSelection = designSelection.val();

        // Act when select2 is opened.
        designSelection.on('select2:open', function() {
          // Trigger unselect to deselect everything.
          // Otherwise user cannot expand the image.
          designSelection.val(null).trigger('change');
        });

        // Act when select2 is closed.
        designSelection.on('select2:closing', function() {
          // If user haven't selected any item, select the default selection.
          if (designSelection.val() == null) {
            designSelection.val(defaultSelection).trigger('change');
          }
        });

        // Act when selection is being selected.
        designSelection.on('select2:selecting', function(event) {
          const target = event.params.args.originalEvent.target;

          // Construct lightbox if the thumbnail was clicked.
          if (target && target.dataset.lightbox) {
            const item = target.dataset.lightbox + '.jpg';
            const pathToImage = drupalSettings.designSelect.pathToImages + item;

            const lightbox = basicLightbox.create(`
              <img src="${pathToImage}" style="width: 60vw; height: auto;" />
            `, {
              onClose: (instance) => {
                designSelect.select2('open');
              }
            }).show();

            // Return false to stop propagation. Prevents "select" event to fire.
            return false;
          }
        });
      }
    );
  }

  Drupal.behaviors.designSelection = {
    attach: function (context, settings) {
      designWatcher(context);
    }
  };
})(jQuery, Drupal, drupalSettings);
