'use strict';

((Drupal) => {
  const characterCounter = (count, total) => {
    return Drupal.t('Characters: @counted/@total', {'@counted': count, '@total': total}, {context: 'Character counter'});
  };

  const characterWarning = (count, step, total, input) => {
    if (count >= total) {
      if (input === 'input') {
        return Drupal.t('The recommended maximum length for the title is @total characters.', {'@total': total}, {context: 'Character counter'});
      }
      else {
        return Drupal.t('The recommended maximum length for the lead is @total characters.', {'@total': total}, {context: 'Character counter'});
      }
    } else if (count > step && step > 0) {
      return Drupal.t('Consider shortening. A lead under @step characters works best for search engines.', {'@step': step}, {context: 'Character counter'});
    }
    return '';
  };

  const convertHtmlTags = (data) => {
    return data
      // Replace all HTML tags with a single space.
      .replace(/<[^>]*>/g, ' ')
      // Replace all consecutive whitespace characters with a single space.
      .replace(/\s+/g, ' ')
      // Replace HTML character entities with a single space.
      .replace(/&#?[a-z0-9]+;/i, ' ')
      // Remove leading and trailing whitespace and return the length.
      .trim().length;
  };

  Drupal.behaviors.characterCounter = {
    attach: function attach() {

      const counterInstances = document.querySelectorAll('[data-counter-id]');

      if (!counterInstances) {
        return;
      }

      counterInstances.forEach(function (counterInstance) {
        if (!counterInstance.dataset.counterId) {
          return;
        }
        const counterInputTag = counterInstance.dataset.counterInputTag;
        const counterTotalChars = counterInstance.dataset.counterTotal;
        const counterStepChars = counterInstance.dataset.counterStep;
        const formItem = document.querySelector(`.${counterInstance.dataset.counterId}`);

        if (!formItem) {
          return;
        }

        const charCounter = formItem.querySelector('[data-counter-id]');
        const charWarning = formItem.querySelector('[data-warning-id]');
        const textInput = formItem.querySelector(counterInputTag);

        if (!textInput) {
          return;
        }

        // Set initial value for the character counter.
        if (textInput.value.length > 0) {
          charCounter.textContent = characterCounter(textInput.value.length, counterTotalChars);
          charWarning.textContent = characterWarning(textInput.value.length, counterStepChars, counterTotalChars, counterInputTag);
        }

        if (counterInputTag === 'input') {
          textInput.addEventListener('input', function () {
            charCounter.textContent = characterCounter(textInput.value.length, counterTotalChars);
            charWarning.textContent = characterWarning(textInput.value.length, counterStepChars, counterTotalChars, counterInputTag);
          });
        }
        else {
          setTimeout(function() {
            const ckeditorEditable = textInput.parentElement.querySelector('.ck-editor__editable');
            if (ckeditorEditable && ckeditorEditable.ckeditorInstance) {
              const editor = ckeditorEditable.ckeditorInstance;
              editor.model.document.on('change:data', () => {
                // Output the number of words to the console
                charCounter.textContent = characterCounter(convertHtmlTags(editor.getData()), counterTotalChars);
                charWarning.textContent = characterWarning(convertHtmlTags(editor.getData()), counterStepChars, counterTotalChars, counterInputTag);
              } );
            }
          });
        }
      });
    },
  };

})(Drupal);
