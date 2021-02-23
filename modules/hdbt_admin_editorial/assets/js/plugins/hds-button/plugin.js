/**
 * A plugin for hds-button.
 * Plugin for: http://ckeditor.com/license (GPL/LGPL/MPL: http://ckeditor.com/license)
 */

(function ($, Drupal, CKEDITOR) {

  /**
   * Get currently selected link.
   */
  function getCurrentLink(editor) {
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
    editor.on('change', function (event) {
      let linkElement = getCurrentLink(editor);

      // Act only if link element is being handled.
      if (!linkElement || !linkElement.$) {
        return;
      }

      // Check for the child span.
      let childSpan = linkElement.find('span.hds-button__label');

      // Act only if link element has hds-button class.
      if (linkElement.hasClass('hds-button')) {

        // Add child span if none exist.
        if (childSpan.count() === 0) {

          // If link element has class hds-button, add span with label class.
          let span = editor.document.createElement('span');
          span.setAttribute('class', 'hds-button__label');
          span.setHtml(linkElement.getHtml());
          linkElement.setHtml('');
          linkElement.append(span);
          editor.fire('saveSnapshot');
        }
      }
      // Remove the possible span if one exists.
      else {
        let span = linkElement.findOne('span.hds-button__label');
        if (span) {
          linkElement.setHtml(span.getHtml());
          editor.fire('saveSnapshot');
        }
      }
    });
  }

  CKEDITOR.plugins.add('hds-button', {
    afterInit(editor) {
      alterDrupallinkPlugin(editor);
    },
  });
})(jQuery, Drupal, CKEDITOR);
