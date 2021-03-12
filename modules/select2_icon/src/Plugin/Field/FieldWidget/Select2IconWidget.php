<?php

namespace Drupal\select2_icon\Plugin\Field\FieldWidget;

use Drupal\Core\Entity\FieldableEntityInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Form\OptGroup;
use Drupal\select2_icon\Plugin\Field\FieldType\Select2Icon;

/**
 * Plugin implementation of the 'select2_icon_widget' widget.
 *
 * @FieldWidget(
 *   id = "select2_icon_widget",
 *   label = @Translation("Select2 Icon"),
 *   field_types = {
 *     "select2_icon"
 *   }
 * )
 */
class Select2IconWidget extends WidgetBase {

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    global $base_secure_url;
    $config = \Drupal::getContainer()->get('config.factory')->getEditable('select2_icon.settings');
    $icon_path = $base_secure_url . '/' . $config->get('path_to_sprite');

    $element['icon'] = [
      '#type' => 'select2',
      '#cardinality' => $this->fieldDefinition->getFieldStorageDefinition()->getCardinality(),
      '#select2' => [
        'width' => $this->getSetting('width') ?? '400px',
      ],
      '#theme' => 'select2_icon_widget',
      '#icons_path' => $icon_path,
      '#options' => Select2Icon::loadIcons(),
      '#default_value' => $this->getSelectedOptions($items),
    ];

    $element['icon']['#attached']['library'][] = 'select2_icon/select2_icon';
    $element['icon']['#attached']['drupalSettings']['select2Icon']['pathToIcons'] = $icon_path;

    return $element;
  }

  /**
   * Returns the array of options for the widget.
   *
   * @param \Drupal\Core\Entity\FieldableEntityInterface $entity
   *   The entity for which to return options.
   *
   * @return array
   *   The array of options for the widget.
   */
  protected function getOptions(FieldableEntityInterface $entity) {
    if (!isset($this->options)) {
      $this->options = Select2Icon::loadIcons();
    }
    return $this->options;
  }

  /**
   * Determines selected options from the incoming field values.
   *
   * @param \Drupal\Core\Field\FieldItemListInterface $items
   *   The field values.
   *
   * @return array
   *   The array of corresponding selected options.
   */
  protected function getSelectedOptions(FieldItemListInterface $items) {
    // In case this widget is used for opt groups.
    $flat_options = OptGroup::flattenOptions($this->getOptions($items->getEntity()));

    $selected_options = [];
    foreach ($items as $item) {
      $value = $item->icon;
      if (isset($flat_options[$value])) {
        $selected_options[] = $value;
      }
    }
    return $selected_options;
  }

}
