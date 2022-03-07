
console.log('OK')



demo();

function demo()
{
    console.log('ok')
    var color = Chart.helpers.color;
    var pieChartCanvas = document.getElementById('pieChart').getContext('2d');
    var pie1 = null

 

    var colors = ['#ffff00','#00ffff','#ff00ff'] 
    var data = 
    [
        { type: 'DIESEL', total: '1' },
        { type: 'GASOLINA', total: '9' },
        { type: 'OTROS', total: '187' }
    ]
    var config = create_pie_cat('Combustibles');
    
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
                     config.data.datasets.push(newDataset);
                     console.log(newDataset);
        
         }
    
    
    pie1 = new Chart(pieChartCanvas, config);
    
}

function create_pie_cat(name)
{
   console.log(name)
   var config = {
      type: 'bar',
      data: {
        datasets: [],
        labels: [name]
      },
      options: {
        animation: {
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
          }
        },
        hover: {
            animationDuration: 0 // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
        layout: {
            padding: {
                left: 50,
                right: 0,
                top: 0,
                bottom: 0
            }},
        
        responsive: true,
        title: {
          display: false,
          text: name
        },
        legend: {
            display: true
            
        },
        tooltips: {
          mode: 'point',
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
}