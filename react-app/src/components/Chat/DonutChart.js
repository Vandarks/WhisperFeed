import React from "react";
import { Chart } from "react-google-charts";


function Donut(props) {
  const pieData = props.data;
  const pieOptions = props.options
  
  return (
    <Chart
      chartType="PieChart"
      width="100%"
      height="400px"
      data={pieData}
      options={pieOptions}
    />
  );
}

export {Donut};