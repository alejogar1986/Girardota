var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var pg = require('./pg')
var EventEmitter = require("events").EventEmitter;
var fs = require('fs')



//start the server///////////////////////////////////////
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
port = 2345
app.listen(port)
console.info(`Listening at http://localhost:${port}`)
/////////////////////////////////////////////////////////

//CONSTANTES
const types = ['GASOLINA','DIESEL','GAS','PUBLICOS','PESADOS','LIVIANOS','MAYOR20','MENOR10','NUEVOS','OTROS']
const ENTRADA = 1;
const SALIDA = -1;
const INSERTC = "INSERT INTO totales(date, type, total, direction) VALUES ";
const UPDATEC = "UPDATE totales SET total = total + 1  WHERE date = '";
const UPDATETP = "UPDATE total SET total = total + 1 WHERE ID = 1 "; //GRAND TOTAL
const UPDATETN = "UPDATE total SET total = total - 1 WHERE ID = 1"; //GRAND TOTAL
const UPDATETP_GASOLINA = "UPDATE total SET total = total + 1  WHERE ID = 2"; //GASOLINA TOTAL
const UPDATETN_GASOLINA = "UPDATE total SET total = total - 1  WHERE ID = 2"; //GASOLINA TOTAL
const UPDATETP_DIESEL = "UPDATE total SET total = total + 1  WHERE ID = 3"; //DIESEL TOTAL
const UPDATETN_DIESEL = "UPDATE total SET total = total - 1  WHERE ID = 3"; //DIESEL TOTAL
const UPDATETP_GAS = "UPDATE total SET total = total + 1  WHERE ID = 4"; //GAS TOTAL
const UPDATETN_GAS = "UPDATE total SET total = total - 1  WHERE ID = 4"; //GAS TOTAL
const UPDATETP_PUBLICOS = "UPDATE total SET total = total + 1  WHERE ID = 5"; //PUBLICOS TOTAL
const UPDATETN_PUBLICOS = "UPDATE total SET total = total - 1  WHERE ID = 5"; //PUBLICOS TOTAL
const UPDATETP_PESADOS = "UPDATE total SET total = total + 1  WHERE ID = 6"; //PESADOS TOTAL
const UPDATETN_PESADOS = "UPDATE total SET total = total - 1  WHERE ID = 6"; //PESADOS TOTAL
const UPDATETP_LIVIANOS = "UPDATE total SET total = total + 1  WHERE ID = 7"; //LIVIANO TOTAL
const UPDATETN_LIVIANOS = "UPDATE total SET total = total - 1  WHERE ID = 7"; //LIVIANO TOTAL
const UPDATETP_MAYOR20 = "UPDATE total SET total = total + 1  WHERE ID = 8"; //MAYOR20 TOTAL
const UPDATETN_MAYOR20 = "UPDATE total SET total = total - 1  WHERE ID = 8"; //MAYOR20 TOTAL
const UPDATETP_MENOR10 = "UPDATE total SET total = total + 1  WHERE ID = 9"; //MENOR10 TOTAL
const UPDATETN_MENOR10 = "UPDATE total SET total = total - 1  WHERE ID = 9"; //MENOR10 TOTAL
const UPDATETP_NUEVOS = "UPDATE total SET total = total + 1  WHERE ID = 10"; //NUEVOS TOTAL
const UPDATETN_NUEVOS = "UPDATE total SET total = total - 1  WHERE ID = 10"; //NUEVOS TOTAL
const UPDATETP_OTROS = "UPDATE total SET total = total + 1  WHERE ID = 11"; //OTROS TOTAL
const UPDATETN_OTROS = "UPDATE total SET total = total - 1  WHERE ID = 11"; //OTROS TOTAL

const GETTOTAL = "SELECT total FROM total WHERE ID = 1 "
const GETMODELS = "SELECT total.total, categorias.name as type FROM total  INNER JOIN categorias ON total.id = categorias.id where (categorias.name ='MAYOR20' OR categorias.name ='MENOR10' OR categorias.name ='NUEVOS' OR categorias.name ='OTROS') order by categorias.id"
const GETGAS = "SELECT total.total, categorias.name as type FROM total  INNER JOIN categorias ON total.id = categorias.id where (categorias.name ='GASOLINA' OR categorias.name ='DIESEL' OR categorias.name ='GAS' OR categorias.name ='OTROS') order by categorias.id"
const GETCLASS = "SELECT total.total, categorias.name as type FROM total  INNER JOIN categorias ON total.id = categorias.id where (categorias.name ='LIVIANOS' OR categorias.name ='PUBLICOS' OR categorias.name ='PESADOS' OR categorias.name ='OTROS') order by categorias.id"

