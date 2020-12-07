<?php

namespace Drupal\hdbt_admin_tools\Form;

/**
 * @file
 * Contains Drupal\hdbt_admin_tools\Form\SiteHeaderSettings.
 */

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\NodeStorageInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class SiteSettings extends ConfigFormBase {

  /**
   * Node storage.
   *
   * @var \Drupal\node\NodeStorageInterface
   */
  protected $nodeStorage;

  /**
   * {@inheritdoc}
   */
  public function __construct(ConfigFactoryInterface $config_factory, NodeStorageInterface $node_storage) {
    parent::__construct($config_factory);
    $this->nodeStorage = $node_storage;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    /* @var \Drupal\Core\Entity\EntityTypeManagerInterface */
    $entityTypeManager = $container->get('entity_type.manager');

    return new static(
      $container->get('config.factory'),
      $entityTypeManager->getStorage('node')
    );
  }

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

    $form['koro_settings'] = [
      '#type' => 'fieldset',
      '#open' => TRUE,
      '#title' => $this->t('Wave motif'),
    ];

    $form['koro_settings']['koro'] = [
      '#type' => 'select',
      '#title' => $this->t('Select wave motif'),
      '#options' => [
        'wave' => $this->t('Wave'),
        'vibration' => $this->t('Vibration'),
        'beat' => $this->t('Beat'),
        'pulse' => $this->t('Pulse'),
        'basic' => $this->t('Basic motif'),
        // 'calm' => $this->t('Calm'),
      ],
      '#description' => $this->t(
        'See wave motifs from <a href=":vig" target="_blank">Visual Identity Guidelines</a>.',
        [':vig' => 'https://brand.hel.fi/en/wave-motifs/']
      ),
      '#default_value' => $settings->get('koro_settings')['koro'],
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

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);
    $settings = $this->configFactory->getEditable('hdbt_admin_tools.site_settings');
    $settings->set('koro_settings', $form_state->getValue('koro_settings'))->save();
    $settings->set('footer_settings', $form_state->getValue('footer_settings'))->save();
  }

}
