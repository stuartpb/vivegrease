# vivegrease

When preorders for the HTC Vive were opened up to the public, shipments for the entire month of April were booked solid within a matter of hours. However, [due to the way the system is structured](https://www.reddit.com/r/Vive/comments/4bjlyx/us_order_placed_319_shipping_45/d19sgf0), when a preorder that was going to ship in a certain month is cancelled, rather than moving all the preorders that came after it ahead (which would require a lot of rescheduling), their slot is reassigned to the *next* user to preorder a Vive.

As such, impatient hardcore Vive enthusiasts who have yet to secure a preorder can attain one that will arrive a few weeks early by constantly refreshing the page and waiting to order until the page says the next preorder placed will ship *next* month, like [a cartoon cat who circles for twenty extra minutes just to get a parking spot directly in front of the store](http://achewood.com/index.php?date=12162005).

This is a userscript to add to an extension like Greasemonkey or Tampermonkey that will make it so, when a sooner slot opens up, the page will immediately advance to checkout and play a sound to alert you. The actual order itself will not be placed until you explicitly approve it by clicking the "Proceed" and "Place Order" buttons. This userscript can only show you the door: [you're the one that has to walk through it](https://www.youtube.com/watch?v=gABS8a4wm9o).

## Usage

Go to https://github.com/stuartpb/vivegrease/raw/master/vivegrease.user.js to install the script. If you tweak the configurable variables in the first section of the code (under the section labeled "CONFIG VARIABLES"), you can make it so the script will pre-fill your billing and shipping information on the checkout page. (The script will also make it so, when the checkout page is loaded, the checkout button will be in view, have keyboard focus, and be flashing bright green, so even if you're drunk and/or it's 3 AM when a closer slot becomes available, you'll still be able to order just by hitting the spacebar a couple times.)

Once you've installed the script, open up https://www.htcvive.com/preorder/en-us/ in a new window (so the tab will be in the foreground and Chrome won't prevent sounds from playing) and click the link for your country / region as applicable (note that if it's anything other than https://store.htcvivecart.com/store/htcus/en_US/quickcart/ThemeID.40533800/OfferID.48383055501 you'll need to modify the script accordingly). The page will continually refresh as long as the item description is missing the month you're watching for (as in "Your Pre-order will start shipping April 2016"). Every time the page loads, the script will make a soft ping sound to reassure you that it's still running. (If you stop hearing this ping, you should check on the window, as that most likely means that something has gone wrong.)

Keep this window open and your speakers loud. *The Vive must be yours.* Wait by your computer, never moving away from it for any reason, for the potential hours, days, and weeks until the next April preorder cancellation. *No other goal would worthwhile.* Don't leave your house, socialize with friends, prepare meals, or go to the bathroom. *To receive a later shipment is to be deplored.* Be ready to approve your order quickly after the checkout page loads and the notification sound plays. *It must be next month.* Don't blink.

Alternately, don't do any of this, just place a preorder (which will still most likely arrive within two months) whenever's convenient for you, and live life normally. Maybe [watch the Fantastic Contraption developers stream on Twitch](https://www.twitch.tv/ColinNorthway), or get a [View-Master](http://amzn.to/1SxPV88) for your phone and watch VR videos on YouTube. Maybe even brush up on [WebVR](https://mozvr.github.io/webvr-spec/) and start working on your *own* VR games. It's only a few weeks' difference, [not really worth getting all that worked up over](http://www.gocomics.com/calvinandhobbes/2010/04/16).

## License

The MIT License (MIT)

Copyright (c) 2016 Stuart P. Bentley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