const INS_HISTORIAL = 'INSERT INTO historial(date, "time", category) VALUES' //('2021-02-04', '10:00', 'test', 1);
const PG_HISTORIAL = 'SELECT * FROM historial WHERE date = current_date and time = extract(hour from now())'
const GETTOTALES = 'SELECT total.total, categorias.name FROM total  inner join categorias on total.id = categorias.id  where total.id>1'
const GETHISTORY = 'SELECT * FROM historial where '
//receive match from LPR
app.post('/lpr', function(request, response) 
{
    response.send('ok');
    response.end();

    var direccion = 0;

    if(request.body.recognizer_name=="GIR-LPR-3-CLL 12 # 14")
	{
		if(request.body.direction_id=='2')//gir lpr 3 salida,  gir lpr 4 entrada, auto norte salida
		{
			direccion = ENTRADA
		}
		else if(request.body.direction_id=='1')
		{
			direccion = SALIDA
		}
	}
	if(request.body.recognizer_name=="GIR-LPR-4-CR 12 #1")
	{
		if(request.body.direction_id=='1')//gir lpr 3 salida,  gir lpr 4 entrada, 
		{
			direccion = ENTRADA
		}
		else if(request.body.direction_id=='2')
		{
			direccion = SALIDA
		}
	}
	if(request.body.recognizer_name=="GIR-LPR-1 AUTO_NORTE")
	{
		if(request.body.direction_id=='2')//gir lpr 3 salida,  gir lpr 4 entrada, 
		{
			direccion = ENTRADA
		}
		else if(request.body.direction_id=='1')
		{
			direccion = SALIDA
		}
	}
    console.log('Nueva Captura',request.body.recognizer_name)
    ingreso(request,direccion)
    
})


//INGRESO DE REGISTROS SEGUN TIPO Y DIRECCION

function ingreso(request,direccion)
{
      //sumar total
      if(direccion == ENTRADA)
      pg.query(UPDATETP,function(res){});
      if(direccion == SALIDA)
      pg.query(UPDATETN,function(res){});
  
consultarPlaca(request.body.number,direccion,function(res,dir)
    {
         //si placa no existe, aumenta desconocidos   
        if(res[0]==null)
        {
            addtype('OTROS',dir);
            if(dir==ENTRADA) {
                pg.query(UPDATETP_OTROS,function(res){});
            }
            else {
                pg.query(UPDATETN_OTROS,function(res){});
            }
            var hoy = new Date();
            dia = hoy.getDate();
            mes = hoy.getMonth();
            anio= hoy.getFullYear();
            fecha_actual = String(anio+"_"+dia+"_"+mes);

            var record = `${request.body.number}\n` 

            fs.appendFile(fecha_actual+'.txt', record , function (err) {
                if (err) throw err;
                console.log('Saved!');
              });

            newlpr.emit("lpr");
            return;
        }
        
        //si existe entonces...
        var current = new Date(Date.now())
        var date = current.getFullYear()
        var combustible = res[0].combustible
        var modelo = res[0].modelo
        var clase = res[0].clase;
        newlpr.emit("lpr");
        //cuenta combustible
        addtype(combustible,dir);
        switch(combustible)
        {
            case 'GASOLINA':
                if(dir==ENTRADA) {
                    pg.query(UPDATETP_GASOLINA,function(res){});
                }
                else {
                    pg.query(UPDATETN_GASOLINA,function(res){});
                }
                break;
            case 'DIESEL':
                if(dir==ENTRADA) {
                    pg.query(UPDATETP_DIESEL,function(res){});
                }
                else {
                    pg.query(UPDATETN_DIESEL,function(res){});
                }
                break;
            case 'ACPM':
                if(dir==ENTRADA) {
                    pg.query(UPDATETP_DIESEL,function(res){});
                }
                else {
                    pg.query(UPDATETN_DIESEL,function(res){});
                }
                break;
            case 'GAS':
                if(dir==ENTRADA) {
                    pg.query(UPDATETP_GAS,function(res){});
                }
                else {
                    pg.query(UPDATETN_GAS,function(res){});
                }
                break;
                
        }
        //cuenta modelos
        if(parseInt(modelo))
        {
            if(date - parseInt(modelo) < 10 ){
                addtype('MENOR10',dir);
                if(dir==ENTRADA) {
                    pg.query(UPDATETP_MENOR10,function(res){});
                }
                else {
                    pg.query(UPDATETN_MENOR10,function(res){});
                }
            }
            else 
            if(date - parseInt(modelo) > 20 ){
                addtype('MAYOR20',dir);
                if(dir==ENTRADA) {
                    pg.query(UPDATETP_MAYOR20,function(res){});
                }
                else {
                    pg.query(UPDATETN_MAYOR20,function(res){});
                }
            }
            else{    
                addtype('NUEVOS',dir);
                if(dir==ENTRADA) {
                    pg.query(UPDATETP_NUEVOS,function(res){});
                }
                else {
                    pg.query(UPDATETN_NUEVOS,function(res){});
                }
            }
        }
        //cuenta clase
        //publicos 3L3D iniciando por S
        let re =/S\w{2}\d{3}/ig
        var publico = re.exec(request.body.number);
        if(publico!=null)
        {
           addtype('PUBLICOS',dir);
           if(dir==ENTRADA) {
            pg.query(UPDATETP_PUBLICOS,function(res){});
           }
           else {
            pg.query(UPDATETN_PUBLICOS,function(res){});
           }
        }
        else
        {
         if(clase == 'MOTOCICLETA')
           addtype('MOTOS',dir);
         else {
             if(clase == 'TRACTOCAMION' || clase =='CAMION' || clase =='B U S'){
                 addtype('PESADOS',dir);
                 if(dir==ENTRADA) {
                    pg.query(UPDATETP_PESADOS,function(res){});
                   }
                   else {
                    pg.query(UPDATETN_PESADOS,function(res){});
                   }
                }
                 
             else{
                addtype('LIVIANOS',dir);   
                if(dir==ENTRADA) {
                    pg.query(UPDATETP_LIVIANOS,function(res){});
                   }
                   else {
                    pg.query(UPDATETN_LIVIANOS,function(res){});
                   }
            }
         }
              
        }
        
    })

}

