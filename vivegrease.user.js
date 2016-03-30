// ==UserScript==
// @name         Vive April Preorder Watcher
// @version      1.0.0
// @description  A userscript to make securing an early Vive preorder as smooth as possible
// @author       Stuart P. Bentley <stuart@testtrack4.com> (https://stuartpb.com)
// @homepageURL  https://github.com/stuartpb/vivegrease
// @downloadURL  https://raw.githubusercontent.com/stuartpb/vivegrease/master/vivegrease.user.js
// @supportURL   https://github.com/stuartpb/vivegrease/issues
// @license      MIT; https://opensource.org/licenses/MIT
// @match        https://store.htcvivecart.com/store/*/quickcart/ThemeID.40533800/OfferID.48383055501
// @match        https://*.htcvive.com/store*
// @grant        none
// ==/UserScript==

/*
The MIT License (MIT)
Copyright (c) 2016 Stuart P. Bentley

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function(){
'use strict';

//////////////////////////
//   CONFIG VARIABLES   //
//////////////////////////

// URLs
// By default, we're using the pages for the United States store.
// This script has only been tested against that system.
// Stores for other regions are not guaranteed to be compatible.
// If you try this using another region, make sure the URLs match the @match
// rules defined in the metadata block above.
// (If they don't, that's not a promising sign for this script working.)

// The page that displays the currently available ship date.
var watchPage = 'https://store.htcvivecart.com/store/htcus/en_US/quickcart/ThemeID.40533800/OfferID.48383055501';
// The page you end up on after clicking "Checkout" on that page.
var checkoutPage = 'https://store.us.htcvive.com/store/htcus/en_US/DisplayThreePgCheckoutAddressPaymentInfoPage';

// The sound to play when the checkout page is opened.
// This will be your notification that an April shipping date has opened up.
var alertSound = 'https://wiki.teamfortress.com/w/images/4/49/Announcer_am_capenabled02.wav';

// The sound to play when the page is checked and not ready.
// If you stop hearing this and didn't hear the alert sound, something has most
// likely gone wrong, and this is your sign to check on it.
var pingSound = 'http://i1.theportalwiki.net/img/6/6f/Turret_ping.wav';

// The regular expression to check for to see if we should move to checkout.
var waveExpression = /April/;

// Billing / shipping information
var formValues = {
  //BILLINGname1: 'Gabe',
  //BILLINGname2: 'Newell',
  //BILLINGcompanyName: 'Valve Software',
  //BILLINGstate: 'WA',

  //BILLINGline1: '10900 NE 4th St',
  //BILLINGline2: '#500',
  //BILLINGpostalCode: '98004',
  //BILLINGcity: 'Bellevue',

  //BILLINGphoneNumber: '(425) 822-5251',

  //EMAILemail: 'gaben@valvesoftware.com',

  // I recommend using PayPal instead of a credit card - on top of the way that
  // this lets you avoid saving payment info in plaintext, the PayPal order
  // confirmation includes a note of which month your Vive will be shipping in
  // before you place it.
  
  // If you do want to use credit card info instead (setting the `usePaypal`
  // variable below to `false`), you should probably use a one-time-use credit
  // card number that you can easily revoke, in case your userscripts get
  // inadvertently uploaded somewhere insecure.

  //cardNumber: '4242424242424242',
  //cardExpirationMonth: '2',
  //cardExpirationYear: '2020',
  //cardSecurityCode: '333'
};
// Don't forget to do a test "Proceed" to see if the store is going to
// recommend using a different format for your address!
// If it seems to be suggesting the exact same thing as what you entered,
// try moving line 2 of your address to line 1.
formValues.EMAILconfirmEmail = formValues.EMAILemail;

// Whether you're shipping to somewhere other than your billing address.
var shippingDifferentThanBilling = !!formValues.SHIPPINGline1;

// Whether to switch the payment method to PayPal on the checkout page.
var usePaypal = true;

// What color to flash the buttons you need to click to continue.
var flashButtonColor = 'lime';

// The number of seconds to wait before refreshing the page.
// Using anything less than 5 seconds delays Half-Life 3 by another year.
var waitSeconds = 10;

//////////////////////////
//     ACTIVE CODE      //
//////////////////////////

function deleteAllCookies() {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

function addStyle(style) {
  var styleEl = document.createElement('style');
  styleEl.textContent = style;
  document.head.appendChild(styleEl);
  return styleEl;
}

function focusAndFlash(buttonId) {
  var flashingButton = document.getElementById(buttonId);
  
  flashingButton.focus();
  flashingButton.scrollIntoView();
  
  function stopFlashing() {
    flashingStyle.remove();
    flashingButton.removeEventListener('click', stopFlashing);
  }
  if (typeof flashButtonColor != 'undefined' && flashButtonColor) {
    var flashingStyle = addStyle(
      '@keyframes checkmeout{'+
        'from{background:' + flashButtonColor + '}' +
        'to{background:auto}' +
      '}' +
      '#' + buttonId + ' {' +
        'animation:checkmeout 500ms infinite ease-in-out'+
      '}');
    flashingButton.addEventListener('click', stopFlashing);
  }
}

function playSound(soundUrl) {
  var audioEl = document.createElement('audio');
  audioEl.src = soundUrl;
  audioEl.autoplay = true;

  // Apparently this sound plays even *without* appending
  // the element to the document (in Chrome at least) - the
  // notion of out-of-tree elements causing activity strikes
  // me as unsavory, so we append it to the document
  // regardless of whether or not we actually have to.
  document.body.appendChild(audioEl);
}

// Function that runs on the first page
function watchForApril() {
  // Delete all cookies to ensure we aren't stuck on a cart that inadvertently
  // contains a headset we were assigned when previously viewing the page
  deleteAllCookies();

  // If the item description mentions the month we're looking for
  if (waveExpression.test(document.getElementById('dr_cartTbl').textContent)) {

    // move to checkout GOGOGOGOGO
    location.href = document.querySelector('#dr_checkoutButton a').href;

  // If it's still not ready
  } else {

    // play heartbeat
    if (typeof pingSound != 'undefined' && pingSound) {
      playSound(pingSound);
    }

    // check again in a few seconds
    setTimeout(location.reload.bind(location), waitSeconds * 1000);
  }
}

// Function that runs on the checkout page
function fillOrder() {
  // Add a little eye-catcher to the page title
  document.title = '!!! ' + document.title;

  // Put all our form values into the page's forms
  var formElements = document.querySelectorAll('input, select');
  for (var i = 0; i < formElements.length; i++) {
    var inputElement = formElements[i];
    var inputValue = formValues[inputElement.name];
    if (inputValue) inputElement.value = inputValue;
  }

  // Toggle payment method to PayPal (if applicable)
  document.getElementById('PayPalExpressCheckout').checked = usePaypal;

  // Opt out of HTC spam
  document.querySelector('#dr_optIn input').checked = false;

  // Set shipping-different-from-billing state
  document.getElementById('shippingDifferentThanBilling').checked =
    shippingDifferentThanBilling;
  // Hide the shipping form if they're the same
  // (the way the page would do it if the user had clicked it off manually)
  if (!shippingDifferentThanBilling) {
    document.getElementById('dr_shippingContainer').style.display = 'none';
  }

  // Scroll to the checkout button so all we have to do is click
  focusAndFlash('checkoutButton');

  // let's make some noise
  if (typeof alertSound != 'undefined' && alertSound) {
    playSound(alertSound);
  }
}

function ignoreCorrections() {
  var originalAddressRadio =
    document.getElementById('shippingAddressOptionRow2');

  // If this looks like a shipping address correction
  if (originalAddressRadio) {
    // set us up to blow past it
    originalAddressRadio.checked = true;
    focusAndFlash('selectionButton');

  // Otherwise, if this looks like the last page of checkout
  } else if (document.getElementById('submitBottom')) {
    // Focus the last button of checkout
    focusAndFlash('submitBottom');
  }
}

// Run the applicable function for this page
switch (location.href) {
  case watchPage: return watchForApril();
  case checkoutPage: return fillOrder();
  default: return ignoreCorrections();
}
})();
