const moment = require('moment');
moment().format();
// moment().utcOffset(120);

var eventList = [];

var Event = function(opening, recurring, startDate, endDate){
  this.opening = opening;
  this.recurring = recurring;
  this.startDate = startDate;
  this.endDate = endDate;

  eventList.push(this);
};

Event.prototype.availabilities = function(fromDate, toDate){
  availabilities(fromDate, toDate);
  return 0;//Something awesome;
};

function availabilities(fromDate, toDate) {
  var availableEvents = [];
  var unavailableEvents = [];
  // for each event in eventList, check that is happens during given Date interval
  // and sort events in two groups based on availability (opening window or busy window)
  for (var i = 0; i < eventList.length; i++) {
    // find
    var event = eventList[i];
    if (
        event.startDate >= fromDate && event.endDate <= toDate
        || eventIsRecurringAndInDateInterval(event, fromDate, toDate)
      ) {
        if (event.opening) {
          availableEvents.push(event);
        } else {
          unavailableEvents.push(event);
        }
    }
  }

  var results = [];
  var begin;
  var end;

  for (var i = 0; i < availableEvents.length; i++) {
    var event = availableEvents[i];

    for (var k = 0; k < unavailableEvents.length; k++) {
      var unavailable = unavailableEvents[k];
      console.log(unavailable);
      if(moment(event.startDate).day() == moment(unavailable.startDate).day()){
        var currHour = moment(event.startDate);
        var endHour = moment(event.endDate);
    
        while (currHour < endHour){
          if (currHour.format("HH:mm") == moment(unavailable.startDate).format("HH:mm")) {
            currHour = unavailable.endDate;
            console.log('une fois?');
          } else {
            results.push(currHour.format("HH:mm"));
            console.log('before', currHour);
            currHour = currHour.add(0.5, 'h');
            console.log('after', currHour);
            }
          }
        }
      }
    }
    console.log('-------', results);
    return 'wow';
  }

  // compare available and unavailable events to get final availabilities



/**
 * Check that an event is recurring and has been created before the end of given Date interval,
 * If it has been set up before Date interval ("recurring" criteria starts from creation Date),
 * then check that given event is happening in given Date interval.
 * @param {Event} event - event to process
 * @param {Date} fromDate - Start of Date interval to check for
 * @param {Date} toDate - End of Date interval to check for
 */
function eventIsRecurringAndInDateInterval(event, fromDate, toDate) {
  var inInterval = false;
  if (event.recurring && event.startDate < fromDate) {
    var eventIterated = moment(event.startDate);

    while (moment(eventIterated).isBefore(toDate)) {
      if (eventIterated >= fromDate) {
        inInterval = true;
      }
      eventIterated = moment(eventIterated).add(7, 'days');
    }
  }
  return inInterval;
}
module.exports = Event;
