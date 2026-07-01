'use strict';

((Drupal, once) => {

  const WARNING_GREEN = 0;
  const WARNING_YELLOW = 1;
  const WARNING_RED = 2;
  const WARNING_CRITICAL = 3;

  // Translate character count texts.
  const characterCounter = (count, total) => {
    return Drupal.t('Characters: @counted/@total', {
      '@counted': count,
      '@total': total
    }, {context: 'Character counter'});
  };

  // Determine the warning type based on character count.
  const processWarningType = (count, step, total, max) => {
    // Critical blocks input and takes precedence over the other thresholds.
    if (max > 0 && count >= max) {
      return WARNING_CRITICAL;
    }
    return (count >= total) ? WARNING_RED : (count > step && step > 0) ? WARNING_YELLOW : WARNING_GREEN;
  };

  // Translate warning texts based on warning type.
  const characterWarning = (type, step, total, max, input, element) => {

    // The maximum length has been reached, block further input.
    if (type === WARNING_CRITICAL) {
      element.classList.remove('is-hidden');
      element.classList.add('form-notification--critical');
      return Drupal.t('You have reached the maximum length of @max characters.', {
        '@max': max
      }, {context: 'Character counter'});
    }

    // Reset the critical styling for the other warning types.
    element.classList.remove('form-notification--critical');

    // The maximum length has been reached, show warning.
    if (type === WARNING_RED) {
      // Show the warning text.
      element.classList.remove('is-hidden');

      // Use different translations for input and textarea fields.
      if (input === 'input') {
        return Drupal.t('The recommended maximum length for the title is @total characters.', {
          '@total': total
        }, {context: 'Character counter'});
      } else {
        return Drupal.t('The recommended maximum length for the lead is @total characters.', {
          '@total': total
        }, {context: 'Character counter'});
      }
    }

    // The character length is more than 160 chars, show warning.
    if (type === WARNING_YELLOW) {
      element.classList.remove('is-hidden');
      return Drupal.t('Consider shortening. A lead under @step characters works best for search engines.', {
        '@step': step
      }, {context: 'Character counter'});
    }

    // Remove warnings.
    element.classList.add('is-hidden');
    return WARNING_GREEN;
  };

  // Convert HTML tags to single spaces.
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
    attach: function attach(context) {
      // Get all character counter instances using once().
      const counterInstances = once('character-counter', '[data-character-counter]', context);

      if (counterInstances.length === 0) {
        return;
      }

      // Loop through all character counter instances.
      counterInstances.forEach((counterInstance) => {
        const counterCounter = counterInstance.dataset.characterCounter;
        const counterInputTag = counterInstance.dataset.counterInputTag;
        const counterTotalChars = counterInstance.dataset.counterTotal;
        const counterStepChars = counterInstance.dataset.counterStep;
        const counterMaxChars = parseInt(counterInstance.dataset.counterMax, 10) || 0;
        const counterTotal = parseInt(counterTotalChars, 10) || 0;
        // Block at the total length or lower when a smaller maximum is set.
        const counterBlockChars = (counterMaxChars > 0 && counterMaxChars < counterTotal) ? counterMaxChars : counterTotal;
        const counterWarning =  counterInstance.querySelector('.character-counter .form-notification');
        const formItem = context.querySelector(`.${counterCounter}`);

        if (!formItem) {
          return;
        }

        const charCounter = formItem.querySelector('[data-counter-id]');
        const charWarning = formItem.querySelector('[data-warning-id]');
        const textInput = counterInputTag === 'multifield' 
          ? formItem.querySelector('input')
          : formItem.querySelector(counterInputTag);

        if (!textInput) {
          return;
        }

        // Set initial warning type.
        let warningType = WARNING_GREEN;

        // The textarea counter needs to be inserted after the form item.
        // Otherwise, it will be shown in a wrong position in the DOM.
        if (
          counterInputTag === 'textarea' &&
          formItem.parentElement.classList.contains('form-item') &&
          formItem.parentElement.querySelector('.form-item__description')
        ) {
          formItem.parentElement
            .querySelector('.form-item__description')
            .insertAdjacentElement('afterend', counterInstance);
        }

        const updateCharacterCounter = (charCount) => {
          warningType = processWarningType(charCount, counterStepChars, counterTotalChars, counterBlockChars);
          charCounter.textContent = characterCounter(charCount, counterBlockChars);
          if (counterInputTag !== 'multifield') {
            charWarning.textContent = characterWarning(warningType, counterStepChars, counterTotalChars, counterBlockChars, counterInputTag, counterWarning);
          }
        };

        // Trim plain input down to the maximum length and keep the caret.
        const enforcePlainMaxLength = () => {
          if (counterBlockChars > 0 && textInput.value.length > counterBlockChars) {
            const caret = Math.min(textInput.selectionStart, counterBlockChars);
            textInput.value = textInput.value.slice(0, counterBlockChars);
            textInput.setSelectionRange(caret, caret);
          }
        };

        // Handle input tag and textarea tags separately.
        if (counterInputTag === 'input') {
          // Set initial value for the character counter.
          if (textInput.value.length > 0) {
            updateCharacterCounter(textInput.value.length);
          }

          // Add event listener to the input tag and process
          // the charCounter and charWarning.
          textInput.addEventListener('input', function () {
            enforcePlainMaxLength();
            updateCharacterCounter(textInput.value.length);
          });
        } else {
          setTimeout(function () {
            const ckeditorEditable = textInput.parentElement.querySelector('.ck-editor__editable');

            // Add event listener to the textarea tag (CKEditor) and process
            // the charCounter and charWarning.
            if (ckeditorEditable && ckeditorEditable.ckeditorInstance) {
              const editor = ckeditorEditable.ckeditorInstance;
              let lastValidData = editor.getData();
              let isReverting = false;

              // Set initial value for the character counter.
              const initialCount = convertHtmlTags(lastValidData);
              if (initialCount > 0) {
                updateCharacterCounter(initialCount);
              }

              // Block new input once the maximum length is reached.
              editor.model.on('insertContent', (evt) => {
                if (counterBlockChars > 0 && convertHtmlTags(editor.getData()) >= counterBlockChars) {
                  evt.stop();
                }
              }, {priority: 'highest'});

              editor.model.document.on('change:data', () => {
                if (isReverting) {
                  return;
                }
                const charCount = convertHtmlTags(editor.getData());

                // Revert input that exceeds the maximum length.
                if (counterBlockChars > 0 && charCount > counterBlockChars) {
                  isReverting = true;
                  editor.data.set(lastValidData);
                  editor.model.change((writer) => {
                    writer.setSelection(editor.model.document.getRoot(), 'end');
                  });
                  isReverting = false;
                  updateCharacterCounter(convertHtmlTags(lastValidData));
                  return;
                }

                lastValidData = editor.getData();
                // Output the number of words to the counter.
                updateCharacterCounter(charCount);
              });
            }
            // The CKEditor is not used in this textarea. Handle current text
            // input normally.
            else {
              // Set initial value for the character counter.
              if (textInput.value.length > 0) {
                updateCharacterCounter(textInput.value.length);
              }

              // Add event listener to the input tag and process
              // the charCounter and charWarning.
              textInput.addEventListener('input', function () {
                enforcePlainMaxLength();
                updateCharacterCounter(textInput.value.length);
              });
            }
          });
        }
      });
    },
  };

})(Drupal, once);
