<?php

$test_url = "https://calendar.google.com/calendar/ical/n1f7nf3r1olu3fj73qr1ufksfg%40group.calendar.google.com/private-a712aa4f4884118c36320b561d2a35ae/basic.ics";
$hyper_url = "https://calendar.google.com/calendar/ical/hyperrpg.com_7vro6tuf8i8vd3fk1q090e937o%40group.calendar.google.com/public/basic.ics";
#echo(file_get_contents($test_url));
echo(file_get_contents($hyper_url));

/**
 * NOTE:
 * If this ever stops working (especially if accessing iCloud ics file) then look at:
 * http://michaelteeuw.nl/post/103473463837/fixing-the-magic-mirror-calendar
 */
