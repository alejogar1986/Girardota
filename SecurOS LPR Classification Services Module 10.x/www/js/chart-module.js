//-------------
//- CHARTS -
//-------------

var  pieChartCanvas = document.getElementById('pieChart').getContext('2d');
var  pieChartCanvas2 = document.getElementById('pieChart2').getContext('2d');
var  pieChartCanvas3 = document.getElementById('pieChart3').getContext('2d');
var  canvas2 =document.getElementById('canvas2').getContext('2d');

//CONEXION SOCKET CON EL SERVER NODEJS
var socket = io.connect();
console.log('ok')
socket.on('total', function(data) {
     console.log('total:'+data);
     var total = document.getElementById('total');
     total.innerHTML = data;
});

//PARAMETRIZACION DE COLORES
var colors = ['#092E61','#BECFDE','#F86200','#00D4F4','#6C6C6C','#FF1313','#DFFF2B','#03B294','#7003B2','#C88424'] 
//INICIALIZACION DE GRAFICAS
var pie1 = null
var pie2 = null
var pie3 = null
var lines = null
create();
function create()
{
     config = create_pie_cat('bar');
     config2 = create_pie_cat('bar1');
     config3 = create_pie_cat('bar2');
     var newDataset = {
            label: [],
            backgroundColor: [],
            data: [],
     };
     config.data.datasets.push(newDataset);
     config.data.labels = []
     config2.data.datasets.push(newDataset);
     config2.data.labels = []
     config3.data.datasets.push(newDataset);
     config3.data.labels = []
     pie1 = new Chart(pieChartCanvas, config);
     pie2 = new Chart(pieChartCanvas2, config2);
     pie3 = new Chart(pieChartCanvas3, config3);
     //create lines
     config4 = create_line('Estadisticas','Tiempo','Total');
     config4.data.datasets.push(newDataset);
     lines = new Chart(canvas2, config4);
}

//------------ RECEPCION DE DATOS DESDE EL SERVER -----------
//MODELOS (GRAFICA DE BARRA POR MODELO)
 socket.on('modelos', function(data) {
     pie3.data.datasets = [];
     pie3.data.labels = [];
     pie3.data.labels.push('Modelos')
     for(var p in data)
     {
          var newDataset = {
            label: [],
            backgroundColor: [],
            data: [],
            hidden: false
           };
          var label = null;
          if( data[p].type == 'MENOR10')
               label = '< 10 Años'
          if( data[p].type == 'MAYOR20')
               label = '> 20 Años'
          if( data[p].type == 'NUEVOS')
               label = '10 - 20 Años'
          if( data[p].type == 'OTROS')
               label = 'Otros'
          newDataset.label = label + ':\t '+  data[p].total
          newDataset.data.push(data[p].total)
          newDataset.backgroundColor = colors[p];
          if(data[p].type == 'OTROS') {
               newDataset.hidden=true;
               newDataset.backgroundColor = colors[10];
          }
          pie3.data.datasets.push(newDataset);
          
     }
     pie3.update();
 });
//HISTORIAL (GRAFICA DE LINEAS)
 const  hours = ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00',
 '13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'];
 socket.on('historial', function(data) {
     lines.data.datasets = [];
     lines.data.labels = [];
     var group_data = {};
     data.forEach( x => {
          if( !group_data.hasOwnProperty(x.category)){
               group_data[x.category] = {
               values: []
            }
          }
          //Agregamos los datos
          group_data[x.category].values.push({
              time: x.time,
              date: x.date,
              value:x.value
            })
          
        })
     lines.data.labels = hours 
     Object.keys(group_data).forEach(function(a,b){
     var newDataset = {
          label: [],
          backgroundColor: colors[b],
          borderColor: colors[b],
          data: [],
          fill: false
     };
     //console.log(data[b].category,group_data[a])
     newDataset.label = data[b].category
     
     if(data[b].category == 'OTROS')
          newDataset.hidden=true;

     addValues(group_data[a].values,function(array){
               array.forEach(element => {
                    newDataset.data.push(element)
               });
               
     })
     lines.data.datasets.push(newDataset);
     console.log(newDataset)
     lines.update();
     });
     
 });

 function addValues(values,callback)
 {
     var data_today = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]
     values.forEach(element => { 
     data_today[element.time]= element.value
     })
     callback(data_today);
 };

///COMBUSTIBLES
socket.on('gas', function(data) {
     pie1.data.datasets = [];
     pie1.data.labels = [];
     pie1.data.labels.push('Combustibles')
     for(var p in data)
     {
          var newDataset = {
               label: [],
               backgroundColor: [],
               data: [],
               hidden: false
           };
          newDataset.label = data[p].type  + ':\t '+  data[p].total
          newDataset.data.push(data[p].total)
          newDataset.backgroundColor = colors[p];
          if(data[p].type == 'OTROS') {
               newDataset.hidden=true;
               newDataset.backgroundColor = colors[10];
          }
          pie1.data.datasets.push(newDataset);
     }
     pie1.update();
});

//CLASE DE VEHICULOS 
socket.on('class', function(data) {
     pie2.data.datasets = [];
     pie2.data.labels = [];
     pie2.data.labels.push('Combustibles')
     for(var p in data)
     {
          var newDataset = {
               label: [],
               backgroundColor: [],
               data: [],
               hidden: false
          };
          newDataset.label = data[p].type  + ':\t '+  data[p].total
          newDataset.data.push(data[p].total)
          newDataset.backgroundColor = colors[p];
          if(data[p].type == 'OTROS') {
               newDataset.hidden=true;
               newDataset.backgroundColor = colors[10];
          }
          pie2.data.datasets.push(newDataset);
     }
     pie2.update();
});

function timeLines(step)
{

     switch(step)
     {
          case 'day':
               hours.forEach(element => {
                    lines.data.labels.push(element)
               });
               
               break;
     }

}

