const Event = require('./event');
const moment = require('moment');
moment().format();

var startDate = new Date(2018,6,1,10,30); // June 1st, 10:30
var endDate = new Date(2018,6,1,14,00); // June 1st, 14:00

new Event(true, true, startDate, endDate); // weekly recurring opening in calendar

startDate = new Date(2018,6,8,11,30); // June 8th 11:30
endDate = new Date(2018,6,8,12,30); // June 8th 12:30
new Event(false, false, startDate, endDate); // intervention scheduled

startDate = new Date(2018,6,11,11,30); //Test
endDate = new Date(2018,6,11,12,30); //
new Event(false, false, startDate, endDate); //

var fromDate = new Date(2018,6,4,10,00);
var toDate = new Date(2018,6,15,10,00);

Event.prototype.availabilities(fromDate, toDate);

/*
 * Answer should be :
 * I'm available from July 8th, at 10:30, 11:00, 12:30, 13:00, and 13:30
 * I'm not available any other time !
 */
