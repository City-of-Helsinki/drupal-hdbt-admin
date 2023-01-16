<?php

declare(strict_types = 1);

namespace Drupal\Tests\hdbt_admin_tools\Functional;

use Drupal\Core\Url;
use Drupal\Tests\BrowserTestBase;

/**
 * Tests HDBT admin tools module.
 *
 * @group hdbt_admin
 */
class AdminToolsTest extends BrowserTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'hdbt_admin_tools',
  ];

  /**
   * {@inheritdoc}
   */
  protected $defaultTheme = 'stark';

  /**
   * Test HDBT Admin tools routes.
   */
  public function testAdminToolsRoutes() : void {
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
      'access taxonomy overview',
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
