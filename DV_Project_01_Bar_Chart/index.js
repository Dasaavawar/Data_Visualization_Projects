let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let xmlhttp = new XMLHttpRequest();

let data 
let values

let heightScale
let widthScale
let xAxisScale
let yAxisScale

let width = 940
let height = 500
let padding = 48

let quarterFormat = (dateString) => {
  let year = dateString.split('-')[0]
  let month = dateString.split('-')[1]
  
  if (['01', '02', '03'].includes(month)) {
    return year + ' Q1'
  } else if (['04', '05', '06'].includes(month)) {
    return year + ' Q2'
  } else if (['07', '08', '09'].includes(month)) {
    return year + ' Q3'
  } else if (['10', '11', '12'].includes(month)) {
    return year + ' Q4'
  }
}

let billionFormat = (productString) => {
  return '$' + productString.toLocaleString() + ' Billion'
}

let svg = d3.select('svg')

let generateScale = () => {
  let datesArray = values.map((item) => {
    return new Date(item[0])
  })

  heightScale = d3.scaleLinear()
  .domain([0, d3.max(values, (item) => { return item[1] })])
  .range([0, height - (2*padding)])

   widthScale = d3.scaleLinear()
  .domain([0, values.length-1])
  .range([padding, width-padding ])  

  xAxisScale = d3.scaleTime()
  .domain([d3.min(datesArray), d3.max(datesArray)])
  .range([padding, width-padding])
   
  yAxisScale = d3.scaleLinear()
  .domain([0, d3.max(values, (item) => { return item[1] })])
  .range([height - padding, padding])

}

let drawCanvas = () => {
  svg.attr('width', width);
  svg.attr('height' , height)
}

let drawAxis = () => {
  let xAxis = d3.axisBottom(xAxisScale);
  let yAxis = d3.axisLeft(yAxisScale)
  
  svg.append('g')
  .call(xAxis)
  .attr('id', 'x-axis' )
  .attr('transform', 'translate(0, ' + (height-padding) + ')')

  svg.append('g')
  .call(yAxis)
  .attr('id', 'y-axis')
  .attr('transform', 'translate(' + padding + ', 0)' )
  
  svg.append('text')
  .attr('x', width - (padding/2))
  .attr('y', height)
  .style('text-anchor', 'end')
  .style('font-size', '14px')
  .text('More Information: http://www.bea.gov/national/pdf/nipagu')

  svg.append('text')
  .attr('x', -(padding*3))
  .attr('y', padding + (padding/2))
  .style('text-anchor', 'middle')
  .style('font-size', '16px')
  .attr('transform', 'rotate(-90)')
  .text('Gross Domestic Product')
}

let drawBars = () => {
  let tooltip = d3.select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style('visibility', 'hidden')
  .style('position', 'absolute')
  .style('width', 'auto')
  .style('height', 'auto')
  .style('background', 'rgba(173, 216, 230, 0.8)')
  .style('box-shadow', '2px 2px 4px rgba(65,105,225, 0.8)')
  .style('border-radius', '2.5px')
  .style('padding', '6px')
  .style('text-align', 'center')

  svg.selectAll('rect')
  .data(values)
  .enter()
  .append('rect')
  .attr('class', 'bar')
  .attr('width', (width - (2*padding)) / values.length)
  .attr('data-date', (item) => item[0])
  .attr('data-gdp', (item) => item[1])
  .attr('height', (item) => { return heightScale(item[1]) })
  .attr('x', (item, index) => { return widthScale(index) })
  .attr('y', (item, index) => { return (height - padding) - heightScale(item[1]) })
  .on('mouseover', (event, item) => {         
    tooltip.transition()
    .style('visibility', 'visible')
    
    tooltip.data(item)
    .attr('data-date', item[0])
    .attr('data-gdp', item[1])
    .html(`${quarterFormat(item[0])} <br> ${billionFormat(item[1])}`)
    .style('left', (event.clientX + 12) + 'px')
    .style('top', (event.clientY) + 'px')

    d3.select(event.currentTarget)
      .attr('class', 'bar hover');
  })
  .on('mouseout', (event, item) => {
    tooltip.transition()
    .style('visibility', 'hidden');
    
    d3.select(event.currentTarget)
    .attr('class', 'bar');
  })
}

xmlhttp.open ('GET', url, true);
xmlhttp.onload = () => {
   data = JSON.parse(xmlhttp.responseText)
   values = data.data
   generateScale()
   drawCanvas()
   drawBars()
   drawAxis()
}
xmlhttp.send();
