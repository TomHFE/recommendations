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

    render(
      //simulateS route changes and passes location state easily

      <MemoryRouter>
        <Recipe recipe={testRecipe} />
      </MemoryRouter>
    );

    const title = screen.getByRole("heading", { level: 3 });
    expect(title.textContent).toContain("test title");
  });
});
