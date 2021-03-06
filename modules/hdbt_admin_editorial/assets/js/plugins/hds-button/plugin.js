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
   * Handle icon classes.
   */
  function handleClasses(editor, linkElement, elementClasses) {
    linkElement.$.classList = elementClasses;
    linkElement.$.dataset.ckeSavedClass = elementClasses;
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

        // Check if design has been selected (or exists) and act accordingly.
        if (linkElement.$.dataset.design) {
          const design = linkElement.$.dataset.design;
          let classList = design;

          // Set design as data-attribute.
          linkElement.setAttribute('data-design', design);

          // Handle button designs.
          if (design !== 'link') {

            // Add button label if none exist.
            if (buttonLabel.count() === 0) {
              handleLabelSpan(editor, linkElement);
            }

            // Add link-external icon if link element has class hds-button and
            // it's pointing to blank.
            if (linkElement.getAttribute('target') === '_blank') {
              classList += ' hdbt-icon hdbt-icon--link-external';
            }

            // Add the selected icon, if one exists.
            if (linkElement.$.dataset.icon) {
              classList = design;
              classList += ' hdbt-icon hdbt-icon--' + linkElement.$.dataset.icon;
              linkElement.setAttribute('data-icon', linkElement.$.dataset.icon);
            }
          }
          // Remove the possible spans if one exists.
          else {
            handleLabelSpan(editor, linkElement, 'remove');
          }

          // Set link classes based on user selections.
          handleClasses(editor, linkElement, classList);
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
