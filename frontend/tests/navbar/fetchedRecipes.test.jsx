import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import FetchedRecipes from "../../src/navbar/fetchedRecipes"; // Adjust the import path as necessary

// Mock component for the login page
const LoginPage = () => <div>Login Page</div>;

// Mocked response for the recipe API
const mockRecipeData = {
  title: "Mock Recipe",
  image: "http://example.com/image.jpg",
  extendedIngredients: [
    {
      id: 1,
      nameClean: "Ingredient 1",
      measures: {
        metric: {
          amount: 100,
          unitLong: "grams",
        },
      },
    },
    {
      id: 2,
      nameClean: "Ingredient 2",
      measures: {
        metric: {
          amount: 200,
          unitLong: "milliliters",
        },
      },
    },
  ],
  summary: "summary",
  instructions: "instructions",
};

describe("Fetched recipes Component", () => {
  const renderFetchedRecipes = (state) => {
    render(
      <MemoryRouter initialEntries={["/fetched_recipes"]}>
        <Routes>
          <Route path="/fetched_recipes" element={<FetchedRecipes />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    window.history.replaceState(state, "", "/fetched_recipes");
  };

  beforeEach(() => {
    localStorage.clear();
  });

  test("renders loading state when recipe is not available", () => {
    const state = {
      props: {},
      allergies: [],
    };

    renderFetchedRecipes(state);

    expect(screen.getByText("Loading recipe...")).toBeTruthy();
  });

  test("renders 'Loading recipe...' if fetchData is still in progress", () => {
    const state = {
      props: { id: "123" },
      allergies: [],
    };

    renderFetchedRecipes(state);

    expect(screen.getByText("Loading recipe...")).toBeTruthy();
  });
});
