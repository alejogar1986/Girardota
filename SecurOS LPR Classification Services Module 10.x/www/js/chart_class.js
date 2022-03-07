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
        layout: {
          padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
          }
        },
        animation: {
      
        },
        hover: {
            animationDuration: 0 // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
       
        maintainAspectRatio:true,
        responsive: true,
        title: {
          display: false,
          text: name
        },
        legend: {
            display: true,
            position: 'bottom',
            labels: {
              padding: 20,
              boxWidth:  10,
              usePointStyle: true,
              fontColor: '#013561',
              fontSize : 10,
              fontStyle: 'bold'
            }
        },
        tooltips: {
          mode: 'nearest',
          display: true,
          intersect: false,
         
        },
        hover: {
          mode: 'dataset',
          intersect: false
        },
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero:true,
              suggestedMin: 0
          },
            display: true,
            scaleLabel: {
              display: false
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero:true,
              suggestedMin: 0
          },
            display: true,
              scaleLabel: {
              display: false
            }
          }]
        }
    }
   }
    return config
};



function create_line(name,xAxesName,yAxesName)
{
 
   var config = {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {

        maintainAspectRatio:true,
        responsive: true,
        title: {
          display: false,
          text: name,
           fontColor: '#013561'
        },
        tooltips: {
          mode: 'nearest',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            padding: 20,
            boxWidth:  10,
            usePointStyle: true,
            fontColor: '#013561',
            fontSize : 14,
            fontStyle: 'bold'
          }
            
            
        },
        scales: {
          fontColor: '#013561', 
          xAxes: [{
            display: true,
            gridLines:  {
                  display: true,
                  drawBorder: true,
                  drawOnChartArea: true
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
                  drawOnChartArea: true,
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