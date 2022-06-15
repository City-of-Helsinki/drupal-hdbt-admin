<?php

namespace Drupal\hdbt_admin_editorial\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Session\AccountInterface;

/**
 * Provides the form for reset the chosen user password.
 *
 * @package Drupal\hdbt_admin_editorial\Form
 */
class UserLoginLink extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId(): string {
    return 'user_login_link_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, AccountInterface $user = NULL): array {
    if ($user) {
      $form_state->set('account', $user);
      $form['#title'] = $this->t('Reset password');

      $values = $form_state->getValues();

      if (empty($values)) {
        $form['message'] = [
          '#markup' => '<p>' . $this->t(
            'Click the button below to generate a one-time login link for <strong>%user_name</strong>.',
            ['%user_name' => $user->getAccountName()],
            ['context' => 'HDBT Admin editorial - One-time login link']
          ) . '</p>',
        ];

        $form['actions']['submit'] = [
          '#type' => 'submit',
          '#value' => $this->t('Generate the URL', [], ['context' => 'HDBT Admin editorial - One-time login link']),
        ];
      }
      else {
        $form['title'] = [
          '#markup' => '<h2>' . $this->t('One-time login link for %user_name', [
            '%user_name' => $values['user_name'],
          ], ['context' => 'HDBT Admin editorial - One-time login link']) . '</h2>',
        ];

        $form['link'] = [
          '#markup' => '<p><code>' . $values['login_url'] . '</code></p>',
        ];

        $form['time_limit'] = [
          '#markup' => '<p>' . $this->t("This link is valid for %hr. Do not visit the URL yourself as it will invalidate the login link.", [
            '%hr' => $values['time_limit'] / 3600 . 'h',
          ], ['context' => 'HDBT Admin editorial - One-time login link']) . '</p>',
        ];
      }
    }

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    if (!$form_state->get('account')->id()) {
      $this->messenger()->addError($this->t('There was an error with the account.'));
      return;
    }

    $form_state->setRebuild();
    $user = $form_state->get('account');
    $form_state->setValue('user_name', $user->getAccountName());
    $form_state->setValue('login_url', user_pass_reset_url($form_state->get('account')));
    $form_state->setValue('time_limit', $this->config('user.settings')->get('password_reset_timeout'));
  }

}
