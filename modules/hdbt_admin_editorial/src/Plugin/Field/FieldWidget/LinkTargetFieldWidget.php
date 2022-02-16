<?php

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
   * {@inheritdoc}
   */
  public function massageFormValues(
    array $values,
    array $form,
    FormStateInterface $form_state
  ) {
    foreach ($values as &$value) {
      // Linkit module performs a check if given external domain points to
      // same domain and converts it to relative if it does.
      // This breaks all links between different hel.fi instances because all
      // hel.fi links are converted to relative and helfi_proxy module adds a
      // 'site prefix' to all non-absolute URLs.
      // TL;DR www.hel.fi/helsinki/old-page becomes /helsinki/old-page and
      // helfi_proxy module converts it to /fi/site-prefix/helsinki/old-page.
      // @see https://helsinkisolutionoffice.atlassian.net/browse/UHF-2919.
      if (
        !UrlHelper::isExternal($value['uri']) ||
        !UrlHelper::externalIsLocal($value['uri'], \Drupal::request()->getSchemeAndHttpHost())
      ) {
        $value['uri'] = LinkitHelper::uriFromUserInput($value['uri']);
      }
      $value += ['options' => []];
    }
    return $values;
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
