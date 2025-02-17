'use strict';

(($, Drupal) => {
  Drupal.behaviors.tprEditForm = {
    attach: function attach() {
      const newParent = document.querySelector('.region-sticky__items__inner');
      const statusInput = newParent.querySelectorAll('.js-tpr-entity-status');

      if (statusInput.length > 0) {
        // Make content translation published status reactive.
        // eslint max-nested-callbacks
        statusInput.forEach((publishedState) => {
          publishedState.addEventListener('click', (event) => {
            const value = event.target.checked;
            // Sync published state value.
            document
              .querySelectorAll(
                '.form-item--content-translation-status [name="content_translation[status]"]'
              )
              .forEach((publishedState) => {
                publishedState.checked = value;
              });
          });
        });
      }
    },
  };

})(jQuery, Drupal);
