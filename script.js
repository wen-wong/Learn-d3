const period = [
  'day',
  'week',
  'month',
  'year'
]

const data1 = [
  { name: 'Simon', score: 80},
  { name: 'Mary', score: 100},
  { name: 'John', score: 50},
  { name: 'Brandon', score: 30}
];

const startingDate = moment('2022-04-01')

function formatDate(d, i, period) {
  return moment(startingDate).add(i, period).format('MMMM')
}

function addDate(i) {
  return new Date(2022, 1, i)
}

const width = 300;
const height = 300;
const margin = { top: 50, bottom: 50, left: 50, right: 50 }

const svg = d3.select('#canvas')
  .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .attr('viewBox', [0, 0, width, height])
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top}`);

const x = d3.scaleBand()
  .range([margin.left, width - margin.right])
  .padding(0.2);
const currentXAxis = svg.append('g')
const xAxisGenerator = d3.axisBottom(x)
  .tickFormat((d, i) => `${formatDate(d, i, period[2])}`)

const y = d3.scaleLinear()
  .range([height - margin.top, margin.bottom]);
const currentYAxis = svg.append('g')
const yAxisGenerator = d3.axisLeft(y)
  .ticks(4)
  .tickFormat(d => `${d}%`)

 const tooltip = d3
  .select('body')
  .append('div')
  .attr('class', 'd3-tooltip')
  .style('position', 'absolute')
  .style('z-index', '10')
  .style('visibility', 'hidden')
  .style('padding', '10px')
  .style('background', 'rgba(0,0,0,0.6)')
  .style('border-radius', '4px')
  .style('color', '#fff')
  .text('a simple tooltip');

function xAxis(g) {
  g.attr('transform', `translate(0, ${height - margin.bottom})`)
    .attr('font-size', '10px')
  .call(xAxisGenerator)
}

function yAxis(g) {
  g.attr('transform', `translate(${margin.left + 1}, 0)`)
  .attr('font-size', '10px')
  .call(yAxisGenerator)
}

function update(data) {
  x.domain(data.map(d => d.name))
  currentXAxis
    .transition()
    .duration(1000)
    .call(xAxis)

  y.domain([0, d3.max(data, d => d.score)])
  currentYAxis
    .transition()
    .duration(1000)
    .call(yAxis)

  svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
      .attr('fill', 'red')
        .attr('x', d => x(d.name))
        .attr('y', d => y(d.score))
        .attr('width', x.bandwidth())
        .attr('height', d => (height - margin.bottom) - y(d.score))
        .on('mouseover', function(event, d) {
          tooltip.transition()
            .duration(200)
            .style('opacity', .9);
            tooltip.html(d.score)
            .style('left', (event.pageX) + 'px')
            .style('top', (event.pageY - 28) + 'px')
        })
        .on('mousemove', function() {
          tooltip.style('top', d3.event.pageY - 10 + 'px')
            .style('left', d3.event.pageX + 10 + 'px')
        })
        .on('mouseout', (d) => {
          tooltip.transition()
            .duration(200)
            .style('opacity', 0)
        })

}

update(data1)