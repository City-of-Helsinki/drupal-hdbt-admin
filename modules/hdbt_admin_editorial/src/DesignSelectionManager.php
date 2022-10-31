<?php

declare(strict_types = 1);

namespace Drupal\hdbt_admin_editorial;

use Drupal\Core\Extension\ModuleHandlerInterface;

/**
 * Service class for global navigation related functions.
 */
class DesignSelectionManager {

  /**
   * The module handler service.
   *
   * @var \Drupal\Core\Extension\ModuleHandlerInterface
   */
  protected ModuleHandlerInterface $moduleHandler;

  /**
   * Constructs a new DesignSelectionManager object.
   *
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler.
   */
  public function __construct(ModuleHandlerInterface $module_handler) {
    $this->moduleHandler = $module_handler;
  }

  /**
   * Get image paths based on available images.
   *
   * @param string $field_name
   *   Field name to be handled.
   * @param array $selections
   *   Array of field selections.
   *
   * @return array
   *   Returns an array of image paths.
   */
  public function getImages(string $field_name, array $selections) : array {
    if (empty($field_name)) {
      return [];
    }

    global $base_secure_url;
    $asset_path = $this->moduleHandler->getModule('hdbt_admin_editorial')->getPath() . '/assets/images';
    $images = [];

    foreach ($selections as $selection) {
      $asset = "$asset_path/{$field_name}--$selection.svg";
      $images[$selection] = (file_exists(DRUPAL_ROOT . '/' . $asset))
        ? "$base_secure_url/$asset"
        : "$base_secure_url/$asset_path/custom-style.svg";
    }

    // Let modules to alter the image lists.
    $this->moduleHandler->alter('design_selection_images', $images, $field_name);

    return $images;
  }

}