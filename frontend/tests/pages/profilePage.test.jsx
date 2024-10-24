import { render, screen, fireEvent } from "@testing-library/react";
import { describe, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Profile } from "../../src/pages/Profile/profile";
import { getRecipesWithUserDetails } from "../../src/services/recipes/getRecipesWithUserDetails";
import { getUserDetails } from "../../src/services/getUserDetails";
import "@testing-library/jest-dom";

vi.mock("../../src/services/recipes/getRecipesWithUserDetails");
vi.mock("../../src/services/getUserDetails");
const UserFollowingPage = () => <div>User Following Page</div>;
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
    getRecipesWithUserDetails.mockResolvedValue({
      recipes: [],
      token: "newToken",
    });
    getUserDetails.mockResolvedValue({ token: "newToken", message: [] });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
