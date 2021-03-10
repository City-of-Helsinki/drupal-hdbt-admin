<?php

namespace Drupal\select2_icon\Plugin\Field\FieldWidget;

use Drupal\Core\Entity\FieldableEntityInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\select2\Plugin\Field\FieldWidget\Select2Widget;
use GuzzleHttp\Exception\RequestException;

define('SELECT2_ICON_CACHE', 'select2_icon_cache');

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
class Select2IconWidget extends Select2Widget {

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $element = parent::formElement($items, $delta, $element, $form, $form_state);

    global $base_secure_url;
    $config = \Drupal::getContainer()->get('config.factory')->getEditable('select2_icon.settings');
    $icon_path = $base_secure_url . '/' . $config->get('path_to_sprite');

    $element['#theme'] = 'select2_icon';
    $element['#icons_path'] = $icon_path;
    $element['#attached']['library'][] = 'select2_icon/select2_icon';
    $element['#attached']['drupalSettings']['select2Icon']['pathToIcons'] = $icon_path;

    /** @var \Drupal\Core\Field\Plugin\Field\FieldType\StringItemBase $item */
    $element += [
      '#default_value' => $this->getSelectedOptions($items),
    ];

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
      $this->options = $this->loadIcons();
    }
    return $this->options;
  }

  /**
   * Get icons either from cache or load them based on the data received from
   * json-file which is saved in configuration.
   *
   * @return array|false
   *   Returns and array of icons or false.
   */
  private function loadIcons() {
    if ($icons = \Drupal::cache()->get(SELECT2_ICON_CACHE)) {
      return $icons->data;
    }
    else {
      $config = \Drupal::getContainer()->get('config.factory')->getEditable('select2_icon.settings');
      $json_path = \Drupal::root() . $config->get('path_to_json');

      try {
        $data = file_get_contents($json_path);
        $json = json_decode($data, true);

        if (is_array($json) && !empty($json)) {
          $icons = array_combine($json, $json);

          \Drupal::cache()->set(SELECT2_ICON_CACHE, $icons);
          return $icons;
        }
      } catch (RequestException $e) {
        watchdog_exception('select2_icon', $e);
      }
    }
    return FALSE;
  }

}
