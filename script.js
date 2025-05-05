d3.csv("data.csv").then(data => {
  data.forEach(d => {
    d.Revenue = +d.Revenue;
  });

  // Bar chart
  const barSvg = d3.select("#barChart");
  const barMargin = { top: 30, right: 20, bottom: 100, left: 80 },
        barWidth = 400 - barMargin.left - barMargin.right,
        barHeight = 400 - barMargin.top - barMargin.bottom;

  const barGroup = barSvg.append("g")
    .attr("transform", `translate(${barMargin.left},${barMargin.top})`);

  const x = d3.scaleBand()
    .domain(data.map(d => d.Title))
    .range([0, barWidth])
    .padding(0.3);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Revenue)])
    .nice()
    .range([barHeight, 0]);

  barGroup.append("g")
    .call(d3.axisLeft(y).tickFormat(d3.format("$.2s")));

  barGroup.append("g")
    .attr("transform", `translate(0,${barHeight})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .style("fill", "#fff");

  barGroup.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => x(d.Title))
    .attr("y", d => y(d.Revenue))
    .attr("width", x.bandwidth())
    .attr("height", d => barHeight - y(d.Revenue))
    .attr("fill", "#00d8ff");

  // Pie chart (Genre distribution)
  const genreCounts = d3.rollups(data, v => v.length, d => d.Genre);
  const pie = d3.pie().value(d => d[1])(genreCounts);
  const arc = d3.arc().innerRadius(0).outerRadius(150);
  const pieSvg = d3.select("#pieChart")
    .append("g")
    .attr("transform", "translate(200,200)");

  const color = d3.scaleOrdinal()
    .domain(genreCounts.map(d => d[0]))
    .range(d3.schemeSet2);

  pieSvg.selectAll("path")
    .data(pie)
    .join("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data[0]));

  pieSvg.selectAll("text")
    .data(pie)
    .enter()
    .append("text")
    .text(d => d.data[0])
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .style("fill", "white")
    .style("font-size", "12px")
    .style("text-anchor", "middle");
});
