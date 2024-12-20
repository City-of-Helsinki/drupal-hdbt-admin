((Drupal, once) => {
  Drupal.behaviors.hdbtAdminDropButton = {
    attach: function (context) {
      once('hdbtAdminDropButton', '.dropbutton-multiple:has(.dropbutton--gin)', context).forEach(el => {
        el.querySelector('.dropbutton__toggle').addEventListener('click', () => {
          this.updatePosition(el);

          window.addEventListener('scroll', () => Drupal.debounce(this.updatePositionIfOpen(el), 100));
          window.addEventListener('resize', () => Drupal.debounce(this.updatePositionIfOpen(el), 100));
        });
      });
    },

    updatePosition: function (el) {
      const preferredDir = document.documentElement.dir ?? 'ltr';
      const secondaryAction = el.querySelector('.secondary-action');
      const dropMenu = el.querySelector('.dropbutton__items');
      const toggleHeight = el.offsetHeight;
      const dropMenuHeight = dropMenu.offsetHeight;
      const boundingRect = secondaryAction.getBoundingClientRect();
      const spaceBelow = window.innerHeight - boundingRect.bottom;

      dropMenu.style.position = 'fixed';

      // Remove any existing classes.
      el.classList.remove('paragraphs-open--up', 'paragraphs-open--down');

      // Calculate the menu position based on available space and the preferred
      // reading direction.
      const leftAlignStyles = {
        left: `${boundingRect.left}px`,
        right: 'auto'
      };
      const rightAlignStyles = {
        left: 'auto',
        right: `${window.innerWidth - Math.round(boundingRect.right) + 1}px`
      };

      if ('ltr' === preferredDir) {
        Object.assign(dropMenu.style, leftAlignStyles);
      } else {
        Object.assign(dropMenu.style, rightAlignStyles);
      }

      // Let the element know where the menu is.
      if (spaceBelow >= dropMenuHeight) {
        el.classList.add('paragraphs-open--down');
        dropMenu.style.top = `${boundingRect.bottom}px`;
      } else {
        el.classList.add('paragraphs-open--up');
        dropMenu.style.top = `${boundingRect.top - toggleHeight - dropMenuHeight}px`;
      }
    },

    updatePositionIfOpen: function (el) {
      if (el.classList.contains('open')) {
        this.updatePosition(el);
      }
    },

  };

})(Drupal, once);
