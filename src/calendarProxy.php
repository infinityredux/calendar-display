<?php

$url = "https://calendar.google.com/calendar/ical/n1f7nf3r1olu3fj73qr1ufksfg%40group.calendar.google.com/private-a712aa4f4884118c36320b561d2a35ae/basic.ics";
echo(file_get_contents($url));

/**
 * If this ever stops working (especially if accessing iCloud ics) then look at:
 * http://michaelteeuw.nl/post/103473463837/fixing-the-magic-mirror-calendar
 */
