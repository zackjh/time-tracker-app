// Import chart.js components
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

// Import helper functions
import {
  formatDateForDisplay,
  formatDateForKey,
  dateKeyToObj,
  formatDurationForDisplay,
} from "../helpers";

function CategoriesDoughnut({
  timeEntries,
  categories
}) {
  // Object that maps category ids to category data
  const categoriesWithDuration = {
    ...categories,
    "": { name: "No Category", color: "rgba(255, 255, 255, 0.4)" }
  };

  // For each category id
  for (const _id in categoriesWithDuration) {
    // Add an "_id" key with the value of the current _id to the category data object
    // E.g. { myCategoryId: { _id: "myCategoryId" } }
    categoriesWithDuration[_id]._id = _id;
    
    // Add a "totalDuration" key with a value of 0 to the category data object
    // E.g. { myCategoryId: { totalDuration: 0 } }
    categoriesWithDuration[_id].totalDuration = 0;
  }
  
  // For each time entry
  timeEntries.forEach(timeEntry => {
    // Check if the time entry has a valid category
    if (categoriesWithDuration[timeEntry.categoryId]) {
      // Time entry has a valid category
      
      // Add the time entry's duration to its category's totalDuration
      // E.g. 
      // Before:  categoriesWithDuration = { myCategoryId: { name: "myCategoryName", totalDuration: 0 } }
      //          myTimeEntry = { _id: "myCategoryId", duration: 100 }
      // After:   categoriesWithDuration = { myCategoryId: { name: "myCategoryName", totalDuration: 100 } }
      categoriesWithDuration[timeEntry.categoryId].totalDuration += (timeEntry.end - timeEntry.start);
    }
  });

  // Array of objects, with each object representing a category's data
  const chartData = Object.values(categoriesWithDuration);

  // Sort the array by decreasing duration
  chartData.sort((a, b) => b.totalDuration - a.totalDuration);

  // Sorted array of doughnut chart labels
  const chartLabels = chartData.map(obj => obj._id);

  // Sorted array of doughnut chart durations
  const chartDurations = chartData.map(obj => obj.totalDuration);

  // Sorted array of doughnut chart colors
  const chartColors = chartData.map(obj => obj.color);
  
  // Add tooltips to doughnut chart
  ChartJS.register(ArcElement, Tooltip);

  // Doughnut chart input data
  const data = {
    labels: chartLabels,
    datasets: [
      {
        data: chartDurations,
        backgroundColor: chartColors,
        borderColor: chartColors,
      },
    ],
  };

  // Doughnut chart options
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          // Format each doughnut chart label to display its category name and duration instead of its category id
          label: x => ` ${categoriesWithDuration[x.label].name}: ${formatDurationForDisplay(x.raw)}`,
        }
      }
    },
  }

  return (
    <Doughnut
      data={data}
      options={options}
    />
  );
}

function AnalyticsPane({
  timeEntries,
  categories,
  selectedDate
}) {
  // Get all time entries that started on the selected date
  const filteredTimeEntries = timeEntries.filter(timeEntry => formatDateForKey(timeEntry.start) === selectedDate);

  // Total duration of of all selected time entries
  let totalDuration = 0;

  // Add each selected time entry's duration to the total duration
  filteredTimeEntries.forEach(timeEntry => totalDuration += (timeEntry.end - timeEntry.start));

  // Date object of the selected date
  const selectedDateObj = dateKeyToObj(selectedDate);

  return (
    <div 
      className="SecondaryPane"
    >
      <div className="Statistics">
        <p className="Statistics__DayText">{formatDateForDisplay(selectedDateObj)}</p>
        <Statistic
          value={formatDurationForDisplay(totalDuration)}
          name="Tracked"
        />
        <Statistic
          value={filteredTimeEntries.length}
          name="Activities"
        />
      </div>
      <div className="Statistics__DoughnutContainer">
        <CategoriesDoughnut 
          timeEntries={filteredTimeEntries}
          categories={categories}
        />
      </div>
    </div>
  );
}

function Statistic({
  value,
  name
}) {
  return (
    <div className="Statistic">
      <p className="Statistic__Text Statistic__ValueText">{value}</p>
      <p className="Statistic__Text Statistic__NameText">{name}</p>
    </div>
  );
}

export { AnalyticsPane };