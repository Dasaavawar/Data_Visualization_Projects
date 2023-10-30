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

let dataset = datasets[urlParams.get("data") || defaultDataset];
const defaultDataset = "videogames";

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

let generateMap = () => {
  let body = d3.select("body");

  let tooltip = body
  .append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);
  
  let svg = d3.select("#canvas"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

  let fader = function (color) {
    return d3.interpolateRgb(color, "#fff")(0.2);
  },
  color = d3.scaleOrdinal(d3.schemeCategory20.map(fader));

  let treemap = d3.treemap().size([width, height]).paddingInner(1);

  let root = d3
    .hierarchy(data)
    .eachBefore(function (d) {
      d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
    })
    .sum(sumBySize)
    .sort(function (a, b) {
      return b.height - a.height || b.value - a.value;
    });

  treemap(root);

  let cell = svg
    .selectAll("g")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("class", "group")
    .attr("transform", function (d) {
      return "translate(" + d.x0 + "," + d.y0 + ")";
    });

  cell
    .append("rect")
    .attr("id", function (d) {
      return d.data.id;
    })
    .attr("class", "tile")
    .attr("width", function (d) {
      return d.x1 - d.x0;
    })
    .attr("height", function (d) {
      return d.y1 - d.y0;
    })
    .attr("data-name", function (d) {
      return d.data.name;
    })
    .attr("data-category", function (d) {
      return d.data.category;
    })
    .attr("data-value", function (d) {
      return d.data.value;
    })
    .attr("fill", function (d) {
      return color(d.data.category);
    })
    .on("mouseover", function (d) {
      tooltip.style("opacity", 0.9);
      tooltip
        .html(
          "Name: " +
            d.data.name +
            "<br>Category: " +
            d.data.category +
            "<br>Value: " +
            d.data.value
        )
        .attr("data-value", d.data.value)
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      tooltip.style("opacity", 0);
    });

  cell
    .append("text")
    .attr("class", "tile-text")
    .selectAll("tspan")
    .data(function (d) {
      return d.data.name.split(/(?=[A-Z][^A-Z])/g);
    })
    .enter()
    .append("tspan")
    .attr("x", 4)
    .attr("y", function (d, i) {
      return 13 + i * 10;
    })
    .text(function (d) {
      return d;
    });
}

let generateLegend = () => {
  let fader = function (color) {
    return d3.interpolateRgb(color, "#fff")(0.2);
  },
  color = d3.scaleOrdinal(d3.schemeCategory20.map(fader));

  let root = d3
    .hierarchy(data)
    .eachBefore(function (d) {
      d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
    })
    .sum(sumBySize)
    .sort(function (a, b) {
      return b.height - a.height || b.value - a.value;
    });

  let categories = root.leaves().map(function (nodes) {
    return nodes.data.category;
  });
  categories = categories.filter(function (category, index, self) {
    return self.indexOf(category) === index;
  });

  let legend = d3.select("#legend");
  let legendWidth = +legend.attr("width");
  
  let legendElemsPerRow = Math.floor(legendWidth / legendHorizontalSpacing);

  let legendElem = legend
    .append("g")
    .attr("transform", "translate(60," + legendOffset + ")")
    .selectAll("g")
    .data(categories)
    .enter()
    .append("g")
    .attr("transform", function (d, i) {
      return (
        "translate(" +
        (i % legendElemsPerRow) * legendHorizontalSpacing +
        "," +
        (Math.floor(i / legendElemsPerRow) * legendRectSize +
          legendVerticalSpacing * Math.floor(i / legendElemsPerRow)) +
        ")"
      );
    });

  legendElem
    .append("rect")
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .attr("class", "legend-item")
    .attr("fill", function (d) {
      return color(d);
    });

  legendElem
    .append("text")
    .attr("x", legendRectSize + legendTextXOffset)
    .attr("y", legendRectSize + legendTextYOffset)
    .text(function (d) {
      return d;
    });
}

let xmlHttp = new XMLHttpRequest();
xmlHttp.open ('GET', dataset.url, true);
xmlHttp.onload = () => {
  data = JSON.parse(xmlHttp.responseText)
  generateMap()
  generateLegend()
}
xmlHttp.send();