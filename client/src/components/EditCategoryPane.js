// Import React Hooks
import {
  useState,
  useEffect,
  useRef
} from "react";

// Import icons
import { NotePencil } from "phosphor-react";

function EditCategoryPane({
  _id,
  showStatusMessage,
  refetchData
}) {
  // Object representing form data
  const [form, setForm] = useState({
    name: "",
    color: ""
  });

  // Ref that stores the type of user request (update or delete)
  const formRef = useRef(null);

  // Fetches category data from the database
  useEffect(() => {
    async function getCategory() {
      // GET request to retrieve the category with the selected id
      const response = await fetch(`http://localhost:5000/categories/${_id}`);
      if (!response.ok) {
        alert(`An error occurred: ${response.statusText}`);
        return;
      }

      // Convert response to JSON
      const fetchedCategory = await response.json();

      // Pre-fill form
      setForm(fetchedCategory);
    }

    getCategory();

    return;
  }, [_id]);

  // Updates one or more key-value pairs in form
  // E.g. To update name: updateForm({ name: "my new name" })
  function updateForm(value) {
    return setForm(prev => {
      return { ...prev, ...value };
    });
  }

  // Fires when the "Edit Category" form is submitted
  async function handleUpdateCategory(e) {
    // Prevent page from reloading
    e.preventDefault();

    // Check the type of request that the user made
    if (formRef.current === "update") {
      // User wants to update category

      // Create a copy of the category being updated
      const updatedCategory = { ...form };

      // POST request to update category record with specified category id
      await fetch(`http://localhost:5000/categories/update/${form._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedCategory)
      })
      .catch(err => {
        alert(err);
        return;
      });

      // Display status message
      showStatusMessage("The category has been updated.");
    } else if (formRef.current === "delete") {
      // User wants to delete category

      // DELETE request to delete category record with specified category id
      await fetch(`http://localhost:5000/categories/${form._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .catch(err => {
        alert(err);
        return
      })

      // POST request to update time entries that have the deleted category 
      await fetch(`http://localhost:5000/time-entries/categoryDeleted/${form._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .catch(err => {
        alert(err);
        return;
      })

      // Display status message
      showStatusMessage("The category has been deleted.");
    }
    
    refetchData();
  }

  return (
    <div className="SecondaryPane">
      <form
        className="EditCategoryForm"
        onSubmit={handleUpdateCategory}
      >
        <div className="EditCategoryForm__InputRow">
          <NotePencil
            weight="fill"
            size={"1.2rem"}
            className="AddNewCategoryForm__Icon"
          />
          <input
            className="SecondaryPane__InputBubble EditCategoryForm__CategoryNameInputBubble"
            type="text"
            placeholder="Category Name"
            value={form.name}
            onChange={e => updateForm({ name: e.target.value })}
          />
          <input
            className="SecondaryPane__ColorSelector EditCategoryForm__CategoryColorSelector"
            type="color"
            value={form.color}
            onChange={e => updateForm({ color: e.target.value })}
          />
        </div>
        <div className="EditCategoryForm__ButtonsRow">
          <button
            className="SecondaryPane__Button SecondaryPane__Button--dangerRed EditCategoryForm__Button"
            type="submit"
            onClick={() => formRef.current = "delete"}
          >
            Delete
          </button>
          <button
            className="SecondaryPane__Button SecondaryPane__Button--successGreen EditCategoryForm__Button"
            type="submit"
            onClick={() => formRef.current = "update"}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export { EditCategoryPane };