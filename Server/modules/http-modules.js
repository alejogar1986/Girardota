var _io;

function handle_request(request,response) {
	
	switch(request.method)
	{
		case 'POST':
				handle_POST_request(response);
				break;		
	}
	
};
exports.handle_POST_request	= function (request,response){
	console.log(request.body);
	enviar_data(request.body,"show");

	response.writeHead(200,{
		'Content-Type' : 'text/html'
	});
	response.end('Data received...')
};

exports.listen = function(io){
		_io = io;
		_io.on('connection',io_handler)
}

function enviar_data(data,type) {
	console.log('sending:',data)
    _io.emit(type,data)
}


function io_handler(socket){
	console.log(socket.id);
	lpr.getTotal(function(total)
		{
    		console.log('Total', total.total);
		    socket.emit('total', total.total,)
		})
	lpr.getModels(function(models)
		{
    		console.log('Modelos', models);
    		socket.emit('modelos',models)
		})
	lpr.getGas(function(gas)
		{
			console.log('Gas', gas);
			socket.emit('gas',gas)
		})
	lpr.getClass(function(_class)
		{
			console.log('class', _class);
			socket.emit('class',_class)
		})
	lpr.getHistory(interval,function(history){
		    console.log('history', history);
			enviar_data(history,'historial')
		});
}


// GET INDICATORS FROM LPR
const lpr	 = require('./lpr');


lpr.getModels(function(models)
{
    console.log('Modelos', models);
    enviar_data(models,'modelos')
})

lpr.getGas(function(gas)
{
    console.log('Gas', gas);
    enviar_data(gas,'gas')
})

lpr.getClass(function(_class)
{
    console.log('class', _class);
    enviar_data(_class,'class')
})

var interval = 'date = current_date order by date,time,category';//hoy

lpr.newlpr.on("lpr", function () {

	console.log("new lpr event has occured");

	lpr.getHistory(interval,function(history){
		enviar_data(history,'historial')
	});

	lpr.getTotal(function(total)
	{
		console.log('Total', total.total);
		enviar_data(total.total,'total')
	})
	
	lpr.getModels(function(models)
	{
    	console.log('Modelos', models);
    	enviar_data(models,'modelos')
	})
	lpr.getGas(function(gas)
	{
    	console.log('Gas', gas);
    	enviar_data(gas,'gas')	
	})
	lpr.getClass(function(_class)
	{
    	console.log('class', _class);
    	enviar_data(_class,'class')	
	})
	
});

exports.sendData = enviar_data;

