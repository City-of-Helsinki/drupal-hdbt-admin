/**
 * Functionality that adds a hero to entity if the hero-checkbox is checked.
 */

// Boolean checkbox field that determines if there is hero added or not.
const heroCheckbox = document.querySelector(
  '.form-item--field-has-hero-value input.form-checkbox'
);

// Helper function to trigger event
function triggerEvent(element, type) {
  const event = new Event(type);
  element.dispatchEvent(event);
}

if (heroCheckbox) {
  heroCheckbox.addEventListener('click', function () {
    if (this.checked) {
      let addHero = document.querySelector(
        '[data-hdbt-selector="field-hero-action--add"]'
      );
      if (addHero) {
        triggerEvent(addHero, 'mousedown');
      }
    } else if (!this.checked) {
      let removeHero = document.querySelector(
        '[data-hdbt-selector="field-hero-action--remove"]'
      );
      if (removeHero) {
        triggerEvent(removeHero, 'mousedown');
      }
    }
  });
}
