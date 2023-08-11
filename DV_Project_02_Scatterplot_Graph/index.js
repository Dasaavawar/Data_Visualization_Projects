let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
let xmlhttp = new XMLHttpRequest();

let data 
let values

let xAxisScale
let yAxisScale

let width = 940
let height = 500
let padding = 48

let svg = d3.select('svg')

let generateScale = () => {
  xAxisScale = d3.scaleLinear()
  .domain([d3.min(values, (item) => { return item['Year'] }) - 1, d3.max(values, (item) => { return item['Year'] }) + 1])
  .range([padding, width-padding])
  
  yAxisScale = d3.scaleTime()
  .domain([d3.max(values, (item) => { return new Date(item['Seconds'] * 1000) }), d3.min(values, (item) => { return new Date(item['Seconds'] * 1000) })])
  .range([height - padding, padding])
}

let drawCanvas = () => {
  svg.attr('width', width);
  svg.attr('height' , height)
}

let drawAxis = () => {
  let xAxis = d3.axisBottom(xAxisScale)
  .tickFormat(d3.format('d'))

  let yAxis = d3.axisLeft(yAxisScale)
  .tickFormat(d3.timeFormat('%M:%S'))
  
  svg.append('g')
  .call(xAxis)
  .attr('id', 'x-axis' )
  .attr('transform', 'translate(0, ' + (height-padding) + ')')

  svg.append('g')
  .call(yAxis)
  .attr('id', 'y-axis')
  .attr('transform', 'translate(' + padding + ', 0)' )

  svg.append('text')
  .attr('x', -(padding*3) + (padding/2))
  .attr('y', padding + (padding/2))
  .style('text-anchor', 'middle')
  .style('font-size', '16px')
  .attr('transform', 'rotate(-90)')
  .text('Time in minutes')
}



let drawDots = () => {
  svg.selectAll("circle")
  .data(values)
  .enter()
  .append('circle')
  .attr('class', 'dot')
  .attr('r', 5)
  .attr('cx', (item) => { return xAxisScale(item['Year']) })
  .attr('cy', (item) => { return yAxisScale(new Date(item['Seconds'] * 1000)) })
}

xmlhttp.open ('GET', url, true);
xmlhttp.onload = () => {
  data = JSON.parse(xmlhttp.responseText)
  values = data
  generateScale()
  drawCanvas()
  drawAxis()
  drawDots()
}
xmlhttp.send();