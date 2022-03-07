var express = require('express')
var app = express()
var pg = require('./pg')
var messages = require('./messages')
var EventEmitter = require("events").EventEmitter;
var fs = require('fs')
var logs = require('./logs/logs');



//start the server///////////////////////////////////////
app.use(express.json())
port = 2345
app.listen(port)
console.info(`Listening at http://localhost:${port}`)

logs.Write(`Service started`,"INFO",'lpr_classification');
logs.Write(`Listening at http://localhost:${port}`,"INFO",'lpr_classification');
/////////////////////////////////////////////////////////

//CONSTANTES
//const types = ['GASOLINA','DIESEL','GAS','PUBLICOS','PESADOS','LIVIANOS','MAYOR20','MAYOR10','NUEVOS','OTROS']

//receive match from LPR
app.post('/lpr', function(request, response) 
{
    logs.Write(`New capture: ${JSON.stringify(request.body)}`,"DEBUG",'lpr_classification');
    console.log('Nueva Captura',request.body)

    ingreso(request.body[0])

    response.send('ok');
    response.end();
})


//INGRESO DE REGISTROS SEGUN TIPO Y DIRECCION

function ingreso(request)
{
    
    var placa = request.params.number
    if(!placa){
        console.error(request)
        logs.Write(request,"ERROR",'lpr_classification');
        return
    }
    consultarPlaca(placa ,function(res)
    {
         //si placa no existe, aumenta desconocidos   
        if(res[0]==null)
        {
            logs.Write(`Plate ${request.body} not found in dababase`,"INFO",'lpr_classification');
            fs.appendFile(fecha_actual+'.txt', record , function (err) {
                
                logs.Write(`Plate ${request.body} written in csv`,"INFO",'lpr_classification');
                if(err)
                    logs.Write(err,"ERROR",'lpr_classification');
                return;
            });
        }
        //si existe entonces...
        const KILOMETROS = 6;
        var newRegister = res[0]

        delete newRegister.last_modify_date;
        delete newRegister.last_modify_operator;   
        delete newRegister.id;   
        newRegister.tid = request.params.tid 
        newRegister.id_reconocedor = request.params.recognizer_id 
        newRegister.nombre_reconocedor = request.params.recognizer_name 
             
        newRegister.grupo = getGroup(res[0])
        var params = getParams(newRegister.grupo)
        newRegister.pm10 =  params[0]    *  KILOMETROS
        newRegister.pm25 =  params[1]    *  KILOMETROS
        newRegister.co2  =  params[2]    *  KILOMETROS
        newRegister.co   =  params[3]    *  KILOMETROS
        newRegister.nox  =  params[4]    *  KILOMETROS
        logs.Write(`New object created: ${JSON.stringify(newRegister,null,10)} `,"TRACE",'lpr_classification');
        console.log(newRegister)
        var database = 'registros';
        logs.Write(`Inserting new object in database: ${database} `,"TRACE",'lpr_classification');
        messages.insert(database,newRegister, (msg,res) => {
            if(res){
            console.log(msg,res.rowCount)
            logs.Write(`${msg}: ${JSON.stringify(res.rowCount)} `,"DEBUG",'lpr_classification');
            logs.Write(`${JSON.stringify(res)} `,"TRACE",'lpr_classification');
          }else{
              console.log('Error, database not found')
            logs.Write(`Error, database not found `,"ERROR",'lpr_classification');
          }
        })
    })
}


////////////////////////
//metodos 
///////////////////////

function consultarPlaca(placa,callback)
{
    var q = "select * from runt where placa='"+placa+"'";
    logs.Write(`Consulting plate ${placa}, ${q} `,"TRACE",'lpr_classification');
    pg.query(q , function (res)
    {
        //console.log(res.rows);
        try{
        logs.Write(`Results from database: ${JSON.stringify(res.rows)} `,"TRACE",'lpr_classification');
        }
        catch(e)
        {
            logs.Write(`Error: ${e} `,"ERROR",'lpr_classification');
        }
        callback(res.rows)
    });
}

