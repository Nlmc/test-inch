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
  // console.log('eventList ', eventList, '\n recurrentEventList', recurrentEventList, '\n unavailableEvents : ', unavailableEvents);
  var dateArray = availabilities(recurringEvents, availableInInterval, unavailableInInterval, fromDate, toDate);
  return 1;
};

function availabilities(recurringEvents, availableInInterval, unavailableInInterval, fromDate, toDate){

  var arr = [];

  for (var i = 0; i < unavailableInInterval.length; i++) {
    var unavailable = unavailableInInterval[i];
    if (recurringEvents[moment(unavailable).isoWeekday()]) {
      // calculer les heures dispo
    } else {
      for (var i = 0; i < availableInInterval.length; i++) {
        if (moment(availableInInterval[i]).isSame(unavailable, 'day')) {
          //calculer les heures dispo
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
    recurrentDays[day] = [begin.format("HH:mm"), end.format("HH:mm")];
  }
  console.log(recurrentDays);
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
  console.log(inInterval);
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
  console.log(inInterval);
  return inInterval;
}

module.exports = Event;
