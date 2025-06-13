'use strict';

(Drupal => {
  Drupal.behaviors.languageReminder = {
    attach(context) {
      if (context !== document) {
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const editedLanguage = params.get('edited_language');

      if (editedLanguage) {
        const targetRegion = context.querySelector('.region.region-highlighted');

        if (targetRegion) {
          const title = Drupal.t('Choose the desired language', {}, {context: 'Language reminder'});
          const message = Drupal.t('You were previously editing the language version: @language. Please choose the desired language version from the list to continue editing.', { '@language': editedLanguage}, {context: 'Language reminder'});
          const wrapper = context.createElement('div');

          wrapper.className = 'messages__wrapper';
          wrapper.innerHTML = `
            <div class="messages messages--warning messages-list__item" aria-labelledby="edited-language-message">
              <div class="messages__header">
                <h2 id="edited-language-message" class="messages__title">${title}</h2>
              </div>
              <div class="messages__content">${message}</div>
            </div>
          `;
          targetRegion.appendChild(wrapper);
        }
      }
    }
  };
})(Drupal);
