/**
 * Originally based upon work by Carl Saggs (v0.2) - https://github.com/thybag/JavaScript-Ical-Parser/
 */
function icalParser(icalUrl, callback){
    var rawData = null; //Store of unprocessed data.
    var events = [];    //Store of processed data.

    //==================================================================================================================

    /**
     * loadFile
     * Using AJAX to load the requested .ics file, passing it to the success function when completed.
     * @param url URL of .ics file
     * @param success Function to call on successful completion.
     */
    function loadFile(url, success) {
        //Create request object
        try {
            xmlhttp = window.XMLHttpRequest?new XMLHttpRequest(): new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch (e) {}

        //Grab file
        xmlhttp.onreadystatechange = function(){
            if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
                //On success, run success.
                success(xmlhttp.responseText);
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);
    }

    /**
     * makeDate
     * Convert the dateformat used by ICalendar in to one more suitable for javascript.
     * @param  icalDate { String }
     * @return dt object, includes javascript Date + day name, hour/minutes/day/month/year etc.
     */
    function makeDate(icalDate) {
        //break date apart
        var dt =  {
            year: icalDate.substr(0,4),
            month: icalDate.substr(4,2),
            day: icalDate.substr(6,2),
            hour: icalDate.substr(9,2),
            minute: icalDate.substr(11,2)
        };
        //Create JS date (months start at 0 in JS - don't ask)
        dt.date = new Date(dt.year, (dt.month-1), dt.day, dt.hour, dt.minute);
        //Get the full name of the given day
        dt.dayname =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dt.date.getDay()];

        return dt;
    }

    //==================================================================================================================

    /**
     * parseICAL
     * Convert the ICAL format in to a number of javascript objects (Each representing a date)
     *
     * @param data Raw ICAL data
     */
    function parseICAL(data) {
        //Ensure cal is empty
        events = [];

        //Clean string and split the file so we can handle it (line by line)
        cal_array = data.replace(new RegExp( "\\r", "g" ), "").split("\n");

        //Keep track of when we are activly parsing an event
        var in_event = false;
        //Use as a holder for the current event being proccessed.
        var cur_event = null;
        for(var i=0;i<cal_array.length;i++){
            ln = cal_array[i];
            //If we encounted a new Event, create a blank event object + set in event options.
            if(!in_event && ln == 'BEGIN:VEVENT'){
                in_event = true;
                cur_event = {};
            }
            //If we encounter end event, complete the object and add it to our events array then clear it for reuse.
            if(in_event && ln == 'END:VEVENT'){
                in_event = false;
                events.push(cur_event);
                cur_event = null;
            }
            //If we are in an event
            if(in_event){
                //Split the item based on the first ":"
                idx = ln.indexOf(':');
                //Apply trimming to values to reduce risks of badly formatted ical files.
                type = ln.substr(0,idx).replace(/^\s\s*/, '').replace(/\s\s*$/, '');//Trim
                val = ln.substr(idx+1,ln.length-(idx+1)).replace(/^\s\s*/, '').replace(/\s\s*$/, '');

                //If the type is a start date, proccess it and store details
                if(type =='DTSTART'){
                    dt = makeDate(val);
                    val = dt.date;
                    //These are helpful for display
                    cur_event.start_time = dt.hour+':'+dt.minute;
                    cur_event.start_date = dt.day+'/'+dt.month+'/'+dt.year;
                    cur_event.day = dt.dayname;
                }
                //If the type is an end date, do the same as above
                if(type =='DTEND'){
                    dt = makeDate(val);
                    val = dt.date;
                    //These are helpful for display
                    cur_event.end_time = dt.hour+':'+dt.minute;
                    cur_event.end_date = dt.day+'/'+dt.month+'/'+dt.year;
                    cur_event.day = dt.dayname;
                }
                //Convert timestamp
                if(type =='DTSTAMP') val = makeDate(val).date;

                //Add the value to our event object.
                cur_event[type] = val;
            }
        }

        //Sort the data so its in date order.
        events.sort(function(a,b){
            return a.DTSTART-b.DTSTART;
        });

        //Run callback method, if was defined. (return self)
        if(typeof callback == 'function') callback(this);
    }

    //==================================================================================================================

    /**
     * getEvents
     * return all events found in the ical file.
     *
     * @return list of events objects
     */
    function getEvents() {
        return events;
    }

    /**
     * getFutureEvents
     * return all events sheduled to take place after the current date.
     *
     * @return list of events objects
     */
    function getFutureEvents() {
        var now = new Date();

        return events.filter(function(itm){
            return itm.DTSTART > now;
        });
    }

    function getThisWeekEvents() {
        var start = calcWeekStart();
        var end = calcWeekEnd();
        return events.filter(function(itm){
            return (itm.DTSTART >= start) && (itm.DTSTART < end);
        });
    }

    // Avoiding maths....
    // 86400000 = 1 day in milliseconds

    function calcDayStart() {
        var day = new Date();
        day.setHours(0,0,0,0);
        return day;
    }

    function calcWeekStart() {
        var week = calcDayStart();
        week.setUTCMilliseconds(week.getUTCMilliseconds() - (86400000 * week.getDay()));
        return week;
    }

    function calcWeekEnd() {
        var week = calcWeekStart();
        week.setUTCMilliseconds(week.getUTCMilliseconds() + (86400000 * 7));
        return week;
    }

    //------------------------------------------------------------------------------------------------------------------

    this.getEvents = getEvents;
    this.getFutureEvents = getFutureEvents;
    this.getThisWeekEvents = getThisWeekEvents;
    this.calcDayStart = calcDayStart;
    this.calcWeekStart = calcWeekStart;
    this.calcWeekEnd = calcWeekEnd;

    //==================================================================================================================

    //Load the file
    loadFile(icalUrl, function(data){
        //if the file loads, store the data and invoke the parser
        rawData = data;
        parseICAL(data);
    });
}