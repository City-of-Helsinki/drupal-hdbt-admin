'use strict';

(($, Drupal) => {
  Drupal.behaviors.tprEditForm = {
    attach: function attach() {
      const form = document.querySelector('.region-content form');
      const sticky = document.querySelector('.gin-sticky').cloneNode(true);
      const newParent = document.querySelector('.region-sticky__items__inner');

      if (newParent.querySelectorAll('.gin-sticky').length === 0) {
        newParent.appendChild(sticky);

        // Input Elements.
        newParent.querySelectorAll('input[type="submit"]').forEach((el) => {
          el.setAttribute('form', form.id);
          el.setAttribute('id', el.getAttribute('id') + '--gin-edit-form');
        });

        // Make content translation published status reactive.
        // eslint max-nested-callbacks
        document
          .querySelectorAll('.form-item--status [name="status"]')
          .forEach((publishedState) => {
            publishedState.addEventListener('click', (event) => {
              const value = event.target.checked;
              // Sync value
              document
                .querySelectorAll(
                  '.form-item--content-translation-status [name="content_translation[status]"]'
                )
                .forEach((publishedState) => {
                  publishedState.checked = value;
                });
            });
          });

        setTimeout(() => {
          sticky.classList.add('gin-sticky--visible');
        });
      }
    },
  };
})(jQuery, Drupal);
