import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Recipe from "../../src/components/Recipe";

describe("Recipe Component", () => {
  const mockRecipe = {
    _id: "1",
    title: "Test Recipe",
    image: "https://example.com/image.jpg",
    summary: "Test summary",
    favourites: ["user1", "user2"],
    comments: ["Nice recipe", "Loved it!"],
  };

  test("renders recipe title and image", () => {
    render(
      //simulateS route changes and passes location state easily,

      <MemoryRouter>
        <Recipe recipe={mockRecipe} />
      </MemoryRouter>
    );

    const titleElement = screen.getByText("Test Recipe");
    expect(titleElement).toBeTruthy();

    const imageElement = screen.getByAltText("Recipe visual");
    expect(imageElement).toBeTruthy();
    expect(imageElement.src).toContain("https://example.com/image.jpg");
  });

  test("renders sanitized summary", () => {
    render(
      //simulateS route changes and passes location state easily,

      <MemoryRouter>
        <Recipe recipe={mockRecipe} />
      </MemoryRouter>
    );

    const summaryElement = screen.getByText("Test summary");
    expect(summaryElement).toBeTruthy();

    // Ensure the script tag is not present
    expect(screen.queryByText(/alert/i)).toBeNull();
  });

  test("does not render image when no image URL is provided", () => {
    const mockRecipeWithoutImage = { ...mockRecipe, image: "" };

    render(
      //simulateS route changes and passes location state easily,
      <MemoryRouter>
        <Recipe recipe={mockRecipeWithoutImage} />
      </MemoryRouter>
    );

    const imageElement = screen.queryByAltText("Recipe visual");
    expect(imageElement).toBeNull();
  });
});
