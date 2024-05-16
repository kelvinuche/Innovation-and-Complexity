import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ClipLoader } from 'react-spinners';
import { css } from '@emotion/react';

const BarChart = ({ data }) => {
  const svgRef = useRef();
  const legendRef = useRef();
  const tableRef = useRef(); // Reference for the table element
  const [loading, setLoading] = useState(true);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [sumData, setSumData] = useState([]);

  console.log("Barchart data ", {data});

  useEffect(() => {
    const updateChart = (selectedYear) => {
      const margin = { top: 20, right: 20, bottom: 50, left: 70 };
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
      const legendSvg = d3.select(legendRef.current);
      legendSvg.selectAll("*").remove();

      const keys = Object.keys(data[0] || {}).filter(key => key !== "Entity" && key !== "Code" && key !== "Year");
      const numYears = data.length;

      // console.log("num years", {numYears});

      const barWidth = 100;
      const width = numYears * barWidth + margin.left + margin.right + 200;
      const height = 600 - margin.top - margin.bottom;

      const filteredData = data.filter(d => d.Year === selectedYear);

      const newSvg = svg
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const x0 = d3.scaleBand()
        .domain(filteredData.map(d => d.Year))
        .rangeRound([0, numYears * barWidth])
        .paddingInner(0.1);

      const x1 = d3.scaleBand()
        .domain(keys)
        .rangeRound([0, x0.bandwidth()])
        .padding(0.2);

      const y = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d3.max(keys, key => d[key]))])
        .nice()
        .rangeRound([height, 0]);

      const color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemeCategory10);

      newSvg.selectAll(".bar-group")
        .data(filteredData)
        .enter()
        .append("g")
        .attr("class", "bar-group")
        .attr("transform", d => `translate(${x0(d.Year)},0)`)
        .selectAll("rect")
        .data(d => keys.map(key => ({ key, value: d[key] })))
        .enter()
        .append("rect")
        .attr("x", d => x1(d.key))
        .attr("y", d => y(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", d => y(0) - y(d.value))
        .attr("fill", d => color(d.key))
        .append("title")
        .text(d => `${d.key}: ${d.value}`)
        .on('mouseover', (event, d) => {
          setTooltipContent({
            location: d.Entity,
            year: d.Year,
            disease: d.key,
            value: d.value,
            x: event.pageX,
            y: event.pageY
          });
        })
        .on('mouseleave', () => {
          setTooltipContent(null);
        });

      newSvg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x0).tickSizeOuter(2));

      newSvg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

      newSvg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.top + 20)
        .text("Year");

      newSvg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - height / 2)
        .attr("y", 0 - margin.left)
        .attr("dy", "1em")
        .text("Number of Deaths");

      const legend = legendSvg.selectAll(".legend")
        .data(keys)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

      legend.append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

      legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(d => d)
        .style("cursor", "pointer");

      setLoading(false);
    };

    const updateTable = () => {
      if (!data || data.length === 0) return;

      const table = d3.select(tableRef.current);

      table.selectAll('*').remove();

      const years = Array.from(new Set(data.map(d => d.Year)));
      const diseases = Object.keys(data[0]).filter(key => key !== "Entity" && key !== "Code" && key !== "Year");

      const sums = [];

      years.forEach(year => {
        const sumObj = { Year: year };
        diseases.forEach(disease => {
          const sum = d3.sum(data.filter(d => d.Year === year), d => d[disease]);
          sumObj[disease] = sum || 0;
        });
        sums.push(sumObj);
      });

      setSumData(sums);

      const thead = table.append('thead');
      thead.append('tr')
        .selectAll('th')
        .data(['Year', ...diseases])
        .enter()
        .append('th')
        .style('font-size', '15px')
        .style('color', '#ffffff')
        .style('padding', '12px')
        .style('margin-bottom', '50px')
        .style('background-color', 'purple') // Background color for headers
        .text(d => d);

      const tbody = table.append('tbody');
      sums.forEach((d, index) => { // Add 'sum' as a parameter
        const row = tbody.append('tr');
        
        if (index % 2 === 1) {
            row.style('background-color', '#d3d3d3');
          }

        // row.style('background-color', '#d3d3d3');
        // Object.entries(d).forEach(([key, value], index) => { // Use Object.entries to iterate over keys and values
        //   const cell = row.append('td').text(numberWithCommas(value)).style('padding', '12px');
        // });
        Object.entries(d).forEach(([key, value], index) => { 
          // Use Object.entries to iterate over keys and values
          const cell = row.append('td').text(key === "Year" ? value : numberWithCommas(value)).style('padding', '12px');
        });
      });
    };

    updateChart(selectedYear);
    updateTable();
  }, [data, selectedYear]);

  useEffect(() => {
    if (tooltipContent) {
      const tooltip = d3.select(svgRef.current.parentElement).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip.html(
        `<strong>${tooltipContent.location}</strong><br>
          Year: ${tooltipContent.year}<br>
          Disease: ${tooltipContent.disease}<br>
          Value: ${tooltipContent.value}`
      )
        .style('left', `${tooltipContent.x}px`)
        .style('top', `${tooltipContent.y - 28}px`);
    } else {
      d3.select(".tooltip").remove();
    }
  }, [tooltipContent]);

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const numberWithCommas = (number) => {
    return number.toLocaleString('en-US');
  };
  

  const spinnerStyle = css`
    display: block;
    margin: 0 auto;
  `;

  if (loading) {
    return (
      <div className="spinner-container flex flex-row justify-center m-4">
        <ClipLoader color="red" loading={loading} css={spinnerStyle} size={50} padding={20} />
      </div>
    );
  }

  return (
    <div>
      <div>
        <label className='text-red-500'>* Please select a year </label> <br/>
        <label htmlFor="year-select">Select a Year: </label>
        <select id="year-select" onChange={handleYearChange}>
          <option value="">--</option>
          {data.map((d, index) => (
            <option key={index++} value={d.Year}>{d.Year}</option>
          ))}
        </select>
      </div>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg ref={svgRef}></svg>
      </div>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg ref={legendRef}></svg>
      </div>

      <h1 className='text-center text-3xl m-3'>Total Number of Deaths per year (2009 - 2019)  </h1>
      <div style={{ width: '100%', overflowX: 'auto', border: '1px solid #ddd', borderRadius: '5px' }}>
        <table ref={tableRef} style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'center' }}></table>
      </div>
    </div>
  );
};

export default BarChart;
