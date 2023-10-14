let countyUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
let educationUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

const firstRequest = new XMLHttpRequest();
const secondRequest = new XMLHttpRequest();

let countyData
let educationData

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => {
    canvas.selectAll('path')
    .data(countyData)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr('fill', (countyDataItem) => {
        let id = countyDataItem['id']
        let county = educationData.find((item) => {
            return item['fips'] === id
        })
        let percentage = county['bachelorsOrHigher']
        if (percentage <= 12){
            return '#e5f5e0'
        } else if (percentage <= 21) {
            return '#c7e9c0'
        } else if (percentage <= 30) {
            return '#a1d99b'
        } else if (percentage <= 39) {
            return '#74c476'
        } else if (percentage <= 48) {
          return '#41ab5d'
        } else if (percentage <= 57) {
        return '#238b45'
        } else if (percentage <= 66) {
          return '#006d2c'
        }
    })
    .attr('data-fips', (countyDataItem) => {
        return countyDataItem['id']
    })
    .attr('data-education', (countyDataItem) => {
        let id = countyDataItem['id']
        let county = educationData.find((item) => {
            return item['fips'] === id
        })
        let percentage = county['bachelorsOrHigher']
        return percentage
    })

    canvas.append('path')
    .classed("stateBorder", true)
    .attr("fill", "none")
    .attr("stroke", "red")
    .data(stateData, (a, b) => a !== b)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('d', path)
    /*
    .on('mouseover', (countyDataItem)=> {
        tooltip.transition()
            .style('visibility', 'visible')

        let id = countyDataItem['id']
        let county = educationData.find((item) => {
            return item['fips'] === id
        })

        tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + 
            county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')

        tooltip.attr('data-education', county['bachelorsOrHigher'] )
    })
    .on('mouseout', (countyDataItem) => {
        tooltip.transition()
            .style('visibility', 'hidden')
    })
    */

    // .attr('class', 'state')
    // .style('stroke', 'blue') // Set the stroke color for lines within states
    // .style('stroke-width', 1);

    /*
    let borders = svg.append("path")
	  	.classed("stateBorder", true)
	  	.attr("fill", "none")
	  	.attr("stroke", "black")
    .datum(topojson.mesh(geoData, geoData.objects.states), (a, b) => a !== b)
    	.attr('d', path)
      */
    
}

firstRequest.open('GET', countyUrl, true);
firstRequest.onload = function () {
  if (firstRequest.status >= 200 && firstRequest.status < 400) {
    const data = JSON.parse(firstRequest.responseText);
    countyData = topojson.feature(data, data.objects.counties).features;
    stateData = topojson.feature(data, data.objects.states).features;

    secondRequest.open('GET', educationUrl, true);
    secondRequest.onload = function () {
      if (secondRequest.status >= 200 && secondRequest.status < 400) {
        educationData = JSON.parse(secondRequest.responseText);
        drawMap();
      }
    };
    secondRequest.onerror = function () {
      console.error('Error loading education data');
    };
    secondRequest.send();
  }
};
firstRequest.onerror = function () {
  console.error('Error loading county data');
};
firstRequest.send();