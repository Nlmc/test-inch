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
  var dateArray = availabilities(fromDate, toDate);
  display(dateArray);
  return dateArray;
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
        || dateOfRecurring !== false
      ) {
        if (event.opening) {
          var dateOfRecurring = eventIsRecurringAndInDateInterval(event, fromDate, toDate);
          availableEvents.push(event);
        } else {
          unavailableEvents.push(event);
        }
    }
  }
  return compare(availableEvents, unavailableEvents, dateOfRecurring);
  }

function compare(availableEvents, unavailableEvents, dateOfRecurring){
  var results = ['month', 'day', []];
  var shortcut = results[2];

  for (var i = 0; i < availableEvents.length; i++) {
    var event = availableEvents[i];

    for (var k = 0; k < unavailableEvents.length; k++) {
      var unavailable = unavailableEvents[k];

      if(moment(event.startDate).day() == moment(unavailable.startDate).day()){
        var currHour = moment(event.startDate);
        var endHour = moment(event.endDate);

        while (currHour.isBefore(endHour)){
          if (currHour.format("HH:mm") == moment(unavailable.startDate).format("HH:mm")) {
            var swap = [moment(unavailable.endDate).hour(), moment(unavailable.endDate).minutes()];
            currHour.hour(swap[0]);
            currHour.minutes(swap[1]);
          } else {
            shortcut.push(currHour.format("HH:mm"));
            currHour = currHour.add(0.5, 'h');
            }
          }
          results[0] = moment(dateOfRecurring).format("MMMM");
          results[1] = moment(dateOfRecurring).date();
        }
      }
    }
    return results;
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
        var realDate = eventIterated;
        inInterval = true;
      }
      eventIterated = moment(eventIterated).add(7, 'days');
    }
  }
  if (inInterval === true) {
    return realDate;
  }  else {
    return inInterval;
  }
}


function display(dateArray) {
  var prevString = "i'm available from ";
  var endString = "\nI'm not available any other time !";
  var month = dateArray[0];
  var date = dateArray[1];
  var hours = dateArray[2];
  hours = hours.join(', ');
  var finalString = prevString + month + " " + date +  "th, at " + hours + endString;
  console.log(finalString);
}
module.exports = Event;
