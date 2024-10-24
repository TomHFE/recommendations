import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RecipeProfile from "../../src/pages/Profile/recipe";
import { FavouriteButton } from "../../src/components/FavouriteButton";
import { CommentButton } from "../../src/components/CommentButton";

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
    recipe: {
      comments: ["Great recipe!", "Can't wait to try it!"],
    },
  };

  test("renders recipe title and image", () => {
    renderRecipeProfile(mockRecipeData);

    const titleElement = screen.queryAllByText("Mock Recipe");

    expect(titleElement.length).toBe(1);
  });
});
