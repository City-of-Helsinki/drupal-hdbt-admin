<?php

namespace Drupal\hdbt_admin_editorial\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\select2\Plugin\Field\FieldWidget\Select2Widget;

/**
 * Plugin implementation of the 'design_field_widget' widget.
 *
 * @FieldWidget(
 *   id = "design_field_widget",
 *   module = "hdbt_admin_editorial",
 *   label = @Translation("Design field widget"),
 *   field_types = {
 *     "list_string"
 *   }
 * )
 */
class DesignFieldWidget extends Select2Widget {

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $element = parent::formElement($items, $delta, $element, $form, $form_state);
    $element['#type'] = 'select2';
    $element['#cardinality'] = $this->fieldDefinition->getFieldStorageDefinition()->getCardinality();
    $element['#select2'] = [
      'width' => $this->getSetting('width'),
    ];
    $element['#options'] = $this->getOptions($items->getEntity());
    $element['#default_value'] = $this->getSelectedOptions($items);
    $element['#attached']['library'][] = 'hdbt_admin_editorial/design_selection';
    $element['#attributes']['class'][] = 'design-selection';
    $element['#attributes']['multiple'] = 'multiple';
    return $element;
  }

}
