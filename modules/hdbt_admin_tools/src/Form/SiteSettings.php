<?php

namespace Drupal\hdbt_admin_tools\Form;

/**
 * @file
 * Contains Drupal\hdbt_admin_tools\Form\SiteSettings.
 */

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Site settings.
 */
class SiteSettings extends ConfigFormBase {

  const COLOR_PALETTE_CACHE = 'hdbt_admin_tools:theme_color';

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'hdbt_admin_tools.site_settings',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'hdbt_admin_tools_site_settings';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form = parent::buildForm($form, $form_state);
    $settings = $this->config('hdbt_admin_tools.site_settings');

    $form['#tree'] = TRUE;
    $form['#prefix'] = '<div class="layer-wrapper">';
    $form['#suffix'] = '</div>';

    $form['site_settings'] = [
      '#type' => 'fieldset',
      '#open' => TRUE,
      '#title' => $this->t('Site wide settings'),
    ];

    $form['site_settings']['theme_color'] = [
      '#type' => 'radios',
      '#title' => $this->t('Color palette'),
      '#options' => $this->getColorPalettes(),
      '#description' => $this->t('The chosen color palette will be used site wide in various components.'),
      '#default_value' => $settings->get('site_settings')['theme_color'] ?: [],
    ];

    $icons = [
      'group' => $this->t('Group'),
      'home-smoke' => $this->t('Home'),
      'face-smile' => $this->t('Smiley'),
      'heart-fill' => $this->t('Heart'),
      'star-fill' => $this->t('Star'),
      'layers' => $this->t('Layers'),
    ];

    $form['site_settings']['default_icon'] = [
      '#type' => 'radios',
      '#title' => $this->t('Default liftup image'),
      '#options' => $icons,
      '#description' => $this->t('This liftup image will be used site wide if none are provided.'),
      '#default_value' => $settings->get('site_settings')['default_icon'] ?: [],
    ];

    $wave_motifs = [
      'wave' => $this->t('Wave'),
      'vibration' => $this->t('Vibration'),
      'beat' => $this->t('Beat'),
      'pulse' => $this->t('Pulse'),
      'basic' => $this->t('Basic motif'),
      // 'calm' => $this->t('Calm'),
    ];

    $form['site_settings']['koro'] = [
      '#type' => 'radios',
      '#title' => $this->t('Select wave motif'),
      '#options' => $wave_motifs,
      '#description' => $this->t(
        'See wave motifs from <a href=":vig" target="_blank">Visual Identity Guidelines</a>.',
        [':vig' => 'https://brand.hel.fi/en/wave-motifs/']
      ),
      '#default_value' => $settings->get('site_settings')['koro'] ?: [],
    ];

    $form['footer_settings'] = [
      '#type' => 'fieldset',
      '#open' => TRUE,
      '#title' => $this->t('Footer settings'),
    ];

    $form['footer_settings']['footer_color'] = [
      '#type' => 'select',
      '#title' => $this->t('Select footer background color'),
      '#options' => [
        'dark' => $this->t('Dark'),
        'light' => $this->t('Light'),
      ],
      '#default_value' => $settings->get('footer_settings')['footer_color'],
    ];

    $form['footer_settings']['footer_top_title'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Footer top title'),
      '#default_value' => $settings->get('footer_settings')['footer_top_title'],
    ];

    $form['footer_settings']['footer_top_content'] = [
      '#type' => 'text_format',
      '#format' => $settings->get('footer_settings')['footer_top_content']['format'],
      '#title' => $this->t('Footer top content'),
      '#default_value' => $settings->get('footer_settings')['footer_top_content']['value'],
    ];

    $form['#attached']['library'][] = 'hdbt_admin_tools/site_settings';
    $form['#attached']['library'][] = 'hdbt/color-palette';

    return $form;
  }

  /**
   * Get color palettes.
   *
   * @return array
   *   Returns color palettes.
   */
  public static function getColorPalettes() {
    return [
      'bus' => t('Bus'),
      'coat-of-arms' => t('Coat of Arms'),
      'copper' => t('Copper'),
      'gold' => t('Gold'),
      'engel' => t('Engel'),
      'metro' => t('Metro'),
      'silver' => t('Silver'),
      'summer' => t('Summer'),
      'suomenlinna' => t('Suomenlinna'),
      'tram' => t('Tram'),
    ];
  }

  /**
   * Provides default value for the color palettes field.
   *
   * @return string
   *   An array of possible key and value options.
   *
   * @see options_allowed_values()
   */
  public static function getColorPaletteDefaultValue() {
    if ($cached = \Drupal::cache()->get(static::COLOR_PALETTE_CACHE)) {
      return $cached->data;
    }

    $settings = \Drupal::config('hdbt_admin_tools.site_settings');
    if ($value = $settings->get('site_settings.theme_color')) {
      \Drupal::cache()->set(static::COLOR_PALETTE_CACHE, $value);
      return $value;
    }
    return '';
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);
    $settings = $this->configFactory->getEditable('hdbt_admin_tools.site_settings');
    $settings->set('site_settings', $form_state->getValue('site_settings'))->save();
    $settings->set('footer_settings', $form_state->getValue('footer_settings'))->save();

    // Flush all caches when settings have been saved.
    drupal_flush_all_caches();
  }

}
