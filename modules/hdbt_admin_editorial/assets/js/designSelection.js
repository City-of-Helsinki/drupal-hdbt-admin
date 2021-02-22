/**
 * @file .
 */
(function ($, Drupal) {
  "use strict";
  function formatState (state) {
    if (!state.id) { return state.text; }
    // selectionMarkup = $(
    //   '<span style="align-items: center; display: flex; height: 100%;"><svg class="icon" style="margin-right: 0.5rem; max-width: 2.5rem; max-height: 2.5rem; width: 100%; height: 100%;"><use xlink:href="' +
    //   settings.innebIcons.pathToIcons + '#' + state.element.value + '" /></svg>' +
    //   state.text + '</span>'
    // );
    return $(
      '<div style="align-items: center; display: flex; height: 100%; width: 100%;">' +
        '<img src="/sites/default/files/viljat.jpg" data-lightbox="image-1" class="image" style="width: 50px; height: 50px; border: 2px solid black;" />' +
      '<span>' + state.text + '</span></div>'
    );
  }

  function designWatcher (context) {

    $(context).find('select.form-select.design-selection').once('designSelected').each(
      function() {

        let designSelection = $(this).select2({
          templateResult: formatState,
          width: '100%',
          closeOnSelect: false
        });

        designSelection.on('select2:selecting', function (e) {
          const originalTarget = e.params.args.originalEvent.target;

          if (originalTarget && originalTarget.hasAttribute('class')) {
            const image = $(e.params.args.originalEvent.target).hasClass('image');
            if (image) {
              console.log('ttu')
              const instance = basicLightbox.create(`
                <img src="/sites/default/files/viljat.jpg" style="width: 60vw; height: auto;" />
              `).show();
              e.preventDefault();
            }
          }
        });


//         designSelection.on('select2:selecting', function (e) {
//           const image = $(e.params.args.originalEvent.target).hasClass('image');
// console.log(image);
//           if (image) {
//             new Zooming().listen('.image');
//             console.log('image löytys!');
//             e.preventDefault();
//
//             $('.image').on('click', function(e) {
//               console.log(e.target,'tätäoikeestiklikattiin')
//             })
//           }
//         });
      }
    );
  }


  Drupal.behaviors.designSelection = {
    attach: function (context, settings) {
      designWatcher(context);

      // let designSelection = $('select.form-select.design-selection', context).select2({
      //   templateResult: formatState
      // });

      // designSelection.on("select2:closing", function (e) {  console.log("select2:closing", e); }, context);
      // designSelection.on('select2:select', function (e) {
      //   var data = e.params.data;
      //   console.log(data);
      // });
      //   designSelection.on("select2:select", function (e) {
      //     console.log(e,'select');
      //   });

      // designSelection.on('select2:closing', function (e) {
      //   console.log(e.params.args,'closing');
      //   e.preventDefault();
      // });
    }
  };
})(jQuery, Drupal);
