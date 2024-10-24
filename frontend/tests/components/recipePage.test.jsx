import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import RecipePage from "../../src/components/recipePage";

describe("RecipePage Component", () => {
  test("renders the instructions correctly", () => {
    const mockRecipe = {
      title: "Spaghetti Bolognese",
      image: "",
      ingredients: [],
      instructions: "Cook spaghetti and add sauce.",
    };
    const mockSummary = "<p>Summary of the recipe</p>";

    render(
      //simulateS route changes and passes location state easily,
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/recipe",
            state: { recipe: mockRecipe, summary: mockSummary },
          },
        ]}
      >
        <RecipePage />
      </MemoryRouter>
    );

    const instructionElement = screen.getByText(
      /cook spaghetti and add sauce/i
    );

    // truthy checks if the instruction element exists
    expect(instructionElement).toBeTruthy();

    expect(instructionElement.textContent).toBe(
      "Cook spaghetti and add sauce."
    );
  });
});

test("does not render recipe details when no recipe is passed", () => {
  const mockRecipe = {
    title: "",
    image: "",
    ingredients: [],
    instructions: "",
  };
  const mockSummary = "";

  const { container } = render(
    //simulateS route changes and passes location state easily,

    <MemoryRouter
      initialEntries={[
        {
          pathname: "/recipe",
          state: { recipe: mockRecipe, summary: mockSummary },
        },
      ]}
    >
      <RecipePage />
    </MemoryRouter>
  );

  expect(container.querySelector("h4")).toBeNull();
});
