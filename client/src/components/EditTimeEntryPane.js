// Import React Hooks
import {
  useState,
  useEffect,
  useRef
} from "react";

// Import react-router Hooks
import { useNavigate } from "react-router";

// Import helper functions
import {
  formatDurationForDisplay,
  UTCStringToLocalString,
} from "../helpers.js";

// Import icons
import {
  NotePencil,
  List,
  Play,
  Stop,
  Clock
} from "phosphor-react"

// Load environment variables
const API_URL = process.env.REACT_APP_API_URL;

function EditTimeEntryPane({
  _id,
  categories,
  refetchData,
  showStatusMessage
}) {
  // Set up useNavigate hook
  const navigate = useNavigate();

  // Object representing form data
  const [form, setForm] = useState(null);

  // Ref that stores the type of user request (update or delete)
  const formRef = useRef(null);
  
  // Fetches time entry data from the database
  useEffect(() => {
    async function getTimeEntry() {
      // GET request to retrieve time entry with the selected id
      const response = await fetch(`${API_URL}/time-entries/${_id}`);
      if (!response.ok) {
        alert(`An error occurred: ${response.statusText}`);
        return;
      }

      // Convert response to JSON
      const fetchedTimeEntry = await response.json();

      // Convert start and end date strings to a format that the HTML form <input /> accepts
      const startLocalString = UTCStringToLocalString(fetchedTimeEntry.start);
      const endLocalString = UTCStringToLocalString(fetchedTimeEntry.end);
     
      // Pre-fill form
      setForm({
        ...fetchedTimeEntry,
        start: startLocalString,
        end: endLocalString
      });
    }

    getTimeEntry();

    return;
  }, [_id]);

  // Updates one or more key-value pairs in form
  // E.g. To update name: updateForm({ name: "my new name" })
  function updateForm(value) {
    return setForm(prev => {
      return { ...prev, ...value };
    });
  }

  // Fires when the "Edit Time Entry" form is submitted
  async function handleUpdateTimeEntry(e) {
    // Prevent page from reloading
    e.preventDefault();
    
    // Check the type of request that the user made
    if (formRef.current === "update") {
      // User wants to update time entry

      // Create a copy of the time entry being updated
      // Replace start and end date strings with Date objects
      const updatedTimeEntry = {
        ...form,
        start: new Date(form.start),
        end: new Date(form.end)
      };

      // POST request to update time entry record with specified id
      await fetch(`${API_URL}/time-entries/update/${form._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedTimeEntry)
      })
      .catch(err => {
        alert(err);
        return;
      });

      // Display status message
      showStatusMessage("The time entry has been updated");
    } else if (formRef.current === "delete") {
      // User wants to delete time entry

      // DELETE request to delete time entry record with specified id
      await fetch(`${API_URL}/time-entries/${form._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .catch(err => {
        alert(err);
        return
      });

      // Display status message
      showStatusMessage("The time entry has been deleted.");
    }
   
    // Reset form
    setForm(null);

    // Reset formRef
    formRef.current = null;

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

  // Check if form has been pre-filled
  if (form) {
    // Form has been pre-filled

    // Color of the selected time entry's category
    // Default color is used if the time entry has no category
    const categoryColor = form.categoryId ? categories[form.categoryId].color : "rgba(255, 255, 255, 0.4)"

    // Get separate date and time strings for time entry's start time and end time
    const [startDate, startTime] = form.start.split("T");
    const [endDate, endTime] = form.end.split("T");

    // Date object representing the time entry's start time
    const startDateObj = new Date(form.start);

    // Date object representing the time entry's end time
    const endDateObj = new Date(form.end)

    // Boolean value representing whether the time entry's end time is later than its start time
    const validDuration = endDateObj >= startDateObj;

    return (
      <div className="SecondaryPane">
        <form
          className="EditTimeEntryForm"
          onSubmit={handleUpdateTimeEntry}
        >
          <div className="EditTimeEntryForm__InputRow">
            <NotePencil
              weight="fill"
              size={"1.2rem"}
              className="EditTimeEntryForm__Icon"
            />
            <input 
              className="SecondaryPane__InputBubble EditTimeEntryForm__InputBubble--large"
              type="text"
              placeholder="Activity Name"
              value={form.name}
              onChange={e => updateForm({ name: e.target.value })}
            />
          </div>
          <div className="EditTimeEntryForm__InputRow">
            <List
              weight="fill"
              size={"1.2rem"}
              className="EditTimeEntryForm__Icon"
            />
            <select
              className="SecondaryPane__SelectInput EditTimeEntryForm__CategoryNameSelectInput"
              style={{ color: categoryColor }}
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
          </div>
          <div className="EditTimeEntryForm__InputRow">
            <Play
              weight="fill"
              size={"1.2rem"}
              className="EditTimeEntryForm__Icon"
            />
            <input 
              className="SecondaryPane__InputBubble EditTimeEntryForm__InputBubble--small"
              type="date"
              value={startDate}
              onChange={e => updateForm({ start: `${e.target.value}T${startTime}` })}
              max={endDate}
            />
            <input
              className="SecondaryPane__InputBubble EditTimeEntryForm__InputBubble--small"
              type="time"
              value={startTime}
              onChange={e => updateForm({ start: `${startDate}T${e.target.value}` })}
            />
          </div>


          <div className="EditTimeEntryForm__InputRow">
            <Stop
              weight="fill"
              size={"1.2rem"}
              className="EditTimeEntryForm__Icon"
            />
            <input
              className="SecondaryPane__InputBubble EditTimeEntryForm__InputBubble--small"
              type="date"
              value={endDate}
              onChange={e => updateForm({ end: `${e.target.value}T${endTime}` })}
              min={startDate}
            />
            <input
              className="SecondaryPane__InputBubble EditTimeEntryForm__InputBubble--small"
              type="time"
              value={endTime}
              onChange={e => updateForm({ end: `${endDate}T${e.target.value}` })}
            />
          </div>

          <div className="EditTimeEntryForm__InputRow">
            <Clock
              weight="fill"
              size={"1.2rem"}
              className="EditTimeEntryForm__Icon"
            />
            <p className="EditTimeEntryForm__DurationText">
              {validDuration ? formatDurationForDisplay(endDateObj - startDateObj) : "Invalid Value(s)" }
            </p>
          </div>
          <div className="EditTimeEntryForm__ButtonsRow">
            <button
              className="SecondaryPane__Button SecondaryPane__Button--dangerRed EditTimeEntryForm__Button"
              type="submit"
              onClick={() => formRef.current = "delete"}
            >
              Delete
            </button>
            <button 
              className="SecondaryPane__Button SecondaryPane__Button--successGreen EditTimeEntryForm__Button"
              type="submit"
              disabled={!validDuration}
              onClick={() => formRef.current = "update"}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      
    );
  }
  
}

export { EditTimeEntryPane };