//test/////
//var json = {body:{ number:'STE003',direction_id:2}}
//ingreso(json,1)
////////////

////////////////////////
//metodos 
///////////////////////

function addtype(type, dir)
{
    update_historial(type)
var current = new Date(Date.now())
var date = current.getFullYear()+'-'+(parseInt(current.getMonth())+1) +'-'+current.getDate();

    //verifica si existe el total del dia actual
    var q = "select * from totales where type='"+type+"' AND date='" + date +"'";
    //console.log(q)
    pg.query(q , function (res)
    {
        //si exite el total 
      
        if(res.rows.length>0){
                pg.query(UPDATEC + date +"' AND type ='"+type+"' AND direction = " + dir,function(res){
            });
        }
        //no existe el total    
        else{
            //crea los totales para este combustible
            pg.query(INSERTC +"('"+date+"','"+type+"','0', "+ENTRADA+")",function(res){})
            pg.query(INSERTC + "('"+date+"','"+type+"','0', "+SALIDA+")",function(res){})
            //aumenta la cantidad correspondiente
            pg.query(UPDATEC + date +"' AND type ='"+type+"' AND direction = " + dir,function(res){});
        }    
    });
}

function consultarPlaca(placa,dir,callback)
{
    var q = "select * from info where number='"+placa+"'";
    pg.query(q , function (res)
    {
        //console.log(res.rows);
        callback(res.rows,dir)
    });
}

//////////////////////////////////////////////////////
//EXPORTS 
//////////////////////////////////////////////////////
function getTotal(callback)
{
    pg.query(GETTOTAL,function(res){
        //console.log('restotal',res)
        callback(res.rows[0])
    })
}
function getModels(callback)
{
    pg.query(GETMODELS,function(res){
        //console.log('models',res)
       try{callback(res.rows)}
        catch(e){}
    })
}

function getGas(callback)
{
    pg.query(GETGAS,function(res){
        //console.log('models',res)
        try{callback(res.rows)}
        catch(e){}
    })
}

function getClass(callback)
{
    pg.query(GETCLASS,function(res){
        //console.log('models',res)
        try{callback(res.rows)}
        catch(e){}
    })
}


function update_historial(type)
{
    var current = new Date(Date.now())
    var date = current.getFullYear()+'-'+(parseInt(current.getMonth())+1) +'-'+current.getDate();
    var time = current.getHours();
    pg.query(PG_HISTORIAL,function(res)
    {
        if(res.rows.length>0)
        {
            pg.query(GETTOTALES,function(res)
            {
                
                res.rows.forEach(element => {
                    //console.log(element.name,element.total);
                    var query = `UPDATE historial SET value=${element.total} WHERE date = current_date and time = extract(hour from now()) and category ='${element.name}' ;`
                    pg.query(query,function(res){})
                });
            })
        }
        else 
        {
            //CREATE ALL CATEGORIES FOR HOUR
            types.forEach(element => {
                var query = `${INS_HISTORIAL} ('${date}','${time}','${element}')`
                pg.query(query,function(res){})
            });
           
            

        }

    });
};

function getHistory(interval,callback)
{
    var query = GETHISTORY + interval;
    pg.query(query,function(res){
        //console.log('models',res)
        try{callback(res.rows)}
        catch(e){console.error(e)}
    })

}
exports.getHistory = getHistory
exports.getTotal = getTotal
exports.getModels = getModels
exports.getGas = getGas
exports.getClass = getClass

/////////////////////////////////////////////////////////

//EVENTS


var newlpr = new EventEmitter();


exports.newlpr = newlpr;
