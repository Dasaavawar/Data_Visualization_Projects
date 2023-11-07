const datasets = {
  videogames: {
    title: "Video Game Sales",
    description: "Top 100 Most Sold Video Games Grouped by Platform",
    url: "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json",
  },

  movies: {
    title: "Movie Sales",
    description: "Top 100 Highest Grossing Movies Grouped By Genre",
    url: "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json",
  },

  kickstarter: {
    title: "Kickstarter Pledges",
    description: "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
    url: "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json",
  },
};

let urlParams = new URLSearchParams(window.location.search);

const defaultDataset = "videogames";
let dataset = datasets[urlParams.get("data") || defaultDataset];


document.getElementById("title").innerHTML = dataset.title;
document.getElementById("description").innerHTML = dataset.description;

const legendOffset = 10;
const legendRectSize = 15;
const legendHorizontalSpacing = 150;
const legendVerticalSpacing = 10;
const legendTextXOffset = 3;
const legendTextYOffset = -2;

function sumBySize(d) {
  return d.value;
}

let canvas = d3.select("#canvas")
let tooltip = d3.select("#tooltip")
let legend = d3.select("#legend");

let generateMap = () => {
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
  .style("padding", "10px")
  .style("text-align", "center")
  .style("vertical-align", "middle")
  .style("font-size", "12px")
  .style("background", "rgba(255, 250, 205, 0.8)")
  .style("color", "rgba(0, 0, 0, 1)")
  .style("font-family", "Arial")
  .style("font-weight", "lighter")
  
  let svg = canvas,
  width = svg.attr("width"),
  height = svg.attr("height");

  let fader = (color) => {
    return d3.interpolateRgb(color, "#fff")(0.2);
  },
  color = d3
    .scaleOrdinal(d3.schemeCategory20.map(fader));

  let treemap = d3.treemap()
    .size([width, height])
    .paddingInner(1);

  let root = d3
    .hierarchy(data)
    .eachBefore((d) => {
      d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
    })
    .sum(sumBySize)
    .sort((a, b) => {
      return b.height - a.height || b.value - a.value;
    });

  treemap(root);

  let cell = svg
    .selectAll("g")
    .data(root.leaves())
    .enter()
    .append("g")
    .style("font-size", "12px")
    .style("font-family", "Arial")
    .style("font-weight", "lighter")
    .attr("class", "group")
    .attr("transform", (d) => {
      return "translate(" + d.x0 + "," + d.y0 + ")";
    });

  cell
    .append("rect")
    .attr("id", (d) => {
      return d.data.id;
    })
    .attr("class", "tile")
    .attr("width", (d) => {
      return d.x1 - d.x0;
    })
    .attr("height", (d) => {
      return d.y1 - d.y0;
    })
    .attr("data-name", (d) => {
      return d.data.name;
    })
    .attr("data-category", (d) => {
      return d.data.category;
    })
    .attr("data-value", (d) => {
      return d.data.value;
    })
    .attr("fill", (d) => {
      return color(d.data.category);
    })
    .on("mouseover", (item) => {
      tooltip.transition()
      .style("visibility", "visible")
      
      tooltip
      .attr("data-value", item.data.value)
      .html(
        "Name: " +
          item.data.name +
          "<br>Category: " +
          item.data.category +
          "<br>Value: " +
          item.data.value
      )
      .style("left", (event.clientX + 20) + "px")
      .style("top", (event.clientY - 40) + "px")
    })
    .on("mouseout", (event) => {
      tooltip.transition()
      .style("visibility", "hidden")
    });

  cell
    .append("text")
    .attr("class", "tile-text")
    .selectAll("tspan")
    .data( (d) => {
      return d.data.name.split(/(?=[A-Z][^A-Z])/g);
    })
    .enter()
    .append("tspan")
    .attr("x", 4)
    .attr("y", (d, i) => {
      return 13 + i * 10;
    })
    .text( (d) => {
      return d;
    });
}

let generateLegend = () => {
  let fader = (color) => {
    return d3.interpolateRgb(color, "#fff")(0.2);
  },
  color = d3.scaleOrdinal(d3.schemeCategory20.map(fader));

  let root = d3
    .hierarchy(data)
    .eachBefore((d) => {
      d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
    })
    .sum(sumBySize)
    .sort((a, b) => {
      return b.height - a.height || b.value - a.value;
    });

  let categories = root.leaves().map((nodes) => {
    return nodes.data.category;
  });
  categories = categories.filter((category, index, self) => {
    return self.indexOf(category) === index;
  });

  let legendElemsPerRow = 2;

  let legendElem = legend
    .append("g")
    .attr("transform", "translate(60," + legendOffset + ")")
    .selectAll("g")
    .data(categories)
    .enter()
    .append("g")
    .attr("transform", (d, i) => {
      return (
        "translate(" +
        (i % legendElemsPerRow) * 1.25 * legendHorizontalSpacing +
        "," +
        (Math.floor(i / legendElemsPerRow) * 3 * legendRectSize +
          legendVerticalSpacing * Math.floor(i / legendElemsPerRow)) +
        ")"
      );
    });

  legendElem
    .append("rect")
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .attr("class", "legend-item")
    .attr("fill", (d) => {
      return color(d);
    });

  legendElem
    .append("text")
    .attr("x", legendRectSize + legendTextXOffset)
    .attr("y", legendRectSize + legendTextYOffset)
    .text((d) => {
      return d;
    });
}

let xmlHttp = new XMLHttpRequest();
xmlHttp.open ("GET", dataset.url, true);
xmlHttp.onload = () => {
  data = JSON.parse(xmlHttp.responseText)
  generateMap()
  generateLegend()
}
xmlHttp.send();