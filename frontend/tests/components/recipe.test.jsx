import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Recipe from "../../src/components/Recipe";

describe("Recipe", () => {
  test("displays the recipe", () => {
    const testRecipe = {
      _id: "123",
      title: "test title",
      summary: "test summary",
      image: "test-image.jpg",
      favourites: [],
      comments: [],
    };

    // Wrap the component with MemoryRouter
    render(
      <MemoryRouter>
        <Recipe recipe={testRecipe} />
      </MemoryRouter>
    );

    // Check if the title is displayed as an <h3> heading
    const title = screen.getByRole("heading", { level: 3 });
    expect(title.textContent).toContain("test title");
  });
});
