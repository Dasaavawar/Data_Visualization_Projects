let countyUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let educationUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

const firstRequest = new XMLHttpRequest();
const secondRequest = new XMLHttpRequest();

let geoData
let countyData
let educationData

let canvas = d3.select("#canvas")
let tooltip = d3.select("#tooltip")

let drawMap = () => {
  const path = d3.geoPath();

  let tooltip = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("visibility", "hidden")
  .style("position", "absolute")
  .style("width", "auto")
  .style("height", "auto")
  .style("box-shadow", "2px 2px 4px rgba(0, 0, 0, 0.2)")
  .style("border-radius", "2.5px")
  .style("padding", "12px")
  .style("text-align", "center")
  .style("vertical-align", "middle")
  .style("font-size", "14px")
  .style("background", "rgba(255, 250, 205, 0.8)")
  .style("color", "rgba(0, 0, 0, 1)")
  .style("font-family", "Arial")
  .style("font-weight", "lighter")
  
  canvas.selectAll("path")
  .data(countyData)
  .enter()
  .append("path")
  .attr("d", d3.geoPath())
  .attr("class", "county")
  .attr("fill", (countyDataItem) => {
    let id = countyDataItem["id"]
    let county = educationData.find((item) => {
      return item["fips"] === id
    })
    let percentage = county["bachelorsOrHigher"]
      if (percentage <= 12){
        return "#e5f5e0"
      } else if (percentage <= 21) {
        return "#c7e9c0"
      } else if (percentage <= 30) {
        return "#a1d99b"
      } else if (percentage <= 39) {
        return "#74c476"
      } else if (percentage <= 48) {
        return "#41ab5d"
      } else if (percentage <= 57) {
        return "#238b45"
      } else if (percentage <= 66) {
        return "#006d2c"
      }
  })
  .attr("data-fips", (countyDataItem) => {
    return countyDataItem["id"]
  })
  .attr("data-education", (countyDataItem) => {
    let id = countyDataItem["id"]
    let county = educationData.find((item) => {
      return item["fips"] === id
    })
    let percentage = county["bachelorsOrHigher"]
    return percentage
  })
  .on("mouseover", (event, countyDataItem) => {
    tooltip.transition()
    .style("visibility", "visible")

    let id = countyDataItem["id"]
    let county = educationData.find((item) => {
      return item["fips"] === id
    })

    tooltip
    .attr("data-education", county["bachelorsOrHigher"])
    .html(() => {
      return `${county["area_name"]}, ${county["state"]}: ${county["bachelorsOrHigher"]}%`;
    })
    .style("left", (event.clientX + 20) + "px")
    .style("top", (event.clientY - 40) + "px")

  })
  .on("mouseout", (event, countyDataItem) => {
    tooltip.transition()
    .style("visibility", "hidden")
  })

  canvas.append("path")
  .classed("stateBorder", true)
  .attr("fill", "none")
  .attr("stroke", "white")
  .attr("d", path(topojson.mesh(geoData, geoData.objects.states), (a, b) => a !== b))
}

firstRequest.open("GET", countyUrl, true);
firstRequest.onload = function () {
  if (firstRequest.status >= 200 && firstRequest.status < 400) {
    geoData = JSON.parse(firstRequest.responseText);
    countyData = topojson.feature(geoData, geoData.objects.counties).features;
    stateData = topojson.feature(geoData, geoData.objects.states).features;

    secondRequest.open("GET", educationUrl, true);
    secondRequest.onload = function () {
      if (secondRequest.status >= 200 && secondRequest.status < 400) {
        educationData = JSON.parse(secondRequest.responseText);
        drawMap();
      }
    };
    secondRequest.onerror = function () {
      console.error("Error loading education data");
    };
    secondRequest.send();
  }
};
firstRequest.onerror = function () {
  console.error("Error loading county data");
};
firstRequest.send();

