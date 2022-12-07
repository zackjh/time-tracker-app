// Import React Hooks
import {
  useState,
  useEffect
} from "react";

// Import icons
import { Gear } from "phosphor-react";

function CategoriesListPane({
  handleAddNewCategoryButtonClick,
  handleEditCategoryButtonClick
}) {
  // Array of objects, with each object representing a category's data
  const [categories, setCategories] = useState([]);

  // Fetches category data from the database
  useEffect(() => {
    async function getCategories() {
      // GET request to retrieve categories
      const response = await fetch(`http://localhost:5000/categories`);
      if (!response.ok) {
        alert(`An error occurred: ${response.statusText}`);
        return;
      }

      // Convert response to JSON
      const fetchedCategories = await response.json();

      setCategories(fetchedCategories);
    }
    
    getCategories();

    return;
  }, []);

  // Sort categories by alphabetical order
  const sortedCategories = categories.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    return 0;
  });

  // Array of <li /> JSX nodes, with each node representing a category
  let rows = [];

  // For each category
  sortedCategories.forEach(category => {
    // Add <li /> JSX node to rows
    rows.push(
      <li
        className="CategoryRow"
        key={category._id}
      >
        <span className="CategoryRow__ColorAndNameSpan">
          <p className="CategoryRow__ColorCircle" style={{ backgroundColor: category.color }}></p>
          <p>{category.name}</p>
        </span>
        <Gear
          weight="fill"
          size="1.5rem"
          onClick={e => handleEditCategoryButtonClick(category._id)}
          className="CategoryRow__EditButton"
        />
      </li>
    )
  });

  return (
    <div className="SecondaryPane">
      <ul className="CategoryList">
        {rows}
      </ul>
      <button
        className="SecondaryPane__Button CategoryList__AddNewCategoryButton"
        type="button"
        onClick={handleAddNewCategoryButtonClick}
      >
        Add New Category
      </button>
    </div>
    
  );
}

export { CategoriesListPane };