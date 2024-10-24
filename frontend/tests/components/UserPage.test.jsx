import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import UserPage from "../../src/components/UserPage";
import { vi } from "vitest";

const mockUser = {
  username: "testUser",
  profilePictureURL: "http://example.com/profile.jpg",
  favourites: [
    {
      _id: "1",
      title: "Test Recipe",
      image: "http://example.com/recipe.jpg",
      summary: "<p>Delicious!</p>",
    },
  ],
};

// Mocking localStorage for testing
const localStorageMock = (() => {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value;
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("UserPage", () => {
  beforeEach(() => {
    // Clear the localStorage before each test
    localStorage.clear();
  });

  test("renders user data correctly", () => {
    // Setting a token in localStorage for the test
    localStorage.setItem("token", "testToken");

    render(
      <MemoryRouter
        initialEntries={[{ pathname: "/user", state: { user: mockUser } }]}
      >
        <Routes>
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/testUser/i)).toBeTruthy();
  });

  test("shows no favourites found message", async () => {
    const userWithoutFavourites = {
      ...mockUser,
      favourites: [],
    };

    localStorage.setItem("token", "testToken");

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: "/user", state: { user: userWithoutFavourites } },
        ]}
      >
        <Routes>
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/No favourites found/i)).toBeTruthy();
    });
  });
});
