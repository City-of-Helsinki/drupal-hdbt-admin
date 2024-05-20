/**
 * @file
 * Updating news field group auto toggle if there is content.
 */

(function (once) {

  'use strict';

  const updatingNews = once(
    'updating-news-auto-toggle',
    '[data-drupal-selector="edit-group-updating-news"]'
  );

  if (updatingNews.length === 0) {
    return;
  }

  updatingNews.forEach(details => {
    const updatingNewsContent = details.querySelector(
      'table.field-news-item-updating-news-values > tbody'
    );

    if (updatingNewsContent) {
      details.open = true;
    }
  });
})(once);
