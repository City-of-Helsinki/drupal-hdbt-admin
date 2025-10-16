'use strict';

/**
 * Functionality that adds a hero to entity if the hero-checkbox is checked.
 * Also adds a warning message that hero and side navigation cannot be used together.
 */

(Drupal => {
  Drupal.behaviors.heroToggle = {
    attach(context) {
      if (context !== document) {
        return;
      }

      // Boolean checkbox field that determines if there is hero added or not.
      const heroCheckbox = document.querySelector(
        '.form-item--field-has-hero-value input.form-checkbox'
      );

      // Helper function to trigger event
      function triggerEvent(element, type) {
        const event = new Event(type);
        element.dispatchEvent(event);
      }

      const isBasicPage = (document.querySelector('.node-page-form') || document.querySelector('.node-page-edit-form')) ? true : false;
      const warningNotification = document.createElement('div');
      warningNotification.className = 'form-notification form-notification--warning';

      const iconContainer = document.createElement('div');
      iconContainer.className = 'form-notification__icon';

      const icon = document.createElement('span');
      icon.className = 'hel-icon hel-icon--alert-circle-fill';
      icon.role = 'img';

      iconContainer.appendChild(icon);

      const warningContainer = document.createElement('p');
      warningContainer.className = 'form-notification__warning-text';
      warningContainer.innerHTML = Drupal.t('The hero component and the side navigation cannot be used together. The side navigation will not be visible if the hero component is enabled.');

      warningNotification.appendChild(iconContainer);
      warningNotification.appendChild(warningContainer);

      const hasHeroField = document.querySelector('.js-form-item-field-has-hero-value');
      if (hasHeroField && heroCheckbox.checked) {
        hasHeroField.insertAdjacentElement('afterend', warningNotification);
      }

      if (heroCheckbox) {
        heroCheckbox.addEventListener('click', function () {
          if (this.checked) {
            let addHero = document.querySelector(
              '[data-hdbt-selector="field-hero-action--add"]'
            );
            if (addHero) {
              triggerEvent(addHero, 'mousedown');
              if (isBasicPage) {
                hasHeroField.insertAdjacentElement('afterend', warningNotification);
              }
            }
          } else if (!this.checked) {
            let removeHero = document.querySelector(
              '[data-hdbt-selector="field-hero-action--remove"]'
            );
            if (removeHero) {
              triggerEvent(removeHero, 'mousedown');
              if (isBasicPage && warningNotification ) {
                warningNotification.remove();
              }
            }
          }
        });
      }
    }
  };
})(Drupal);
