//DATASETS
dataset1 = {'name':'Carros',
            data:[10,20,30,40,20,45]
           };
dataset2 = {'name':'Motos',
            data:[55,34,67,78,46,23]
           };
dataset3 = {'name':'Camiones',
            data:[6,10,21,13,14,24]
           };

dataset4 = {'name':'Por tipo de Combustible',
            data:[10,20,30,40,20,45]
           };
dataset5 = {'name':'Motos',
            data:[55,34,67,78,46,23]
           };
dataset6 = {'name':'Camiones',
            data:[6,10,21,13,14,24]
           };
//-------------
//-------------
//- LINES CHART -
//-------------
var lines = document.getElementById('canvas').getContext('2d');
var config = create_line('Estadisticas','Meses','Cantidad', 0,6)
config = add_dateset(dataset1.name,config,dataset1.data);
config = add_dateset(dataset2.name,config,dataset2.data);
config = add_dateset(dataset3.name,config,dataset3.data);
//Create Chart
var c_Estadisticas = window.myLines = new Chart(lines, config);

//-------------
//- PIE CHART -
//-------------
//cat1

     //pieConfig1 = add_pie(dataset1.name,pieConfig1,dataset1.data[dataset1.data.length-1],47,0);
//var  pie1 = new Chart(pieChartCanvas, pieConfig1);

//cat2
var  pieChartCanvas2 = document.getElementById('pieChart2').getContext('2d');
var  pieConfig2 = create_pie_cat(dataset2.name)
     //pieConfig2 = add_pie(dataset2.name,pieConfig2,dataset2.data[dataset2.data.length-1],47,1);
//var  pie1 = new Chart(pieChartCanvas2, pieConfig2);
//cat3
var  pieChartCanvas3 = document.getElementById('pieChart3').getContext('2d');
var  pieConfig3 =  create_pie_cat(dataset3.name)
     //pieConfig3 = add_pie(dataset3.name,pieConfig3,dataset3.data[dataset3.data.length-1],47,2);
//var  pie1 = new Chart(pieChartCanvas3, pieConfig3);





var colorNames = Object.keys(window.chartColors);
var colorName = colorNames[config.data.datasets.length % colorNames.length];

//IO SOCKETS

var socket = io.connect();
console.log('ok')
socket.on('total', function(data) {
     console.log('total:'+data);
     var total = document.getElementById('total');
     total.innerHTML = data;
 });

 var colors = ['#ff0000','#00ffff','#ff00ff'] 

var pie3 = null
create_modelos();
function create_modelos()
{
    
     config = create_pie_cat('Modelos');
     var newDataset = {
            label: [],
            backgroundColor: [],
            data: [],
     };
     config.data.datasets.push(newDataset);
     config.data.labels = 'Modelos'
     pie3 = new Chart(pieChartCanvas3, config);
}


 socket.on('modelos', function(data) {
     pie3.data.datasets = [];
     for(var p in data)
         {
          var newDataset = {
            label: [],
            backgroundColor: [],
            data: [],
           };
                     newDataset.label = data[p].type
                     newDataset.data.push(data[p].total)
                     newDataset.backgroundColor = colors[p];
                     pie3.data.datasets.push(newDataset);
                   
        
         }
         pie3.update();
 });

 function removeData(chart) {
     chart.data.labels.pop();
     chart.data.datasets.forEach((dataset) => {
         dataset.data.pop();
     });
     chart.update();
 }



 socket.on('gas', function(data) {

    

 });

 
 socket.on('class', function(data) {
     

 });

