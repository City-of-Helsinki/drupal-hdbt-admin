<?php

namespace Drupal\select2_icon\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;

/**
 * Plugin implementation of the 'select2_icon' field formatter.
 *
 * @FieldFormatter(
 *   id = "select2_icon_formatter",
 *   label = @Translation("Select2 Icon"),
 *   field_types = {
 *     "select2_icon",
 *   }
 * )
 */
class Select2IconFormatter extends FormatterBase {

  /**
   * Define how the field type is showed.
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    global $base_secure_url;
    $config = \Drupal::getContainer()->get('config.factory')->getEditable('select2_icon.settings');
    $icon_path = $base_secure_url . '/' . $config->get('path_to_sprite');
    $elements = [];

    foreach ($items as $delta => $item) {
      $elements[$delta] = [
        '#theme' => 'select2_icon',
        '#sprite_url' => $icon_path,
        '#icon_id' => $item->icon,
      ];
    }

    return $elements;
  }

}
