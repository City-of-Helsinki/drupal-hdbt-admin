// Handle protocol selection for the link dialog.

(function (Drupal, $) {

  'use strict';

  // Simple show / hide functionality.
  const handleVisibilty = function (element, show = true) {
    return (show) ? element.show() : element.hide();
  }

  Drupal.behaviors.linkProtocolSelection = {
    attach: function () {
      const hrefInput = $('form.editor-link-dialog input[data-drupal-selector="edit-attributes-href"]');
      const protocol = $('form.editor-link-dialog select[data-drupal-selector="edit-attributes-data-protocol"]');

      if (hrefInput && protocol) {
        protocol.change((event) => {
          let chosenProtocol = $(event.target).val();
          if (chosenProtocol && chosenProtocol !== 'false') {
            hrefInput.val(chosenProtocol);
          }
        }).change();

        if (hrefInput.val()) {
          handleVisibilty($('form.editor-link-dialog .form-item--attributes-data-protocol'), false);
        }

        hrefInput.on('input', (event) => {
          let input = $(event.target);
          handleVisibilty($('form.editor-link-dialog .form-item--attributes-data-protocol'), input.val() === '');
        });
      }
    }
  };

  Drupal.behaviors.linkIconSelection = {
    attach: function () {
      const design = $('form.editor-link-dialog select[data-drupal-selector="edit-attributes-data-design"]');

      if (design) {
        design.change((event) => {
          let chosenDesign = $(event.target).val();
          handleVisibilty($('form.editor-link-dialog .form-item--attributes-data-icon'), chosenDesign !== 'link');
        }).change();
      }
    }
  };

}(Drupal, jQuery));
