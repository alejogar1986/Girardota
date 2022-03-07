
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
        /*animation: {
          onComplete: function () {
            console.log('OK FUNCTION')
            var ctx = this.chart.ctx;
                    ctx.font='14px LatoRegular, Helvetica,sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    this.data.datasets.forEach(function (dataset) {
                        for (var i = 0; i < dataset.data.length; i++) {
                            console.log(dataset.data[i])
                            var m = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                                    t = dataset._meta[Object.keys(dataset._meta)[0]].total,
                                 mR = m.innerRadius +
                                (m.outerRadius - m.innerRadius) / 2,
                                sA = m.startAngle,
                                eA = m.endAngle,
                                mA = sA + (eA - sA)/2;
                            var x = mR * Math.cos(mA);
                            var y = mR * Math.sin(mA);
                            ctx.fillStyle = 'rgb(28, 23, 73)';

                            var p = String(Math.round(dataset.data[i]/t*100)) + "%";
                            if(dataset.data[i] != 0) {
                                ctx.fillText(dataset.data[i], m.x + x, m.y + y-10);
                                ctx.fillText(p, m.x + x, m.y + y + 5);
                            }
                        }
                    });
          }*/
        },
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


