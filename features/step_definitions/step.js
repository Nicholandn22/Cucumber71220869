import { expect, should } from "chai";
import { Builder, By, until } from "selenium-webdriver";
import { When, Then, Given, setDefaultTimeout } from "@cucumber/cucumber";


setDefaultTimeout(30000);
let driver;


Given("the user is on the login page", async function () {
  driver = new Builder().forBrowser("chrome").build();
  await driver.get("https://www.saucedemo.com/");
});
When("the user enters a valid username and password", async function () {
  await driver.findElement(By.id("user-name")).sendKeys("standard_user");
  await driver.findElement(By.id("password")).sendKeys("secret_sauce");
});
When("the user clicks the login button", async function () {
  await driver.findElement(By.id("login-button")).click();
  // Alternatif
  // await driver.findElement(By.css("input[type='submit']")).click();
});
Then("the user should see a success message", async function () {
  const message = await driver
    .wait(until.elementLocated(By.className("title")), 5000)
    .getText();
  expect(message).to.equal("Products");
  const item = await driver.findElement(By.id("item_4_img_link"));
  expect(item).to.exist;
  await driver.quit();
});

// beda

When("the user enters an invalid username and password", async function () {
  await driver.findElement(By.id("user-name")).clear();
  await driver.findElement(By.id("password")).clear();

  await driver.findElement(By.id("user-name")).sendKeys("invalid_user");
  await driver.findElement(By.id("password")).sendKeys("wrong_password");
});

Then("the user should see a failed message", async function () {
  const errorBox = await driver.wait(
    until.elementLocated(By.css("[data-test='error']")),
    5000
  );
  const errorMessage = await errorBox.getText();
  expect(errorMessage).to.include("Username and password do not match");

  await driver.quit(); // tutup browser setelah tes
});

// beda
Given("the user is on the item page", async function () {
  // Login first if not already logged in
  try {
    await driver.findElement(By.className("title"));
  } catch (error) {
    // If not on products page, login first
    await driver.findElement(By.id("user-name")).sendKeys("standard_user");
    await driver.findElement(By.id("password")).sendKeys("secret_sauce");
    await driver.findElement(By.id("login-button")).click();
    await driver.wait(until.elementLocated(By.className("title")), 5000);
  }
});

When("the user add item to the cart", async function () {
  // Add first item to cart
  await driver.findElement(By.id("add-to-cart-sauce-labs-backpack")).click();
});

When("the user in the item list", async function () {
  // Navigate to cart
  await driver.findElement(By.className("shopping_cart_link")).click();
  await driver.wait(until.elementLocated(By.className("title")), 5000);
});

Then("item should be seen in the item page", async function () {
  const cartTitle = await driver.findElement(By.className("title")).getText();
  expect(cartTitle).to.equal("Your Cart");

  const cartItem = await driver.findElement(
    By.className("inventory_item_name")
  );
  expect(cartItem).to.exist;

  const itemName = await cartItem.getText();
  expect(itemName).to.equal("Sauce Labs Backpack");
});

When("the user remove item to the cart", async function () {
  // Remove item from cart
  await driver.findElement(By.id("remove-sauce-labs-backpack")).click();
});

Then("item shouldn't be seen in the item page", async function () {
  const cartItems = await driver.findElements(By.className("cart_item"));
  expect(cartItems.length).to.equal(0);
  await driver.quit();
});

When("the user leaves the username and password blank", async function () {
  await driver.findElement(By.id("user-name")).clear();
  await driver.findElement(By.id("password")).clear();
});

When("the user adds multiple items to the cart", async function () {
  await driver.findElement(By.id("add-to-cart-sauce-labs-backpack")).click();
  await driver.findElement(By.id("add-to-cart-sauce-labs-bike-light")).click();
  await driver
    .findElement(By.id("add-to-cart-sauce-labs-bolt-t-shirt"))
    .click();
});

Then("all added items should be seen in the item page", async function () {
  const items = await driver.findElements(By.className("inventory_item_name"));
  const itemNames = await Promise.all(
    items.map(async (el) => await el.getText())
  );
  expect(itemNames).to.include.members([
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
    "Sauce Labs Bolt T-Shirt",
  ]);
});

Given("the user is on the homepage", async function () {
  driver = new Builder().forBrowser("chrome").build();
  await driver.get("https://www.saucedemo.com");
});

When("the user clicks the About Us link", async function () {
  // Tunggu sampai burger menu muncul (max 5 detik)
  const burgerButton = await driver.wait(
    until.elementLocated(By.id("react-burger-menu-btn")),
    15000
  );
  await burgerButton.click();

  // Tambahkan sedikit delay agar animasi menu sempat terbuka
  await driver.sleep(3000); // 1 detik

  // Tunggu About link muncul (max 5 detik)
  const aboutLink = await driver.wait(
    until.elementLocated(By.id("about_sidebar_link")),
    15000
  );
  await aboutLink.click();

  const currentUrl = await driver.getCurrentUrl();
  console.log("Current URL before clicking burger:", currentUrl);
});

Then("the About Us page should be displayed", async function () {
  // Tunggu sampai URL berubah dan mengandung 'saucelabs.com'
  await driver.wait(async () => {
    const url = await driver.getCurrentUrl();
    console.log("Current URL:", url); // Debugging
    return url.includes("saucelabs.com");
  }, 15000); // Naikkan timeout jadi 15 detik

  const currentUrl = await driver.getCurrentUrl();
  if (!currentUrl.includes("saucelabs.com")) {
    throw new Error("Not redirected to Sauce Labs website");
  }
});
