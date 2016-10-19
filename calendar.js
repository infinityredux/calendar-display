var url = 'https://calendar.google.com/calendar/ical/n1f7nf3r1olu3fj73qr1ufksfg%40group.calendar.google.com/private-a712aa4f4884118c36320b561d2a35ae/basic.ics';
var calendar;
var events;

ical_parser(url, function(cal){
    calendar = cal;
    events = cal.getEvents();
    console.log(events);
});