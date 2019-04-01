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

function insertFeedingChart({ data, labels }) {
  const chartId = `feedingChart-${feedingCharts.length}`
  document.write(`<canvas id="${chartId}" width="100%"></canvas>`)
  const ctx = document.getElementById(chartId).getContext('2d')
  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        label: '# times fed',
        data,
        backgroundColor: labels.map(l => (foodColours[l.toLowerCase()] || foodColours.default).background),
        borderColor: labels.map(l => 'black'),
        borderWidth: 3
      }]
    },
    options: {
      aspectRatio: 1.5
    }
  })
  feedingCharts.push(chart)
}

document.insertFeedingChart = insertFeedingChart
