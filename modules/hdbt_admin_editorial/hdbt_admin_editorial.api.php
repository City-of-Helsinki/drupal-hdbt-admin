<?php

/**
 * @file
 * HDBT Admin editorial hooks.
 */

/**
 * @file
 * Hooks provided by the HDBT Admin editorial module.
 */

use Drupal\Core\Form\FormStateInterface;

/**
 * Modify the image list items for the field preview images.
 *
 * @param array $images
 *   Keyed array of image URLs.
 * @param string $field_name
 *   Field name which is uses the preview images.
 */
function hook_hdbt_admin_editorial_design_selection_images_alter(array &$images, string $field_name) {
}

/**
 * Alter the CKEditor link dialog form validation.
 *
 * @param array $form
 *   The form.
 * @param Drupal\Core\Form\FormStateInterface $form_state
 *   The form state.
 */
function hook_helfi_form_editor_link_dialog_alter(array &$form, FormStateInterface &$form_state) {
}
