<?php

namespace Drupal\select2_icon\Plugin\Field\FieldType;

use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\TypedData\DataDefinition;
use Drupal\Core\Field\FieldItemBase;

/**
 * Plugin implementation of the 'select2_icon' field type.
 *
 * @FieldType(
 *   id = "select2_icon",
 *   label = @Translation("Select2 Icon"),
 *   category = @Translation("Helfi"),
 *   default_widget = "select2_icon_widget",
 *   default_formatter = "select2_icon_formatter"
 * )
 */
class Select2Icon extends FieldItemBase {

  const SELECT2_ICON_CACHE = 'select2_icon_cache';

  /**
   * {@inheritdoc}
   */
  public static function propertyDefinitions(FieldStorageDefinitionInterface $storage) {
    $properties = [];
    $properties['icon'] = DataDefinition::create('string')->setLabel(t('Icon ID'));
    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public static function schema(FieldStorageDefinitionInterface $field_definition) {
    return [
      'columns' => [
        'icon' => [
          'type' => 'char',
          'length' => 255,
        ],
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function isEmpty() {
    return empty($this->get('icon')->getValue());
  }

  /**
   * Load icons array.
   *
   * Load icons either from cache or load them based on the data received from
   * json-file which is saved in configuration.
   *
   * @return array
   *   Returns an array of icons or empty array.
   */
  public static function loadIcons() {
    if ($icons = \Drupal::cache()->get(static::SELECT2_ICON_CACHE)) {
      return $icons->data;
    }
    else {
      $icons = [];
      $config = \Drupal::getContainer()->get('config.factory')->getEditable('select2_icon.settings');
      $json_path = \Drupal::root() . $config->get('path_to_json');

      try {
        if (!$data = file_get_contents($json_path)) {
          throw new \InvalidArgumentException(
            'Failed to load icons due to missing icons data. Verify that the "path_to_json" key contains correct information in the select2_icon.settings configuration.'
          );
        }
      }
      catch (\InvalidArgumentException $e) {
        \Drupal::messenger()->addWarning($e->getMessage());
      }

      $json = json_decode($data, TRUE);

      if (is_array($json) && !empty($json)) {
        $icons = array_combine($json, $json);
        \Drupal::cache()->set(static::SELECT2_ICON_CACHE, $icons);
      }
    }
    return $icons;
  }

}
