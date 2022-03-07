
var MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
var DATASET_NAME = ['Particulares','Camiones','Motos']

//-------------
//- LINES CHART -
//-------------

function add_dateset(label,config)
{  
  var colorNames = Object.keys(window.chartColors);
  var colorName = colorNames[config.data.datasets.length % colorNames.length];
  var newColor = window.chartColors[colorName];

  var newDataset = {
        label: label,
        backgroundColor: newColor,
        borderColor: newColor,
        data: [],
        fill: false
      };

      for (var index = 0; index < config.data.labels.length; ++index) {
        newDataset.data.push(randomScalingFactor());
      }

      config.data.datasets.push(newDataset);
      return config
}
function add_dateset(label,config,dataset)
{  
  var colorNames = Object.keys(window.chartColors);
  var colorName = colorNames[config.data.datasets.length % colorNames.length];
  var newColor = window.chartColors[colorName];

  var newDataset = {
        label: label,
        backgroundColor: newColor,
        borderColor: newColor,
        data: dataset,
        fill: false
      };

     

      config.data.datasets.push(newDataset);
      return config
}
function create_line(name,xAxesName,yAxesName, init_month,total)
{
 var labels =[];
  var id = init_month;
  for (var i=0;i<total;i++)
    {
      if(id>=12)
        id=0;
      labels.push(MONTHS[init_month+i])
      id++;

    }
  Chart.defaults.global.defaultFontColor = '#013561';
  var config = {
      type: 'line',
      data: {
        labels: labels,
        datasets: []
      },
      options: {
        responsive: true ,
        title: {
          display: true,
          text: name,
           fontColor: '#013561'
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        legend: {
            display: false,
            
            
        },
        scales: {
          fontColor: '#013561', 
          xAxes: [{
            display: true,
            gridLines:  {
                  display: true,
                  drawBorder: true,
                  drawOnChartArea: false
                  },
            scaleLabel: {
              display: true,
              labelString: xAxesName
            }
          }],
          yAxes: [{
            display: true,
            gridLines:  {
                  display: true,
                  drawBorder: true,
                  drawOnChartArea: false,
                  },

            scaleLabel: {
              display: true,
              labelString: yAxesName
            }
          }]
        }
      }
    }
    return config
}

function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
  });
  chart.update();
}

function create_pie_cat(name)
{
   var config = {
      type: 'bar',
      data: {
        datasets: [],
        labels: []
      },
      options: {     
        
        hover: {
            animationDuration: 0 // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
       
        maintainAspectRatio:true,
        responsive: true,
        title: {
          display: true,
          text: name
        },
        legend: {
            display: true
            
        },
        tooltips: {
          mode: 'near',
          display: true,
          intersect: false,
         
        },
        hover: {
          mode: 'dataset',
          intersect: false
        },
        scales: {
          xAxes: [{
            display: false,
            scaleLabel: {
              display: false
            }
          }],
          yAxes: [{
            display: false,
              scaleLabel: {
              display: false
            }
          }]
        }
      }
    };
    return config
};

function add_pie(label,config,item,total,color)
{  
  var colorNames = Object.keys(window.chartColors);
  var colorName = colorNames[color];
  var newColor = window.chartColors[colorName];

  var newDataset = {
        label: label,
        backgroundColor: [newColor,window.chartColors.black],
        data: [item,total],
       };
      config.data.labels = [label,'otros'] 
      config.data.datasets.push(newDataset);
      return config
}


