// Import React
import React from "react";

// Import React Hooks
import {
  useState,
  useEffect
} from "react";
 
// Import components
import { ActivityStatusBar } from "./components/ActivityStatusBar";
import { AnalyticsPane } from "./components/AnalyticsPane";
import { TimeEntriesPane } from "./components/TimeEntriesPane";
import { EditTimeEntryPane } from "./components/EditTimeEntryPane";
import { StatusMessagePane } from "./components/StatusMessagePane";
import { CategoriesListPane } from "./components/CategoriesListPane";
import { AddNewCategoryPane } from "./components/AddNewCategoryPane";
import { EditCategoryPane } from "./components/EditCategoryPane";

// Import helper functions
import { formatDateForKey } from "./helpers";

// Import stylesheet
import "./App.css";

function App() {
  // Unix timestamp of when data was last fetched from the server
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  // Array with each object representing a time entry's data
  const [timeEntries, setTimeEntries] = useState([]);

  // Object which maps category ids to category data
  const [categories, setCategories] = useState({});

  // JSX of the component that is currently displayed in the secondary pane
  const [secondaryPane, setSecondaryPane] = useState(null);

  // Key of the currently selected time entry header
  const [selectedTimeEntryHeader, setSelectedTimeEntryHeader] = useState(formatDateForKey(new Date()));

  // Key of the currently selected time entry
  const [selectedTimeEntry, setSelectedTimeEntry] = useState(null);

  // Fetches time entry data from the database
  useEffect(() => {
    async function getTimeEntries() {
      // GET request to retrieve time entries
      const response = await fetch("http://localhost:5000/time-entries");
      if (!response.ok) {
        alert(`An error occurred: ${response.statusText}`);
        return;
      }
  
      // Convert response to JSON
      const fetchedTimeEntries = await response.json();
  
      // Change start and end from strings to Date objects
      const processedTimeEntries = fetchedTimeEntries.map(x => {
        return {
          ...x,
          start: new Date(x.start),
          end: new Date(x.end)
        };
      });  
  
      setTimeEntries(processedTimeEntries);
    }

    getTimeEntries();

    return;
  }, [lastUpdated]);

  // Fetches category data from the database
  useEffect(() => {
    async function getCategories() {
      // GET request to retrieve categories
      const response = await fetch("http://localhost:5000/categories");
      if (!response.ok) {
        alert(`An error occurred: ${response.statusText}`);
        return;
      }
  
      // Convert response to JSON
      const fetchedCategories = await response.json();

      // Create an object which maps category ids to category data
      let processedCategories = {};
      fetchedCategories.forEach(category => {
        processedCategories[category._id] = {
          name: category.name,
          color: category.color
        }
      });
      
      setCategories(processedCategories);
    }

    getCategories();

    return;
  }, [lastUpdated]);

  // Causes effects to re-synchronise
  function refetchData() {
    // Set lastUpdated to the current Unix timestamp
    setLastUpdated(Date.now());
  }

  // Displays a status message in the secondary pane
  function showStatusMessage(message) {
    // De-select any selected time entry
    setSelectedTimeEntry(null);

    // Update JSX in secondaryPane
    setSecondaryPane(<StatusMessagePane message={message} />);
  }

  // Fires when "Display Categories" button is clicked
  function handleDisplayCategoriesButtonClick() {
    // De-select any selected time entry header
    setSelectedTimeEntryHeader(null);

    // De-select any selected time entry
    setSelectedTimeEntry(null);

    // Update JSX in secondaryPane
    setSecondaryPane(
      <CategoriesListPane
        handleAddNewCategoryButtonClick={handleAddNewCategoryButtonClick}
        handleEditCategoryButtonClick={handleEditCategoryButtonClick}
      />
    );
  }

  // Fires when "Add New Category" button is clicked
  function handleAddNewCategoryButtonClick() {
    // Update JSX in secondaryPane
    setSecondaryPane(
      <AddNewCategoryPane
        showStatusMessage={showStatusMessage}
        refetchData={refetchData}
      />
    );
  }

  // Fires when "Edit Category" button is clicked
  function handleEditCategoryButtonClick(_id) {
    // Update JSX in secondaryPane
    setSecondaryPane(
      <EditCategoryPane
        _id={_id}
        showStatusMessage={showStatusMessage}
        refetchData={refetchData}
      />
    );
  }

  // Fires when a time entry header is clicked
  function handleTimeEntryHeaderClick(date) {
    // Select the time entry header that was clicked
    setSelectedTimeEntryHeader(date);

    // De-select any selected time entry
    setSelectedTimeEntry(null);

    // Update JSX in secondaryPane
    setSecondaryPane(
      <AnalyticsPane
        timeEntries={timeEntries}
        categories={categories}
        selectedDate={date}
      />
    );
  }

  // Fires whne a time entry is clicked
  function handleTimeEntryClick(_id) {
    // De-select any selected time entry header
    setSelectedTimeEntryHeader(null);

    // Select the time entry that was clicked
    setSelectedTimeEntry(_id);

    // Update JSX in secondaryPane
    setSecondaryPane(
      <EditTimeEntryPane
        _id={_id}
        categories={categories}
        refetchData={refetchData}
        showStatusMessage={showStatusMessage}
      />
    );
  }

  // JSX of the default secondary pane that renders when the app first starts
  const defaultSecondaryPane =
    <AnalyticsPane
      timeEntries={timeEntries}
      categories={categories}
      selectedDate={formatDateForKey(new Date())}
    />;

  return (
    <div id="App">
      <ActivityStatusBar
        categories={categories}
        refetchData={refetchData}
        handleDisplayCategoriesButtonClick={handleDisplayCategoriesButtonClick}
      />
      <div className="Body">
        <TimeEntriesPane 
          timeEntries={timeEntries}
          categories={categories}
          handleTimeEntryHeaderClick={handleTimeEntryHeaderClick}
          handleTimeEntryClick={handleTimeEntryClick}
          selectedTimeEntryHeader={selectedTimeEntryHeader}
          selectedTimeEntry={selectedTimeEntry}
        />
        { secondaryPane
          ? secondaryPane
          : defaultSecondaryPane
        }
      </div>
    </div>
  );
}

export default App;