/**
 * A plugin for hds-button.
 * Plugin for: http://ckeditor.com/license (GPL/LGPL/MPL: http://ckeditor.com/license)
 */

(function ($, Drupal, CKEDITOR) {

  /**
   * Get currently selected link.
   */
  function getCurrentLink(editor) {
    if (!editor.getSelection()) return null;

    const selected = editor.getSelection();
    const domElement = selected.getSelectedElement();

    if (domElement && domElement.is('a')) {
      return domElement;
    }

    const range = selected.getRanges(true)[0];

    if (range) {
      range.shrink(CKEDITOR.SHRINK_TEXT);
      return editor.elementPath(range.getCommonAncestor()).contains('a', 1);
    }

    return null;
  }

  /**
   * Handle icon span.
   */
  function handleIconSpan(editor, linkElement, action = 'add') {
    if (action === 'add') {
      let iconSpan = document.createElement('span');
      iconSpan.setAttribute('aria-hidden', 'true');
      iconSpan.classList.add('hds-button__icon', 'hds-icon');
      // Set the icon which should be used.
      iconSpan.classList.add('hds-icon--link-external');
      linkElement.$.append(iconSpan);
    }
    else {
      let spanIcon = linkElement.findOne('span.hds-button__icon');
      if (spanIcon) {
        spanIcon.remove();
      }
    }
    editor.fire('saveSnapshot');
  }

  /**
   * Handle label span.
   */
  function handleLabelSpan(editor, linkElement, action = 'add') {
    if (action === 'add') {
      let span = editor.document.createElement('span');
      span.setAttribute('class', 'hds-button__label');
      span.setHtml(linkElement.getHtml());
      linkElement.setHtml('');
      linkElement.append(span);
    }
    else {
      let spanLabel = linkElement.findOne('span.hds-button__label');
      if (spanLabel) {
        linkElement.setHtml(spanLabel.getHtml());
      }
    }
    editor.fire('saveSnapshot');
  }

  /**
   * Integrates the hds-button plugin with the drupallink plugin.
   */
  function alterDrupallinkPlugin(editor) {
    // Nothing to integrate with if the drupallink plugin is not loaded.
    if (!editor.plugins.drupallink) {
      return;
    }

    // Register a linkable widget for drupallink: hds-button.
    CKEDITOR.plugins.drupallink.registerLinkableWidget('hds-button');

    // Act on ckeditor content change.
    editor.getCommand('drupallink').on('exec', function () {
      let linkElement = getCurrentLink(editor);

      // Act only if link element is being handled.
      if (!linkElement || !linkElement.$) {
        return;
      }

      // Check if link has link text and set it as data attribute.
      let text = linkElement.$.innerText;
      if (text) {
        linkElement.setAttribute('data-link-text', text);
      }
    });

    // Act on drupal dialog close.
    $(window).on('dialog:afterclose', function (e) {
      // Act only if editor instance is ready.
      if (editor.instanceReady) {
        let linkElement = getCurrentLink(editor);

        // Act only if link element is being handled.
        if (!linkElement || !linkElement.$) {
          return;
        }

        // Check for the button label.
        let buttonLabel = linkElement.find('span.hds-button__label');
        let buttonIcon = linkElement.find('span.hds-button__icon');

        // Act only if link element has hds-button class.
        if (linkElement.hasClass('hds-button')) {

          // Add button label if none exist.
          if (buttonLabel.count() === 0) {
            handleLabelSpan(editor, linkElement);
          }

          // If link element has class hds-button and it's pointing to blank.
          if (linkElement.getAttribute('target') === '_blank') {

            // Add button icon if none exist.
            if (buttonIcon.count() === 0) {
              handleIconSpan(editor, linkElement);
            }
          }
          // Remove the possible icon span if one exists.
          else {
            handleIconSpan(editor, linkElement, 'remove');
          }
        }
        // Remove the possible spans if one exists.
        else {
          handleLabelSpan(editor, linkElement, 'remove');
        }

        // Check if link text has changed and act accordingly.
        if (linkElement.$.dataset.linkText && linkElement.$.innerText) {
          if (linkElement.$.dataset.linkText !== linkElement.$.innerText) {
            linkElement.$.innerText = linkElement.$.dataset.linkText;
          }
        }
        editor.fire('saveSnapshot');
      }
    });
  }

  CKEDITOR.plugins.add('hds-button', {
    afterInit(editor) {
      alterDrupallinkPlugin(editor);
    },
  });
})(jQuery, Drupal, CKEDITOR);
