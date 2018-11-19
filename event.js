const moment = require('moment');
moment().format();
// moment().utcOffset(120);

var eventList = [];
var recurrentEventList = [];
var unavailableEvents = [];

var Event = function(opening, recurring, startDate, endDate){
  this.opening = opening;
  this.recurring = recurring;
  this.startDate = startDate;
  this.endDate = endDate;

  if (this.opening === false) {
    unavailableEvents.push(this); // push the unavailableEvents
  }
  else if ( this.recurring === false) {
    eventList.push(this); // push the available events
  } else {
    recurrentEventList.push(this); // push the available and recurrent events
  }
};

Event.prototype.availabilities = function(fromDate, toDate){
  var recurringEvents = getRecurrentEvents(fromDate, toDate);
  var unavailableInInterval = filterUnavailable(unavailableEvents, fromDate, toDate);
  var availableInInterval = filterAvailable(eventList, fromDate, toDate);
  var dateArray = availabilities(recurringEvents, availableInInterval, unavailableInInterval, fromDate, toDate);
  // console.log(dateArray);
};

function availabilities(recurringEvents, availableInInterval, unavailableInInterval, fromDate, toDate){

  var arr = [];
  for (var i = 0; i < unavailableInInterval.length; i++) {
    console.log(unavailableInInterval[i], 'before \n');
    var unavailable = unavailableInInterval[i];
    var day = moment(unavailable).subtract(1, 'months').isoWeekday();

    console.log(unavailable, 'after ', day);
    console.log(moment(unavailable).format('MMMM'));


    if (recurringEvents[day]) {
      var result = hours(recurringEvents[day][2], unavailable);
      arr.push(result);
     }
    else {
      for (var k = 0; k < availableInInterval.length; k++) {
        if (moment(availableInInterval[k]).isSame(unavailable, 'day')) {
          var result = hours(recurringEvents[day][2], unavailable);
          arr.push(result);
        }
      }
    }
  }
  return arr;
}

// Store the day of the week and the hour
// of start and end of recurring opening events
function getRecurrentEvents(){
  var recurrentDays = {};
  for (var i = 0; i < recurrentEventList.length; i++) {

    var event = recurrentEventList[i];
    var begin = moment(event.startDate);
    var end = moment(event.endDate);

    var day = begin.isoWeekday();
    recurrentDays[day] = [begin.format("HH:mm"), end.format("HH:mm"), event];
  }
  return recurrentDays;
}

// get all unavailable events for the interval given
function filterUnavailable(unavailableEvents, fromDate, toDate){

  var inInterval = [];

  for (var i = 0; i < unavailableEvents.length; i++) {
    var event = unavailableEvents[i];
    if (event.startDate >= fromDate && event.endDate < toDate ) {
      inInterval.push(event);
    }
  }
  return inInterval;
}

function filterAvailable(eventList, fromDate, toDate){

  var inInterval = [];

  for (var i = 0; i < eventList.length; i++) {
    var event = eventList[i];
    if (event.startDate >= fromDate && event.endDate < toDate ) {
      inInterval.push(event);
    }
  }
  return inInterval;
}


function hours(event, unavailable) {
  // console.log(event, unavailable);
  var results = ['month' , 'day', []];

  var currHour = moment(event.startDate);
  var endHour = moment(event.endDate);
  var beginUnavailable = moment(unavailable.startDate);
  var endUnavailable = moment(unavailable.endDate);

  while (currHour.isBefore(endHour)){
    // console.log('oui');
    if (currHour.format("HH:mm") == beginUnavailable ) {
      // console.log(currHour);
      currHour.hour(endUnavailable.hour());
      currHour.minutes(endUnavailable.minutes());
      // console.log(currHour);
    } else {
      results.push(currHour.format("HH:mm"));
      currHour = currHour.add(0.5, 'h');
    }
  }
  results[0] = moment(dateOfRecurring).format("MMMM");
  results[1] = moment(dateOfRecurring).date();

  return results;
}

module.exports = Event;
