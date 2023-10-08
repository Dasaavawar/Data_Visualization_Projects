let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
let xmlhttp = new XMLHttpRequest();

let baseTemp
let values = []

let xScale
let yScale

let xAxis
let yAxis

let width = 1240
let height = 500
let padding = 80

let monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

let colorScale = [
  "#313695",
  "#4575b4",
  "#abd9e9",
  "#e0f3f8",
  "#ffffbf",
  "#fee090",
  "#fdae61",
  "#f46d43",
  "#d73027",
  "#a50026",
]

let svg = d3.select('svg')
let tooltip = d3.select("#tooltip")

let generateScale = () => {
  let minYear = d3.min(values, (item) => {
    return item["year"];
  })

  let maxYear = d3.max(values, (item) => {
    return item["year"];
  })

  xScale = d3.scaleLinear()
    .domain([minYear, maxYear + 1])
    .range([padding, width - padding])

  yScale = d3.scaleTime()
    .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
    .range([padding, height - padding])
}

let drawCanvas = () => {
  svg.attr('width', width)
  svg.attr('height' , height)
}

let drawAxes = () => {
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"))
  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"))

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (height - padding) + ")")

  svg.append('text')
  .attr('x', width/2)
  .attr('y', height - padding + padding/2)
  .style('text-anchor', 'end')
  .style('font-size', '12px')
  .style('font-family', 'Arial')
  .text('Years')

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)");
}

let drawCells = () => {
  let tooltip = d3
  .select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style('visibility', 'hidden')
  .style('position', 'absolute')
  .style('width', 'auto')
  .style('height', 'auto')
  .style('box-shadow', '2px 2px 4px rgba(0, 0, 0, 0.8)')
  .style('border-radius', '2.5px')
  .style('padding', '6px')
  .style('text-align', 'center')
  .style("vertical-align", "middle")
  .style('font-size', '14px')
  .style('background', 'rgba(0, 0, 0, 0.8)')
  .style('color', 'rgba(255, 255, 255, 1)')
  .style('font-family', 'Arial')
  .style('font-weight', 'lighter')
  
  svg.selectAll("rect")
  .data(values)
  .enter()
  .append("rect")
  .attr("class", "cell")
  .attr("fill", (item) => {
    let variance = item["variance"];
    if (variance <= -4.7) {
      return colorScale[0];
    } else if (variance <= -3.6) {
      return colorScale[1];
    } else if (variance <= -2.5) {
      return colorScale[2];
    } else if (variance <= -1.4) {
      return colorScale[3];
    } else if (variance <= -0.3) {
      return colorScale[4];
    } else if (variance <= 0.8) {
      return colorScale[5];
    } else if (variance <= 1.9) {
      return colorScale[6];
    } else if (variance <= 3) {
      return colorScale[7];
    } else if (variance <= 4.1) {
      return colorScale[8];
    } else {
      return colorScale[9];
    }
  })
  .attr("data-year", (item) => {
    return item["year"];
  })
  .attr("data-month", (item) => {
    return item["month"] - 1;
  })
  .attr("data-temp", (item) => {
    return baseTemp + item["variance"];
  })
  .attr("height", (item) => {
    return (height - 2 * padding) / 12;
  })
  .attr("y", (item) => {
    return yScale(new Date(0, item["month"] - 1, 0, 0, 0, 0, 0));
  })
  .attr("width", (item) => {
    let minYear = d3.min(values, (item) => {
      return item["year"];
    });

    let maxYear = d3.max(values, (item) => {
      return item["year"];
    });

    let yearCount = maxYear - minYear;
      return (width - 2 * padding) / yearCount;
  })
  .attr("x", (item) => {
    return xScale(item["year"]);
  })
  .on("mouseover", (event, item) => {
    tooltip.transition()
    .style('visibility', 'visible')
    .attr("data-year", item["year"])

    d3.select(event.currentTarget)
    .attr('class', 'cell hover')

    tooltip
    .html(() => {
      let temperature = item.variance + 8.6
      let variance = item.variance >= 0 ? String(`+${item.variance.toFixed(1)}`) : String(item.variance.toFixed(1))
      return `${item["year"]} - ${monthNames[item["month"] - 1]} <br> ${temperature.toFixed(1)}°C <br> ${variance}°C`;
    })
    .style('width', '120px')
    .style('left', (event.clientX - 60) + 'px')
    .style('top', (event.clientY - 80) + 'px')
    
  })
  .on("mouseout", (event, item) => {
    tooltip.transition().style("visibility", "hidden")

    d3.select(event.currentTarget)
    .attr('class', 'cell')
  })
}

xmlhttp.open ('GET', url, true);
xmlhttp.onload = () => {
  data = JSON.parse(xmlhttp.responseText)
  baseTemp = data.baseTemperature
  values = data.monthlyVariance
  generateScale()
  drawCanvas()
  drawAxes()
  drawCells()  
}
xmlhttp.send();
