import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { FeedPage } from "../../src/pages/Feed/FeedPage";
import { getFilteredRecipes } from "../../src/services/recipes/getFilteredRecipes";
import { useNavigate } from "react-router-dom";

// Mocking the getPosts service
vi.mock("../../src/services/recipes/getFilteredRecipes", () => {
  const getFilteredRecipesMock = vi.fn();
  return { getFilteredRecipes: getFilteredRecipesMock };
});

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

describe("Feed Page", () => {
  beforeEach(() => {
    window.localStorage.removeItem("token");
  });

  test("It displays filtered recipes from the backend", async () => {
    window.localStorage.setItem("token", "testToken");

    const mockFilteredRecipes = [
      { _id: "12345", title: "Test recipe ", summary: "Test summary" },
    ];

    getFilteredRecipes.mockResolvedValue({
      filteredRecipes: mockFilteredRecipes,
      token: "newToken",
    });

    render(<FeedPage />);

    const headerElement = screen.getByText("What recipe do you fancy?");

    // Assert the text content directly using toBe
    expect(headerElement.textContent.trim()).toBe("What recipe do you fancy?");
  });

  test("It navigates to login if no token is present", async () => {
    render(<FeedPage />);
    const navigateMock = useNavigate();
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });
});
