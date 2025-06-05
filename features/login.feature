Feature: User Login
 As a user
 I want to login using a valid email
 So that I can access the application

 Scenario: Successful login with valid details
 Given the user is on the login page
 When the user enters a valid username and password
 And the user clicks the login button
 Then the user should see a success message

Scenario: Failed login with invalid credential
 Given the user is on the login page
 When the user enters an invalid username and password
 And the user clicks the login button
 Then the user should see a failed message

Scenario: Successfully adding an item to cart
 Given the user is on the login page
 And the user is on the item page
 When the user add item to the cart
 And the user in the item list
 Then item should be seen in the item page

Scenario: Successfully removing an item from cart
 Given the user is on the login page
 And the user is on the item page
 When the user add item to the cart
 And the user in the item list
 When the user remove item to the cart
 Then item shouldn't be seen in the item page


Scenario: Add multiple items to cart
  Given the user is on the login page
  And the user is on the item page
  When the user adds multiple items to the cart
  And the user in the item list
  Then all added items should be seen in the item page

Scenario: User can navigate to About Us page
 Given the user is on the homepage
 When the user enters a valid username and password
 And the user clicks the login button
 When the user clicks the About Us link
 Then the About Us page should be displayed

