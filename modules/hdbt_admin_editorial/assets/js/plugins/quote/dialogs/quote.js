/**
 * @file
 * The quote dialog definition.
 *
 * Created out of the CKEditor Plugin SDK:
 * http://docs.ckeditor.com/#!/guide/plugin_sdk_sample_1
 */

// Our dialog definition.
CKEDITOR.dialog.add('quoteDialog', function (editor) {
  return {

    // Basic properties of the dialog window: title, minimum size.
    title: editor.lang.quote.dialogTitle,
    minWidth: 400,
    minHeight: 200,

    // Dialog window contents definition.
    contents: [
      {
        // Definition of the Basic Settings dialog tab (page).
        id: 'tab-basic',
        label: 'Basic Settings',

        // The tab contents.
        elements: [
          {
            // Quote text input field.
            type: 'textarea',
            id: 'text',
            label: editor.lang.quote.dialogQuoteText,
            validate: CKEDITOR.dialog.validate.notEmpty(editor.lang.quote.dialogQuoteTextNotEmpty),

            // Called by the main setupContent call on dialog initialization.
            setup: function (element) {
              let paragraphs = element.find('p.quoted__text');
              if (paragraphs.count() > 0) {
                let quote = paragraphs.getItem(0).getText();
                for (let i = 1; i < paragraphs.count(); i++) {
                  quote += '\n' + paragraphs.getItem(i).getText();
                }
                this.setValue(quote);
              }
              else {
                // It is a common blockquote without <p>.
                this.setValue(element.getText());
              }
            },

            // Called by the main commitContent call on dialog confirmation.
            commit: function (element) {
              // Clear element HTML.
              element.setHtml('');

              // Set a <p> for each line.
              let lines = this.getValue().split(/\r\n|\r|\n/g);
              for (let i = 0; i < lines.length; i++) {
                let p = editor.document.createElement('p');
                p.setText(lines[i]);
                p.setAttribute('class', 'quoted__text');
                element.append(p);
              }
            }
          },
          {
            // Quote author input field.
            type: 'text',
            id: 'author',
            label: editor.lang.quote.dialogQuoteAuthor,

            // Called by the main setupContent call on dialog initialization.
            setup: function (element) {
              let authorElem = element.findOne('footer.quoted__author');
              if (authorElem !== null) {
                this.setValue(authorElem.getText());
              }
            },

            // Called by the main commitContent call on dialog confirmation.
            commit: function (element) {
              let authorElem = element.findOne('footer.quoted__author');
              if (authorElem === null) {
                if (this.getValue() !== '') {
                  authorElem = editor.document.createElement('footer');
                  element.append(authorElem);
                  authorElem.setAttribute('class', 'quoted__author');
                  authorElem.setText(this.getValue());
                }
              }
              else {
                if (this.getValue() !== '') {
                  authorElem.setAttribute('class', 'quoted__author');
                  authorElem.setText(this.getValue());
                }
                else {
                  // Author has been removed, remove authorElem.
                  authorElem.remove();
                }
              }
            }
          }
        ]
      }
    ],

    // Invoked when the dialog is loaded.
    onShow: function () {
      // Get the selection in the editor.
      let selection = editor.getSelection();

      // Get the element at the start of the selection.
      let element = selection.getStartElement();

      // Get the authorElem element closest to the selection, if any.
      if (element) {
        let parent = element.getAscendant('div');
        if (parent && parent.hasClass('quoted')) {
          element = parent;
        }
      }

      // Create a new <authorElem> element if it does not exist.
      if (!element || !element.hasClass('quoted')) {
        element = editor.document.createElement('div');
        element.addClass('quoted');
        // Flag the insertion mode for later use.
        this.insertMode = true;
      }
      else {
        this.insertMode = false;
      }

      // Store the reference to the <authorElem> element in an internal property, for later use.
      this.element = element;

      // Invoke the setup methods of all dialog elements, so they can load the element attributes.
      if (!this.insertMode) {
        this.setupContent(this.element);
      }
    },

    // This method is invoked once a user clicks the OK button, confirming the dialog.
    onOk: function () {
      let divQuote = this.element;
      // Invoke the commit methods of all dialog elements, so the <blockquote> element gets modified.
      this.commitContent(divQuote);

      // Finally, in if insert mode, inserts the element at the editor caret position.
      if (this.insertMode) {
        editor.insertElement(divQuote);
      }
    }
  };
});
