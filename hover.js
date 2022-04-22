const period = [
    'day',
    'week',
    'month',
    'year'
  ]
  
const data = [
    { name: 'Simon', score: 80},
    { name: 'Mary', score: 100},
    { name: 'John', score: 50},
    { name: 'Brandon', score: 30}
];

const startingDate = moment('2022-04-01')

function formatDate(d, i, period) { return moment(startingDate).add(i, period).format('MMMM') }

function addDate(i) { return new Date(2022, 1, i) }

const width = 800;
const height = 400;
const margin = { top: 50, bottom: 50, left: 50, right: 50 }

const svg = d3.select('#canvas')
    .append('svg')
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right)
        .attr('viewBox', [0, 0, width, height])
    .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

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

const tooltip = d3.select("#canvas")
    .append("div")
    .attr("class", "tooltip")
    .style('background-color', 'white')
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style('width', '8%')
    .style('visibility', 'hidden')

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

x.domain(data.map(d => d.name))
currentXAxis
    .transition()
    .duration(500)
    .call(xAxis)

y.domain([0, d3.max(data, d => d.score)])
currentYAxis
    .transition()
    .duration(500)
    .call(yAxis)

var u = svg.append('g').selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', d => x(d.name))
    .attr('y', d => y(d.score))
    .attr('width', x.bandwidth())
    .attr('fill', 'red')
    .attr('opacity', '0.2')
    .attr('height', d => (height - margin.bottom) - y(d.score))
    .on('mouseover', function() { tooltip.style("visibility", 'visible') })
    .on('mousemove', function(event, d) {
        console.log(`X: ${event.x} Y: ${event.y}`)
        tooltip
            .html("Score: " + d.score)
            .style('transform', `translate(${event.x}px, ${ (event.y - 630)}px)`)
    })
    .on('mouseout', function() { return tooltip.style("visibility", "hidden") })
