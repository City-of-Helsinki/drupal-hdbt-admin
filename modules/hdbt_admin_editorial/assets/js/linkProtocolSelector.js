// Handle protocol selection for the link dialog.

(function (Drupal, $) {

  'use strict';

  Drupal.behaviors.link_protocol_selection = {
    attach: function () {
      let hrefInput = $('form.editor-link-dialog input[data-drupal-selector="edit-attributes-href"]');
      let protocol = $('form.editor-link-dialog select[data-drupal-selector="edit-attributes-protocol"]');
      if (hrefInput.val()) {
        $('form.editor-link-dialog .form-item--attributes-protocol').hide();
      }

      protocol.change((event) => {
        let chosenProtocol = $(event.target).val();
        if (chosenProtocol && chosenProtocol !== 'false') {
          hrefInput.val(chosenProtocol);
        }
      }).change();

      hrefInput.on('input', (event) => {
        let input = $(event.target);
        if (input.val() && input.val() !== '') {
          $('form.editor-link-dialog .form-item--attributes-protocol').hide();
        }
        else {
          $('form.editor-link-dialog .form-item--attributes-protocol').show();
        }
      });
    }
  };

}(Drupal, jQuery));
