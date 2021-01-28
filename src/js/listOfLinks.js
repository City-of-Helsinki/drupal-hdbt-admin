(function ($) {
  /**
   * Function that shows and hides fields on the List of Links Item paragraph
   * based on the active design chosen in the List of Links paragraph.
   *
   * @param design
   * @param images
   * @param descs
   */
  function toggleFields(design, images, descs) {
    // Get the selected design.
    let selectedDesign = design.val();

    // Design without image: Image field is hidden and description shown.
    if (selectedDesign === 'without-image') {
      images.each(function () {
        $(this).hide();
      });

      descs.each(function () {
        $(this).show();
      });
    }

    // Design with image: Image field is shown and description hidden.
    else if (selectedDesign === 'with-image') {
      images.each(function () {
        $(this).show();
      });

      descs.each(function () {
        $(this).hide();
      });
    }

    // Design without image and description: Both fields are hidden.
    else if (selectedDesign === 'without-image-desc') {
      images.each(function () {
        $(this).hide();
      });

      descs.each(function () {
        $(this).hide();
      });
    }
  }

  /**
   * The function that goes through each paragraph that is type List of Links
   * and toggles the fields using the designSelection function.
   */
  function loopThroughParagraphs() {
    // Find all the List of Links paragraphs.
    let paragraphs = $('.paragraph-type--list-of-links');

    // Go through each paragraph.
    paragraphs.each(function () {
      // Find the design for the paragraph in question.
      let design = $(this).find(
        '.field--name-field-list-of-links-design select'
      );

      // Find the images and descriptions of the List of Links child paragraphs.
      let images = $(this).find('.field--name-field-list-of-links-image');
      let descs = $(this).find('.field--name-field-list-of-links-desc');

      // Run the toggle function for fields
      toggleFields(design, images, descs);

      // On design value change, run the toggle function again for the fields.
      design.change(function () {
        toggleFields(design, images, descs);
      });
    });
  }

  /**
   * Each time ajax is run on the node-edit form we need to also trigger the
   * toggle for the fields according to the design.
   */
  $(document).ajaxComplete(() => {
    loopThroughParagraphs();
  });

  /**
   * When the dom is loaded show & hide the elements according to the design.
   */
  $(document).ready(function () {
    loopThroughParagraphs();
  });
})(jQuery);
