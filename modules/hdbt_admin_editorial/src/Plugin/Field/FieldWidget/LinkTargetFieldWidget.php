<?php

declare(strict_types = 1);

namespace Drupal\hdbt_admin_editorial\Plugin\Field\FieldWidget;

use Drupal\Component\Utility\UrlHelper;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\linkit\Plugin\Field\FieldWidget\LinkitWidget;
use Drupal\linkit\Utility\LinkitHelper;

/**
 * Plugin implementation of the 'link_target_field_widget' widget.
 *
 * @FieldWidget(
 *   id = "link_target_field_widget",
 *   label = @Translation("Link with target"),
 *   field_types = {
 *     "link"
 *   }
 * )
 */
class LinkTargetFieldWidget extends LinkitWidget {

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      'link_target' => '',
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
