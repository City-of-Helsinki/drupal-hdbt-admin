<?php

namespace Drupal\hdbt_admin_editorial\Plugin\Validation\Constraint;

use Symfony\Component\Validator\Constraint;

/**
 * Checks that the image is present if design needs the image.
 *
 * @Constraint(
 *   id = "HeroImage",
 *   label = @Translation("Hero image is missing, but it is mandatory with selected design.", context = "Validation"),
 *   type = "entity:paragraph"
 * )
 */
class HeroImageConstraint extends Constraint {
  /**
   * Message shown for the Hero paragraph.
   *
   * @var string
   */
  public $heroImageRequired = 'Image is mandatory when the design needs it.';

  /**
   * Designs which need an image.
   */
  public $heroImageMandatoryDesigns = [
    'background-image',
    'with-image-bottom',
    'with-image-left',
    'with-image-right',
    'diagonal'
  ];
}
