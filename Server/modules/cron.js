var cron = require('node-schedule');
var rule = new cron.RecurrenceRule();

rule.second = 0;

cron.scheduleJob(rule, function(){
    console.log(new Date(), 'Every 1 minute');
});
