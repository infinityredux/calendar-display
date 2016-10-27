var calendar;
var events = [];

icalParser('hyper.ics', function(cal){
//icalParser('calendarProxy.php', function(cal){
    calendar = cal;
    console.log(cal.getEvents());
    console.log(cal.getFutureEvents());
    events = cal.getThisWeekEvents();
    console.log(events);
});