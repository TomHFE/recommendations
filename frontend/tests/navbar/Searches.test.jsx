import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Searches from "../../src/navbar/Searches"; // Adjust the import path as necessary
import { vi } from "vitest";

// Mock component for the user page
const UserPage = () => <div>User Page</div>;

// Mock component for the recipe page
const RecipePage = () => <div>Recipe Page</div>;

describe("Searches Component", () => {
  const renderSearches = (state) => {
    render(
      <MemoryRouter initialEntries={["/searches"]}>
        <Routes>
          <Route path="/searches" element={<Searches />} />
          <Route path="/user_page" element={<UserPage />} />
          <Route path="/recipe_page" element={<RecipePage />} />
        </Routes>
      </MemoryRouter>
    );
    // Manually set the location state after rendering
    window.history.replaceState(state, "", "/searches");
  };

  test("displays recipes and users when provided", () => {
    const state = {
      recipes: [
        {
          id: "1",
          title: "Test Recipe 1",
          image: "http://example.com/image1.jpg",
          summary: "Summary of test recipe 1",
        },
        {
          id: "2",
          title: "Test Recipe 2",
          image: "http://example.com/image2.jpg",
          summary: "Summary of test recipe 2",
        },
      ],
      user: [
        {
          id: "1",
          username: "User1",
          profilePictureURL: "http://example.com/user1.jpg",
          followingData: {
            followers: [],
            following: [],
          },
        },
      ],
    };

    renderSearches(state);

    expect(screen.getByText("Recipes")).toBeTruthy();
    expect(screen.getByText("Users")).toBeTruthy();
  });

  test("displays 'No recipes found' message when no recipes are provided", () => {
    const state = {
      recipes: [],
      user: [],
    };

    renderSearches(state);

    // Check for no recipes message
    expect(screen.getByText("No recipes found")).toBeTruthy();
  });

  test("displays 'No users found' message when no users are provided", () => {
    const state = {
      recipes: [
        {
          id: "1",
          title: "Test Recipe 1",
          image: "http://example.com/image1.jpg",
          summary: "Summary of test recipe 2",
        },
      ],
      user: [],
    };

    renderSearches(state);

    expect(screen.getByText("No users found")).toBeTruthy();
  });
});
