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
  var dateArray = availabilities(fromDate, toDate);
  var recurringEvents = getRecurrentEvents(fromDate, toDate);
  var filter();

  return dateArray;
};

function availabilities(fromDate, toDate){
  return 0;
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

// check each days of the intervals and compare with recurrents opening events and
// unavailable events
function checkIfAvailable(recurrentDays, fromDate, toDate){

}

module.exports = Event;
