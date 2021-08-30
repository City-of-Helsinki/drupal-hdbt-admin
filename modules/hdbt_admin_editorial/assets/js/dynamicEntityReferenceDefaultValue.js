/**
 * @file Dynamic Entity Reference default value selector.
 */
(function (Drupal, drupalSettings) {
  "use strict";

  Drupal.behaviors.designSelection = {
    attach: function (context) {

      /**
       * Trigger default value change on Dynamic Entity Reference field widget.
       */
      Object.keys(drupalSettings.dynamic_entity_reference || {}).forEach(function(field_class) {
        const field = context.querySelector('.' + field_class);
        if (field && field.value === 'tpr_unit') {
          field.dispatchEvent(new Event('change'));
          field.closest('div.form-type--select').classList.add('dynamic-entity-reference-target-type-changed');
        }
      });
    }
  };

})(Drupal, drupalSettings);
