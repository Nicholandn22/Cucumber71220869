import assert from 'assert';
import { Given, When, Then } from '@cucumber/cucumber';

Given('I do something', function () {
  assert.strictEqual(1 + 1, 2);
});
