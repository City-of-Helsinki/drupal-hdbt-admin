<?php

namespace Drupal\hdbt_admin_editorial\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\linkit\Plugin\Field\FieldWidget\LinkitWidget;

/**
 * Plugin implementation of the 'link_target_icon_field_widget' widget.
 *
 * @FieldWidget(
 *   id = "link_target_icon_field_widget",
 *   label = @Translation("Link with target and icon"),
 *   field_types = {
 *     "link"
 *   }
 * )
 */
class LinkTargetIconFieldWidget extends LinkitWidget {

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      'link_target' => '',
      'icon' => '',
    ] + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $element = parent::formElement($items, $delta, $element, $form, $form_state);
    $item = $this->getLinkItem($items, $delta);
    $options = $item->get('options')->getValue();

    $element['options']['target_new'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Open in new window/tab'),
      '#return_value' => TRUE,
      '#default_value' => $options['target_new'] ?? FALSE,
      '#weight' => 98,
    ];

    $element['options']['icon'] = [
      '#type' => 'select2_icon_element',
      '#title' => $this->t('Icon'),
      '#default_value' => $options['icon'] ?? NULL,
      '#weight' => 99,
    ];

    return $element;
  }

  /**
   * Get link items.
   *
   * @param \Drupal\Core\Field\FieldItemListInterface $items
   *   Field items.
   * @param string $delta
   *   Field delta with item.
   *
   * @return \Drupal\link\LinkItemInterface
   *   Returns an array of link items.
   */
  private function getLinkItem(FieldItemListInterface $items, $delta) {
    return $items[$delta];
  }

}
