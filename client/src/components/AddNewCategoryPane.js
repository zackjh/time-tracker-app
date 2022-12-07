// Import React Hooks
import { useState } from "react";

// Import icons
import { NotePencil } from "phosphor-react";

function AddNewCategoryPane({
  showStatusMessage,
  refetchData
}) {
  // Object representing form data
  const [form, setForm] = useState({
    name: "",
    color: "#ffffff"
  });

  // Updates one or more key-value pairs in form
  // E.g. To update name: updateForm({ name: "my new name" })
  function updateForm(value) {
    return setForm(prev => {
      return { ...prev, ...value };
    });
  }

  // Fires when the "Add New Category" form is submitted
  async function handleAddNewCategory(e) {
    // Prevent page from reloading
    e.preventDefault();

    // Create a copy of the activity being recorded
    const newCategory = { ...form };

    // POST request to create new category record
    await fetch("http://localhost:5000/categories/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newCategory)
    })
    .catch(err => {
      alert(err);
      return;
    });

    // Display status message
    showStatusMessage("A new category has been added.");

    refetchData();
  }

  return (
    <div className="SecondaryPane">
      <form
        className="AddNewCategoryForm"
        onSubmit={handleAddNewCategory}
      >
        <div className="AddNewCategoryForm__InputRow">
          <NotePencil
            weight="fill"
            size={"1.2rem"}
            className="AddNewCategoryForm__Icon"
          />
          <input
            className="SecondaryPane__InputBubble AddNewCategoryForm__CategoryNameInputBubble"
            type="text"
            placeholder="Category Name"
            value={form.name}
            onChange={e => updateForm({ name: e.target.value })}
            style={{ backgroundColor: "#6d6d6d" }}
          />
          <input
            className="SecondaryPane__ColorSelector AddNewCategoryForm__CategoryColorSelector"
            type="color"
            value={form.color}
            onChange={e => updateForm({ color: e.target.value })}
          />
        </div>
        <button 
          className="SecondaryPane__Button SecondaryPane__Button--successGreen AddNewCategoryForm__AddNewCategoryButton"
          type="submit"
        >
          Save as New Category
        </button>
      </form>
    </div>
  );
}

export { AddNewCategoryPane };