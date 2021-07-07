<?php

namespace Drupal\select2_icon\Element;

use Drupal\Core\Form\FormStateInterface;
use Drupal\select2\Element\Select2;
use Drupal\select2_icon\Plugin\Field\FieldType\Select2Icon;

/**
 * Provides an Select2 Icon form element.
 *
 * @FormElement("select2_icon_element")
 */
class Select2IconFormElement extends Select2 {

  /**
   * {@inheritdoc}
   */
  public static function processSelect(&$element, FormStateInterface $form_state, &$complete_form) {
    // Set icons for the options.
    $element['#options'] = [$element['#empty_value'] => ''] + Select2Icon::loadIcons();
    return $element;
  }

  /**
   * {@inheritdoc}
   */
  public static function preRenderSelect($element) {
    $element = parent::preRenderSelect($element);

    global $base_secure_url;
    $settings = \Drupal::config('select2_icon.settings');
    $icon_path = $base_secure_url . $settings->get('path_to_sprite');

    // Set attributes to include the select2_icon library and settings.
    $element['#theme'] = 'select2_icon_widget';
    $element['#attributes']['class'][] = 'select2-icon';
    $element['#attached']['library'][] = 'select2_icon/select2_icon';
    $element['#attached']['drupalSettings']['select2Icon']['pathToIcons'] = $icon_path;

    return $element;
  }

}
