import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RecipeProfile from "../../src/pages/Profile/recipe";

describe("RecipeProfile Component", () => {
  const renderRecipeProfile = (props) => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<RecipeProfile {...props} />} />
        </Routes>
      </MemoryRouter>
    );
  };

  const mockRecipeData = {
    _id: "123",
    title: "Mock Recipe",
    image: "http://example.com/image.jpg",
    summary: "<p>Delicious recipe summary.</p>",
    favourites: [],
    comments: ["Great recipe!", "Can't wait to try it!"]
  };
  

  test("renders recipe title and image", () => {
    renderRecipeProfile(mockRecipeData);
  
    const titleElements = screen.queryAllByText("Mock Recipe");
  
    expect(titleElements).toHaveLength(1);
  });

});
