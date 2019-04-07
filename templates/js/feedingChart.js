const feedingCharts = []

const foodColours = {}
function defineFoodColour(label, background, color) {
  foodColours[label.toLowerCase()] = {
    label,
    background,
    color
  }
}
defineFoodColour('Chicken', '#F9CB9C', 'black')
defineFoodColour('Dry Chicken', '#F9CB9C', 'black')
defineFoodColour('Duck', '#B4A7D6', 'black')
defineFoodColour('Turkey', '#C59F7B', 'black')
defineFoodColour('Poultry', '#FFE599', 'black')
defineFoodColour('Beef', '#783F04', 'white')
defineFoodColour('Tuna', '#A4C2F4', 'black')
defineFoodColour('Dry Tuna', '#A4C2F4', 'black')
defineFoodColour('White Fish', '#D0E0E3', 'black')
defineFoodColour('Salmon', '#F4CCCC', 'black')
defineFoodColour('Coley', '#CFE2F3', 'black')
defineFoodColour('Lamb', '#660000', 'white')
defineFoodColour('Treats', '#FFEEDD', 'black')
defineFoodColour('default', '#777777', 'white')

function insertFeedingChart(feedingDatasets) {
  const chartId = `feedingChart-${feedingCharts.length}`
  document.write(`<canvas id="${chartId}" width="100%"></canvas>`)
  const ctx = document.getElementById(chartId).getContext('2d')
  const datasets = feedingDatasets.map(d => {
    return {
      label: d.label || '# times fed',
      name: d.name || '',
      data: d.data || [],
      backgroundColor: d.labels.map(l => (foodColours[l.toLowerCase()] || foodColours.default).background),
      borderColor: d.labels.map(l => 'black'),
      borderWidth: 2
    }
  })
  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: feedingDatasets[0].labels,
      datasets
    },
    options: {
      aspectRatio: 1.5,
      layout: {
        padding: 15
      },
      legend: {
        display: true
      },
      tooltips: {
        callbacks: {
          label: (tti, data) => {
            const dataset = data.datasets[tti.datasetIndex]
            console.log('?', tti, data)
            const value = dataset.data[tti.index]
            const label = data.labels[tti.index]
            return `${dataset.name} : ${label} ${value}`
          }
        }
      },
      plugins: {
        labels: {
          // render 'label', 'value', 'percentage', 'image' or custom function, default is 'percentage'
          render: (d) => `${d.value}`,
          // precision for percentage, default is 0
          precision: 0,
          // position to draw label, available value is 'default', 'border' and 'outside'
          position: 'default',
          // add padding when position is `outside`
          // default is 2
          outsidePadding: 4,
          // add margin of text when position is `outside` or `border`
          // default is 2
          textMargin: 4,
          fontColor: 'black',
          fontStyle: 'bold',
          fontSize: 14
        }
      }
    }
  })
  feedingCharts.push(chart)
}

document.insertFeedingChart = insertFeedingChart