//clasificacion
function getGroup(newRegister){
        //livianos
        var currentDate = new Date(Date.now())
        var year = currentDate.getFullYear()
        logs.Write(`GetGroup ${newRegister.clase},  ${newRegister.combustible},  ${year-newRegister.modelo} `,"TRACE",'lpr_classification');
        console.log("GetGroup",newRegister.clase,newRegister.combustible, year-newRegister.modelo)

        if( newRegister.tipo == 'LIVIANO' && newRegister.combustible == 'GASOLINA' && year-newRegister.modelo<=10 )
            return '1'
        if( newRegister.tipo == 'LIVIANO' && newRegister.combustible == 'GASOLINA' && year-newRegister.modelo> 10 && year-newRegister.modelo<=20 ) 
            return '2'
        if( newRegister.tipo == 'LIVIANO' && newRegister.combustible == 'GASOLINA' && year-newRegister.modelo> 20 )
            return '3'
        if( newRegister.tipo == 'LIVIANO' && newRegister.combustible == 'DIESEL' && year-newRegister.modelo<=10 )
            return '4'
        if( newRegister.tipo == 'LIVIANO' && newRegister.combustible == 'DIESEL' && year-newRegister.modelo> 10 && year-newRegister.modelo<=20 ) 
            return '5'
        if( newRegister.tipo == 'LIVIANO' && newRegister.combustible == 'DIESEL' && year-newRegister.modelo> 20 )
            return '6'
        if( newRegister.tipo == 'LIVIANO' && newRegister.combustible == 'GNV' && year-newRegister.modelo<=10 )
            return '7'
        if( newRegister.tipo == 'LIVIANO' && newRegister.combustible == 'GNV' && year-newRegister.modelo> 10 && year-newRegister.modelo<=20 ) 
            return '8'
        if( newRegister.tipo == 'LIVIANO' && newRegister.combustible == 'GNV' && year-newRegister.modelo> 20 )
            return '9'
        //pesados
        if( newRegister.tipo == 'PESADO' && newRegister.combustible == 'GASOLINA' && year-newRegister.modelo<=10 )
            return '10'
        if( newRegister.tipo == 'PESADO' && newRegister.combustible == 'GASOLINA' && year-newRegister.modelo> 10 && year-newRegister.modelo<=20 ) 
            return '11'
        if( newRegister.tipo == 'PESADO' && newRegister.combustible == 'GASOLINA' && year-newRegister.modelo> 20 )
            return '12'
        if( newRegister.tipo == 'PESADO' && newRegister.combustible == 'DIESEL' && year-newRegister.modelo<=10 )
            return '13'
        if( newRegister.tipo == 'PESADO' && newRegister.combustible == 'DIESEL' && year-newRegister.modelo> 10 && year-newRegister.modelo<=20 ) 
            return '14'
        if( newRegister.tipo == 'PESADO' && newRegister.combustible == 'DIESEL' && year-newRegister.modelo> 20 )
            return '15'
        if( newRegister.tipo == 'PESADO' && newRegister.combustible == 'GNV' && year-newRegister.modelo<=10 )
            return '16'
        if( newRegister.tipo == 'PESADO' && newRegister.combustible == 'GNV' && year-newRegister.modelo> 10 && year-newRegister.modelo<=20 ) 
            return '17'
        if( newRegister.tipo == 'PESADO' && newRegister.combustible == 'GNV' && year-newRegister.modelo> 20 )
            return '18'    
        //Publicos
        if( newRegister.tipo == 'PUBLICO' && newRegister.combustible == 'GASOLINA' && year-newRegister.modelo<=10 )
            return '19'
        if( newRegister.tipo == 'PUBLICO' && newRegister.combustible == 'GASOLINA' && year-newRegister.modelo> 10 && year-newRegister.modelo<=20 ) 
            return '20'
        if( newRegister.tipo == 'PUBLICO' && newRegister.combustible == 'GASOLINA' && year-newRegister.modelo> 20 )
            return '21'
        if( newRegister.tipo == 'PUBLICO' && newRegister.combustible == 'DIESEL' && year-newRegister.modelo<=10 )
            return '22'
        if( newRegister.tipo == 'PUBLICO' && newRegister.combustible == 'DIESEL' && year-newRegister.modelo> 10 && year-newRegister.modelo<=20 ) 
            return '23'
        if( newRegister.tipo == 'PUBLICO' && newRegister.combustible == 'DIESEL' && year-newRegister.modelo> 20 )
            return '24'
        if( newRegister.tipo == 'PUBLICO' && newRegister.combustible == 'GNV' && year-newRegister.modelo<=10 )
            return '25'
        if( newRegister.tipo == 'PUBLICO' && newRegister.combustible == 'GNV' && year-newRegister.modelo> 10 && year-newRegister.modelo<=20 ) 
            return '26'
        if( newRegister.tipo == 'PUBLICO' && newRegister.combustible == 'GNV' && year-newRegister.modelo> 20 )
            return '27'   
        //MOTOCICLETAS
        if( newRegister.tipo == 'MOTOCICLETA' && newRegister.combustible == 'GASOLINA' && year-newRegister.modelo<=10 )
            return '28'
        if( newRegister.tipo == 'MOTOCICLETA' && newRegister.combustible == 'GASOLINA' && year-newRegister.modelo> 10 && year-newRegister.modelo<=20 ) 
            return '29'
        if( newRegister.tipo == 'MOTOCICLETA' && newRegister.combustible == 'GASOLINA' && year-newRegister.modelo> 20 )
            return '30'
        logs.Write(`Group not found `,"ERROR",'lpr_classification');    
        return 0;
            
        
}

