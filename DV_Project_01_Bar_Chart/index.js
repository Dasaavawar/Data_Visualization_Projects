const {useState, useEffect, useRef} = React;

const BarChart = ({data}) => {
  
  const svgRef = React.useRef(null);

  const marginTop = 25;
  const marginBottom = 25;
  const marginLeft = 15;
  const marginRight = 15;
  //const width = 400 //Math.floor(window.innerWidth / 2) - marginLeft - marginRight;
  //const height = 1200 //Math.floor(window.innerHeight) - marginTop - marginBottom;
  
  useEffect(() => {
    if (!data || !data.data || data.data.length === 0) {
      return;
    }

  const chartData = data.data;
  const dateData = chartData.map(dat => dat[0]);
  const gdpData = chartData.map(dat => dat[1]);

  const minDate = d3.min(data.from_date)
  const maxDate = d3.max(data.to_date)
  const minGDP = d3.min(gdpData)
  const maxGDP = d3.max(gdpData)
  
  const svg = d3.select(svgRef.current)

  const dataData = [2, 4.3, 5, 6, 34, 100, 200, 500, 1800]
  
  svg.selectAll('rect')
    .data(dataData)
    .enter()
    .append('rect')
    .attr('x', (d, i) => i * 5)
    .attr('y', (d) => 100 - d)
    .attr('width', 5)
    .attr('height', (d) => d)
    .attr('fill', 'blue');
    
  }, [data, width, height]);
  
  return (
    <div>
      <div id="title">{String(data.source_name)}</div>
      <svg ref={svgRef} data={data} width={width} height={height}></svg>
      <>{JSON.stringify(data.data)}</>
    </div>
  )
}

const App = () => {

  let baseURL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'

  const [data, setData] = React.useState([])

  useEffect(() => {
    axios.get(baseURL).then(response => {
      setData(response.data)
    })
  }, [])

  return(
    <div id="bar-chart">
      <BarChart data={data}/>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("app"))

/*    const rectNode = rectRef.current;
    


    const svg = d3.select(rectRef.current)
    .attr('width', width)
    .attr('height', height);

  }, [data])
  
  */









/*
var marginTop = 10;
var marginBottom = 25;
var marginLeft = 60;
var marginRight = 15;
var width = 700 - marginLeft;
var height = 400 - marginBottom;
var maxDate = new Date(data.to_date);
var minDate = new Date(data.from_date);

var scaleY = d3.scale.linear()
    .domain([0, d3.max(data.data.map(function(d) { return d[1]; }))])
    .range([0, height - marginTop]);

var scaleX = d3.scale.ordinal()
    .domain(d3.range(0, data.data.length))
    .rangeBands([0, width - marginRight]);
  
var axisY = d3.svg.axis()
  .scale(d3.scale.linear()
    .domain([d3.max(data.data.map(function(d) { return d[1]; })), 0])
    .range([0, height - marginTop]))
  .orient("left")
  .ticks(11);

var axisX = d3.svg.axis()
  .scale(d3.time.scale()
      .domain([minDate, maxDate])
      .range([0, width -marginRight ]))
  .orient('bottom')
  .ticks(d3.time.years, 5);

var bar = d3.select('.chart')
  .append('svg')
  .attr('width', width + marginLeft)
  .attr('height', height + marginBottom)
  .style({'background': '#fff', 'position' : 'relative'})

var toolTip = d3.select('.chart')
  .append('div')
  .attr('class', 'tooltip')
  .attr('style','visibility: hidden;')

bar.append('g')
  .append('text')
  .attr('x', marginLeft * 2)
  .attr('y', marginBottom)
  .attr("style","font-family:sans;font-size: 29px;font-weight:100; stroke:#444;")
  .text(data.source_name)
  

bar.append('g')
  .attr('transform', 'translate('+(marginLeft - 1)+', '+marginTop+')')
  .call(axisY)
  .selectAll('line')
  .style({ 'stroke': '#000', 'stroke-width': '0.1'})
  .selectAll('text')
  .attr("style","font-size: 12px;")

bar.append('g')
  .attr('transform', 'translate('+(marginLeft - 1)+', '+(height + 1)+')')
  .call(axisX)
  .selectAll('line')
  .style({ 'stroke': '#000', 'stroke-width': '0.1'})
  .selectAll('text')
  .style('transform','rotate(-90deg)')
  .attr("style","font-size: 12px;")
  
bar.append('g')
  .attr('transform', 'translate(' + marginLeft + ',0)')
  .selectAll('rect')
  .data(data.data)
  .enter()
  .append('rect')
  .style({'fill' : 'steelblue'})
  .attr('width', scaleX.rangeBand())
  .attr('height', function(d) { return scaleY(d[1]) })
  .attr('x', function(d, i) { return i * scaleX.rangeBand()})
  .attr('y', function(d) { return height - scaleY(d[1]) })
  .on('mouseover', function(d) {
    var posX = d3.event.pageX;
    var posY = d3.event.pageY;
    toolTip
      .attr('style','left:'+ posX +'px;top:'+ posY +'px; visibility: visible;')
      .html(d[0] + '<br /><strong>'+d[1]+'</strong>')
  
    d3.select(this).style('fill', '#ff33ff');
  })
  .on('mouseout', function(d) {
    d3.select(this).style('fill', 'steelblue');
    toolTip.attr('style', 'visibility: hidden;');
  })
*/