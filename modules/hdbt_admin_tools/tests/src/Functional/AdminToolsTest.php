<?php

declare(strict_types = 1);

namespace Drupal\Tests\hdbt_admin_tools\Functional;

use Drupal\Core\Url;
use Drupal\Tests\BrowserTestBase as CoreBrowserTestBase;

/**
 * Base class for multilingual tests.
 */
abstract class BrowserTestBase extends CoreBrowserTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'hdbt_admin_tools',
  ];

  /**
   * Test HDBT Admin tools routes.
   */
  public function testCookieIntroFromPage() : void {
    $routes = [
      'hdbt_admin_tools.list_all' => 'Tools',
      'hdbt_admin_tools.site_settings_form' => 'Site settings',
      'hdbt_admin_tools.taxonomy' => '',
    ];

    foreach ($routes as $route => $title) {
      $this->drupalGet(Url::fromRoute($route));
      $this->assertSession()->statusCodeEquals(403);
    }

    $this->drupalLogin($this->createUser([
      'access administration pages',
      'administer nodes',
      'access taxonomy overview'
    ]));

    foreach ($routes as $route => $title) {
      $this->drupalGet(Url::fromRoute($route));
      $this->assertSession()->statusCodeEquals(200);
      if (!empty($title)) {
        $this->assertSession()->pageTextContains($title);
      }
    }
  }

}
