import { render, screen, waitFor } from "@testing-library/react";
import { describe, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Profile } from "../../src/pages/Profile/profile";
import { getRecipesWithUserDetails } from "../../src/services/recipes/getRecipesWithUserDetails";
import { getUserDetails } from "../../src/services/getUserDetails";
import "@testing-library/jest-dom";

vi.mock("../../src/services/recipes/getRecipesWithUserDetails");
vi.mock("../../src/services/getUserDetails");

describe("Profile Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("redirects to /login if token is missing", () => {
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  test("renders Loading when profile or recipes are not available", () => {
    localStorage.setItem("token", "mockToken");
    getRecipesWithUserDetails.mockResolvedValue({ recipes: [], token: "newToken" });
    getUserDetails.mockResolvedValue({ token: "newToken", message: [] });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("fetches and displays user profile and recipes", async () => {
    localStorage.setItem("token", "mockToken");

    const mockRecipes = [
      { _id: "recipe1", title: "Recipe 1" },
      { _id: "recipe2", title: "Recipe 2" },
    ];
    const mockProfile = [{ username: "JohnDoe", favourites: ["recipe1"], profilePictureURL: "/profile.jpg" }];

    getRecipesWithUserDetails.mockResolvedValue({ recipes: mockRecipes, token: "newToken" });
    getUserDetails.mockResolvedValue({ token: "newToken", message: mockProfile });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("JohnDoe")).toBeInTheDocument();
      expect(screen.getByText("Recipe 1")).toBeInTheDocument();
      expect(screen.queryByText("Recipe 2")).not.toBeInTheDocument(); // Since it is not in favourites
    });
  });
});
