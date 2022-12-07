// Import helper functions
import {
  formatTimeForDisplay,
  formatDateForDisplay,
  formatDateForKey,
  formatDurationForDisplay
} from "../helpers.js";

function TimeEntryHeader({
  date,
  isSelected,
  handleTimeEntryHeaderClick
}) {
  return (
    <div 
      className={isSelected ? "TimeEntryHeader TimeEntryHeader--selected" : "TimeEntryHeader"}
      onClick={e => {
        handleTimeEntryHeaderClick(formatDateForKey(date));
      }}
    >
      {formatDateForDisplay(date)}
    </div>
  );
}

function TimeEntry({
  _id,
  name,
  categoryName,
  categoryColor,
  start,
  end,
  isSelected,
  handleTimeEntryClick,
}) {
  // String of time entry duration in the format "0:09:05"
  const duration = formatDurationForDisplay(end - start);

  // String of time entry start and end times in the format "9.01PM - 11.23PM"
  const startToEnd = `${formatTimeForDisplay(start)} - ${formatTimeForDisplay(end)}`;

  return (
    <div 
      className={isSelected ? "TimeEntry TimeEntry--selected" : "TimeEntry"}
      onClick={e => {
        handleTimeEntryClick(_id);
      }}
    >
      <span className="TimeEntry__NameAndCategorySpan">
        <p
          className="TimeEntry__NameAndCategoryText"
          style={{ color: name ? "#ffffff" : "rgba(255, 255, 255, 0.4)" }}
        >
          {name ? name : "No Activity Name"}
        </p>
        <p 
          className="TimeEntry__NameAndCategoryText"
          style={{ color: categoryColor }}
        >
          {categoryName ? `• ${categoryName}` : "• No Category"}
        </p>
      </span>
      <span className="TimeEntry__TimeAndDurationSpan">
        <p>{duration}</p>
        <p className="TimeEntry__TimeText">{startToEnd}</p>
      </span>
    </div>
  );
}

function TimeEntriesPane({
  timeEntries,
  categories,
  handleTimeEntryHeaderClick,
  handleTimeEntryClick,
  selectedTimeEntryHeader,
  selectedTimeEntry
}) {
  // Sort time entries by chronological order
  const sortedTimeEntries = timeEntries.sort((a, b) => b.start - a.start);

  // Array of <TimeEntryHeader /> and <TimeEntry /> JSX nodes
  let rows = [];

  // Array of date strings, each representing a date that already has a time entry header
  let validDates = [];

  // For each time entry
  sortedTimeEntries.forEach(timeEntry => {
    // Date object of time entry's start time
    const startDate = timeEntry.start;

    // Date string in the format "Wednesday, 30 Nov"
    const dateForDisplay = formatDateForDisplay(startDate);

    // Check if it is the first time encountering this time entry's date
    if (!validDates.includes(dateForDisplay)) {
      // A new date is encountered

      // Add date to validDates
      validDates.push(dateForDisplay);

      // Push <TimeEntryHeader /> JSX node into rows
      rows.push(
        <TimeEntryHeader
          date={startDate}
          isSelected={formatDateForKey(startDate) === selectedTimeEntryHeader}
          handleTimeEntryHeaderClick={handleTimeEntryHeaderClick}
          key={formatDateForKey(startDate)}
        />
      );
    }

    // Time entry's category name
    let categoryName;

    // Time entry's category color
    let categoryColor;

    // Check if time entry's category is valid
    if (categories[timeEntry.categoryId]) {
      // Time entry's category is valid
      
      // Retrieve corresponding category name
      categoryName = categories[timeEntry.categoryId].name;

      // Retrieve corresponding category color 
      categoryColor = categories[timeEntry.categoryId].color;
    } else {
      // Time entry's category is invalid

      // Use default values
      categoryName = "";
      categoryColor = "rgba(255, 255, 255, 0.4)"
    }

    // Push <TimeEntry /> JSX node into rows
    rows.push(
      <TimeEntry
        _id={timeEntry._id}
        name={timeEntry.name}
        categoryName={categoryName}
        categoryColor={categoryColor}
        start={timeEntry.start}
        end={timeEntry.end}
        isSelected={timeEntry._id === selectedTimeEntry}
        handleTimeEntryClick={handleTimeEntryClick}
        key={timeEntry._id}
      />
    );
  });

  return (
    <div className="PrimaryPane TimeEntriesList">
      {rows}
    </div>
  );  
}

export { TimeEntriesPane };