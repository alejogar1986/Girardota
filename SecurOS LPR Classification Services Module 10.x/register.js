const http = require('http')
fs = require('fs');
const request = require('request');
const config = require('./modules/config')

var username = config.restapi_user;
var password = config.restapi_pass;

//////////////////////////////////////////////
//EDIT FOR EACH EVENT SUBSCRIPTION
var events = [
              {
                "type": "LPR_CAM",
                
                "action":"CAR_LP_RECOGNIZED"
              
              }
]
/////////////////////////////////////////////

var options= {
    url: `http://${config.ip}:${config.restapi_port}/api/v1/events/subscriptions/`,
    auth: {
        username: config.restapi_user,
        password: config.restapi_pass
    }
};

//GET ACTUAL SUBSCRIPTIONS
request.get(options, (err, res, body) => {
  if (err) {  console.log(err); console.log('fail request get'); return }
  var json = JSON.parse(body)
  if(json.data.length > 0)
  {
    for(var p in json.data)
    {
       if(json.data[p].callback == `http://127.0.0.1:${config.serverPort}/lpr`)           
       {
          deleteEvents(json.data[p].id)
          console.log('deleting...',json.data[p].id)
       }
    }
  }
  else
  {
    console.log("Nothing to delete")
  }
  createSubscription();
});
////////////////////////////////////////////////////
//DELETE ACTUAL SUBSCRIPTIONS
function deleteEvents(id)
{
  console.log("Deleting record")
  var optionsDelete= {
    url: `http://${config.ip}:${config.restapi_port}/api/v1/events/subscriptions/${id}`,
    auth: {
        username: config.restapi_user,
        password: config.restapi_pass
    }
  }
  request.delete(optionsDelete, (err, res, body) => {
    if (err) { console.log(err); console.log('fail request post'); return }
    //console.log(JSON.parse(body)); 
  });
}
//////////////////////////////////////////////
//CREATE NEW SUBSCRIPTIONS
//////////////////////////////////////////////
function createSubscription()
{
  console.log('Creating new subscription...');
  
  for (var p in events)
  {
    options.json = {
      "callback": "http://127.0.0.1:"+config.serverPort+"/lpr", 
      "filter": {
                  "type":events[p].type,
                  "id":events[p].id,
                  "action":events[p].action
                }
    }
    request.post(options, (err, res, body) => {
      if (err) {  console.log(err); console.log('fail request post'); return }
      console.log(body)
  })

  
  }
  
}

