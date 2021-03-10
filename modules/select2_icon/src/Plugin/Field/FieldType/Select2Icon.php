<?php

namespace Drupal\select2_icon\Plugin\Field\FieldType;

use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\Field\Plugin\Field\FieldType\StringItemBase;
use Drupal\Core\TypedData\DataDefinition;

/**
 * Plugin implementation of the 'select2_icon' field type.
 *
 * @FieldType(
 *   id = "select2_icon",
 *   label = @Translation("Select2 Icon"),
 *   default_widget = "select2_icon_widget",
 * )
 */
class Select2Icon extends StringItemBase {

  /**
   * {@inheritdoc}
   */
  public static function defaultFieldSettings() {
    return [
      'title' => DRUPAL_OPTIONAL,
    ] + parent::defaultFieldSettings();
  }

  /**
   * {@inheritdoc}
   */
  public static function propertyDefinitions(FieldStorageDefinitionInterface $field_definition) {
    $properties['value'] = DataDefinition::create('string')
      ->setLabel(t('Icon ID'))
      ->addConstraint('Length', ['max' => 127])
      ->setRequired(TRUE);

    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public static function schema(FieldStorageDefinitionInterface $field_definition) {
    return [
      'columns' => [
        'value' => [
          'description' => 'Icon ID.',
          'type' => 'varchar',
          'length' => 127,
        ],
      ],
      'indexes' => [
        'value' => [['value', 20]],
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public static function mainPropertyName() {
    return 'value';
  }

}
