d3.csv("data.csv").then(data => {
  data.forEach(d => {
    d.Revenue = +d.Revenue;
  });

  const margin = { top: 40, right: 30, bottom: 120, left: 100 },
        width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

  const svg = d3.select("#barChart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
    .domain(data.map(d => d.Title))
    .range([0, width])
    .padding(0.3);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Revenue)])
    .nice()
    .range([height, 0]);

  svg.append("g")
    .call(d3.axisLeft(y).tickFormat(d3.format("$.2s")).ticks(5))
    .selectAll("text")
    .style("fill", "#fff");

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .style("fill", "#fff");

  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => x(d.Title))
    .attr("y", d => y(d.Revenue))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.Revenue))
    .attr("fill", "#00d8ff");
});
