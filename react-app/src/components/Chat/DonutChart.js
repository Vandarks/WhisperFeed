import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  ["Task", "Hours per Day"],
  ["Bad", 1],
  ["OK", 3],
  ["Good", 3],
];

export const options = {
  title: "Ohjelmistotuotanto",
  pieHole: 0.4,
  is3D: false,
  backgroundColor: "transparent",
  legend: "none",
  width: 500,
  height: 400,
  slices: {
    0: {color: "red"},
    1: {color: "yellow"},
    2: {color: "green"}
  }
};

function Donut() {
  return (
    <Chart
      chartType="PieChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
}


export {Donut};