function getParams(id)
{
    var result = parametros.groups.find(object => object.group == id)
    logs.Write(`Parameters: ${JSON.stringify(result)}`,"DEBUG",'lpr_classification');
    return (result.params)
}

var newlpr = new EventEmitter();
exports.newlpr = newlpr;


const parametros = { groups:[ 
    { 'group':1,'params' :  [0.002,0.002,39079.7,1285.071,186.014] },
    { 'group':2,'params' :  [0.023,0.021,390797.0,12850.714,1860.143] },
    { 'group':3,'params' :  [0.029,0.029,547115.8,17991.0,2604.200]},
    { 'group':4,'params' :  [0.025,0.025,53024.0,1090.5,382.700] },
    { 'group':5,'params' :  [0.251,0.251,530240.0,10905.0,3827.0] },
    { 'group':6,'params' :  [0.351,0.351,742336.0,15267.0,5357.8] },
    { 'group':7,'params' :  [0.000,0.000,34050.0,2650.0,335.0] },
    { 'group':8,'params' :  [0.003,0.003,340500.0,26500.0,3350.0] },
    { 'group':9,'params' :  [0.004,0.004,476700.0,37100.0,4690.0] },

    { 'group':10,'params' : [0.023,0.023,129473.7,10527.1,938.45] },
    { 'group':11,'params' : [0.229,0.229,1294737.0,105271.0,9384.5] },
    { 'group':12,'params' : [0.320,0.320,1812631.8,147379.4,13138.3] },
    { 'group':13,'params' : [0.033,0.033,130835.264,1392.864,1572.409] },
    { 'group':14,'params' : [0.326,0.326,1308352.636,13928.636,15724.091] },
    { 'group':15,'params' : [0.456,0.456,1831693.691,19500.091,22013.727] },
    { 'group':16,'params' : [0.000,0.000,40399.0,3665.0,226.0] },
    { 'group':17,'params' : [0.003,0.003,403990.0,36650.0,2260.0] },
    { 'group':18,'params' : [0.004,0.004,565586.0,51310.0,3164.0] },

    { 'group':19,'params' : [0.002,0.002,34493.5,900.4,141.0] },
    { 'group':20,'params' : [0.022,0.022,344935.0,9004.0,1410.0] },
    { 'group':21,'params' : [0.031,0.031,482909.0,12605.6,1974.0] },
    { 'group':22,'params' : [0.018,0.018,138.464,1214.557,1720.229] },
    { 'group':23,'params' : [0.182,0.182,1384.638,12145.571,17202.286] },
    { 'group':24,'params' : [0.255,0.255,1938.493,17003.8,24083.2] },
    { 'group':25,'params' : [0.000,0.000,26000.0,1300.0,400] },
    { 'group':26,'params' : [0.003,0.003,260000.0,13000,4000] },
    { 'group':27,'params' : [0.004,0.004,364000.0,18200,5600] },

    { 'group':28,'params' : [0.003,0.003,42518.7,5823,0.138] },
    { 'group':29,'params' : [0.029,0.029,425187.0,58230,1.376] },
    { 'group':30,'params' : [0.041,0.041,595261.8,81522,1.926] },
]
}