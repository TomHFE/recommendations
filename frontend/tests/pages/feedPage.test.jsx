import { render, screen, waitFor } from "@testing-library/react";
import { describe, vi, beforeEach } from "vitest";
import { FeedPage } from "../../src/pages/Feed/FeedPage";
import { getRecipesWithUserDetails } from "../../src/services/recipes/getRecipesWithUserDetails";
import '@testing-library/jest-dom'; 
import { getFilteredRecipes } from "../../src/services/recipes/getFilteredRecipes";
import { useNavigate } from "react-router-dom";

vi.mock("../../src/services/recipes/getFilteredRecipes", () => {
  const getFilteredRecipesMock = vi.fn();
  return { getFilteredRecipes: getFilteredRecipesMock };
});

vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; 
  return { useNavigate: useNavigateMock };
});


vi.mock("../../src/services/recipes/getRecipesWithUserDetails", () => ({
  getRecipesWithUserDetails: vi.fn(),
}));

vi.mock("../../components/searchFilter", () => ({
  SearchFilter: ({ onSearch }) => (
    <button onClick={() => onSearch([{ _id: "1", title: "Test Recipe 1", summary: "Test summary 1" }])}>
      Search
    </button>
  ),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));


describe("FeedPage Component", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockNavigate.mockReset();
  });

  test("navigates to /login if token is missing", () => {
    render(<FeedPage />);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("displays 'Sorry, we could not find you any recipe' when no recipes are returned", async () => {
    window.localStorage.setItem("token", "testToken");

    getRecipesWithUserDetails.mockResolvedValue({
      recipes: [],
      token: "newToken",
    });
    render(<FeedPage />);


    await waitFor(() => {
      expect(screen.getByText("Sorry, we could not find you any recipe")).toBeInTheDocument();
    });

  });

  test("navigates to /login on API error", async () => {
    window.localStorage.setItem("token", "testToken");
    getRecipesWithUserDetails.mockRejectedValue(new Error("API Error"));
    render(<FeedPage />);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
