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
    if (max > 0 && count >= max) {
      return WARNING_CRITICAL;
    }
    return (count >= total) ? WARNING_RED : (count > step && step > 0) ? WARNING_YELLOW : WARNING_GREEN;
  };

  // Translate warning texts based on warning type.
  const characterWarning = (type, step, total, max, input, element, field) => {

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

    // Show warning at the recommended maximum.
    if (type === WARNING_RED) {
      element.classList.remove('is-hidden');

      // Use different translations per field.
      if (input === 'input') {
        return Drupal.t('The recommended maximum length for the title is @total characters.', {
          '@total': total
        }, {context: 'Character counter'});
      } else if (field.includes('lead')) {
        return Drupal.t('The recommended maximum length for the lead is @total characters.', {
          '@total': total
        }, {context: 'Character counter'});
      } else {
        return Drupal.t('The recommended maximum length for the body is @total characters.', {
          '@total': total
        }, {context: 'Character counter'});
      }
    }

    // Show recommendation warning past the recommended step.
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

  // Count the characters after stripping HTML.
  const convertHtmlTags = (data) => {
    return data
      // Replace all HTML tags with a single space.
      .replace(/<[^>]*>/g, ' ')
      // Replace all consecutive whitespaces with a single space.
      .replace(/\s+/g, ' ')
      // Replace HTML entities with a single space.
      .replace(/&#?[a-z0-9]+;/gi, ' ')
      // Remove leading and trailing whitespaces.
      .trim().length;
  };

  Drupal.behaviors.characterCounter = {
    attach: function attach(context) {
      // Get all character counter instances.
      const counterInstances = once('character-counter', '[data-character-counter]', context);

      if (counterInstances.length === 0) {
        return;
      }

      counterInstances.forEach((counterInstance) => {
        const counterCounter = counterInstance.dataset.characterCounter;
        const counterInputTag = counterInstance.dataset.counterInputTag;
        const counterTotalChars = counterInstance.dataset.counterTotal;
        const counterStepChars = counterInstance.dataset.counterStep;
        const counterMaxChars = parseInt(counterInstance.dataset.counterMax, 10) || 0;
        const counterTotal = parseInt(counterTotalChars, 10) || 0;
        const counterBlockChars = counterMaxChars > 0 ? counterMaxChars : 0;
        const counterDisplayTotal = counterTotal;
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

        let warningType = WARNING_GREEN;

        // Insert the textarea counter after the form item description.
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
          charCounter.textContent = characterCounter(charCount, counterDisplayTotal);
          if (counterInputTag !== 'multifield') {
            charWarning.textContent = characterWarning(warningType, counterStepChars, counterTotalChars, counterBlockChars, counterInputTag, counterWarning, textInput.name);
          }
        };

        // Block plain input past the maximum length.
        if (counterBlockChars > 0) {
          textInput.maxLength = counterBlockChars;
        }

        // Handle input tag and textarea tags separately.
        if (counterInputTag === 'input') {
          // Set initial value for the character counter.
          if (textInput.value.length > 0) {
            updateCharacterCounter(textInput.value.length);
          }

          // Update the counter on input.
          textInput.addEventListener('input', function () {
            updateCharacterCounter(textInput.value.length);
          });
        } else {
          setTimeout(function () {
            const ckeditorEditable = textInput.parentElement.querySelector('.ck-editor__editable');

            // Update the counter from CKEditor.
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
                updateCharacterCounter(charCount);
              });
            }
            // Handle a textarea without CKEditor.
            else {
              // Set initial value for the character counter.
              if (textInput.value.length > 0) {
                updateCharacterCounter(textInput.value.length);
              }

              // Update the counter on input.
              textInput.addEventListener('input', function () {
                updateCharacterCounter(textInput.value.length);
              });
            }
          });
        }
      });
    },
  };

})(Drupal, once);
