'use strict';

// Global variables for paragraphs limit, delay and observer status.
const paragraphsLimit = 40;
const delay = 2000;
let observerInitialized = false;

/**
 * Check how many paragraph elements exist on the page and updates
 * the warning text accordingly. The functionality shows the warning text
 * if there are more than 40 paragraphs on the page.
 */
const updateParagraphCounter = () => {
  const counterWarning = document.querySelector('.paragraphs-counter__warning');
  if (!counterWarning) return;

  const allParagraphs = document.querySelectorAll('.paragraph-top:not([data-drupal-selector*="hero"])');

  if (allParagraphs.length > paragraphsLimit) {
    const warningText = counterWarning.querySelector('.paragraphs-counter__warning-text');

    counterWarning.classList.remove('is-hidden');
    warningText.innerHTML = Drupal.t(
      'The page contains many content elements (e.g., accordions, embeds, columns, banners): !counted. Consider reducing the number of elements to !total or moving some of the content to its own page. Having too many elements can prevent the page from being saved.',
      {
        '!counted': '<strong>' + allParagraphs.length + '</strong>',
        '!total': '<strong>' + paragraphsLimit + '</strong>'
      },
      { context: 'Paragraphs counter' }
    );
  } else {
    counterWarning.classList.add('is-hidden');
  }
};

/**
 * Avoid triggering expensive operations repeatedly.
 *
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @return {Function} - A debounced version of the input function
 */
const debounce = (func, wait = delay) => {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
};

((Drupal) => {
  Drupal.behaviors.paragraphsCounter = {
    attach() {
      updateParagraphCounter();

      if (observerInitialized) return;
      observerInitialized = true;

      // Observe only the paragraph container for changes in child elements
      const paragraphsContainer = document.querySelector('.field--type-entity-reference-revisions');
      if (!paragraphsContainer) return;

      // Re-run the paragraph count when DOM changes are detected.
      const observer = new MutationObserver(
        debounce(() => {
          updateParagraphCounter();
        }, delay)
      );
      // Start observing the container and its children for added/removed nodes.
      observer.observe(paragraphsContainer, {
        childList: true,
        subtree: true,
      });
    },
  };

})(Drupal);
