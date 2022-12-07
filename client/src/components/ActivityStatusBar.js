// Import React Hooks
import { 
  useState,
  useRef
} from "react";

// Import react-router Hooks
import { useNavigate } from "react-router";

// Import helper functions
import {
  formatTimeForDisplay,
  formatDurationForDisplay
} from "../helpers.js";

// Import icons
import {
  Play,
  Stop,
  List,
} from "phosphor-react"

function ActivityStatusBar({
  categories,
  refetchData,
  handleDisplayCategoriesButtonClick
}) {
  // Set up useNavigate hook
  const navigate = useNavigate();

  // Object representing form data
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    start: null,
    end: null
  });

  // Updates one or more key-value pairs in form
  // E.g. To update name: updateForm({ name: "my new name" })
  function updateForm(value) {
    return setForm(prev => {
      return { ...prev, ...value };
    });
  }

  // Ref that stores the inverval ID of the activity timer
  const intervalRef = useRef(null);

  // Fires when activity recording starts
  function handleActivityStart(e) {
    // Prevent page from reloading
    e.preventDefault();

    // Update the properties of the activity being recorded 
    const currentDate = new Date();
    updateForm({ start: currentDate, end: currentDate });
    
    // Start a timer and store its interval ID in intervalRef
    intervalRef.current = setInterval(() => {      
      // Every 10ms, update the end time of the activity being recorded with the current Date
      updateForm({ end: new Date() });
    }, 10);
  }

  // Fires when activity recording stops
  async function handleActivityStop(e) {
    // Prevent page from reloading
    e.preventDefault();

    // Stop the timer
    clearInterval(intervalRef.current);

    // Create a copy of the activity being recorded
    const newTimeEntry = { ...form };

    // POST request to create new time entry record
    await fetch("http://localhost:5000/time-entries/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTimeEntry)
    })
    .catch(err => {
      alert(err);
      return;
    });

    // Reset form
    setForm({
      name: "",
      categoryId: "",
      start: null,
      end: null
    });

    // Reset intervalRef
    intervalRef.current = null;

    // Redirect to home page
    navigate("/");

    refetchData();
  }

  // Array of <option /> JSX nodes, each representing a category
  let categoryDropdownOptions = []
  
  // For each category
  for (const _id in categories) {
    // Push <option /> JSX node into categoryDropdownOptions
    categoryDropdownOptions.push(
      <option
        value={_id}
        key={_id}
      >
        {categories[_id].name}
      </option>
    );
  }

  // Sort categoryDropdownOptions by alphabetical order
  categoryDropdownOptions.sort((a, b) => {
    if (a.props.children > b.props.children) {
      return 1;
    } else if (a.props.children < b.props.children) {
      return -1;
    }
    return 0;
  })

  // Color of the category selected in the activity status bar
  let currentCategoryColor;

  // If no category is selected
  if (!form.categoryId) {
    // Set default color
    currentCategoryColor = "rgba(255, 255, 255, 0.4)";
  } else {
    // Retrieve color of the selected category 
    currentCategoryColor = categories[form.categoryId].color;
  }

  // Check if activity timer is running
  if (intervalRef.current) {
    // Activity timer is running

    // Formatted version of the activity start and end time
    const startEnd = `${formatTimeForDisplay(form.start)} - ${formatTimeForDisplay(form.end)}`;

    // Formattted version of the activity duration
    const duration = formatDurationForDisplay(form.end - form.start);

    return (
      <form
        className="ActivityStatusBar ActivityStatusBar--activityRunning"
        onSubmit={handleActivityStop}
      >
        <span className="ActivityStatusBar__NameAndCategorySpan">
          <input
            className="ActivityStatusBar__TextInput ActivityStatusBar__ActivityNameTextInput"
            type="text"
            placeholder="I'm working on..."
            value={form.name}
            onChange={e => updateForm({ name: e.target.value })}
          />
          <select
            className="ActivityStatusBar__SelectInput ActivityStatusBar__CategoryNameSelectInput ActivityStatusBar__CategoryNameSelectInput--activityRunning"
            style={{ color: currentCategoryColor }}
            value={form.categoryId}
            onChange={e => updateForm({ categoryId: e.target.value })}
          >
            <option
              value=""
              disabled
            >
              Choose a category
            </option>
            {categoryDropdownOptions}
          </select>
        </span>
        <span className="ActivityStatusBar__TimeAndDurationSpan">
          <p>{startEnd}</p>
          <p>{duration}</p>
        </span>
        <List
          weight="fill"
          size={"30%"}
          onClick={handleDisplayCategoriesButtonClick}
          className="ActivityStatusBar__CategoryButton"
        />
        <button
          className="ActivityStatusBar__StatusButton ActivityStatusBar__StopActivityStatusButton"
          type="submit"
        >
          <Stop
            weight="fill"
            size={"1rem"}
          />
        </button>
      </form>
    );
  } else {
    // Activity timer is not running
    return (
      <form 
        className="ActivityStatusBar ActivityStatusBar--noActivity"
        onSubmit={handleActivityStart}
      >
        <input
          className="ActivityStatusBar__InputBubble ActivityStatusBar__ActivityNameInputBubble"
          type="text" 
          placeholder="I'm working on..."
          value={form.name}
          onChange={e => updateForm({ name: e.target.value })}
        />
        <select
          className="ActivityStatusBar__SelectInput ActivityStatusBar__CategoryNameSelectInput ActivityStatusBar__CategoryNameSelectInput--noActivity"
          style={{ color: currentCategoryColor }}
          value={form.categoryId}
          onChange={e => updateForm({ categoryId: e.target.value })}
        >
          <option
            value=""
            disabled
          >
            Choose a category
          </option>
          {categoryDropdownOptions}
        </select>
        <List
          weight="fill"
          size={"30%"}
          onClick={handleDisplayCategoriesButtonClick}
          className="ActivityStatusBar__CategoryButton"
        />
        <button 
          className="ActivityStatusBar__StatusButton ActivityStatusBar__StartActivityStatusButton"
          type="submit"
        >
          <Play 
            weight="fill"
            size={"1rem"}
          />
        </button>
      </form>
    );
  }
}

export { ActivityStatusBar };