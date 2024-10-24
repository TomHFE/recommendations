import { render, screen } from "@testing-library/react";
import UsersFollowingPage from "../../src/components/follow_component/handleFollowing";
import FollowCard from "../../src/components/follow_component/FollowCard";
import { getUserFollowingList } from "../../src/services/getUserFollowing";
import useNavigate from "react-router-dom";
import { MemoryRouter } from "react-router-dom";
import getUserById from "../../src/services/getUserById";
import { vi } from "vitest";

vi.mock("../../src/services/getUserFollowing", () => ({
  getUserFollowingList: () =>
    Promise.resolve({
      token: "mockToken",
      user: "mockUserId",
      message: [
        {
          _id: "1",
          username: "Avnita",
          profilePictureURL: "",
          followingData: { followers: [], following: [] },
        },
        {
          _id: "2",
          username: "jane_doe",
          profilePictureURL: "https://example.com/jane.jpg",
          followingData: { followers: [], following: [] },
        },
      ],
    }),
}));

vi.mock("../../src/services/getUserById", () => ({
  getUserById: () =>
    Promise.resolve({
      token: "mockToken",
      user: "mockUserId",
      message: [],
    }),
}));

describe("UsersFollowingPage component", () => {
  beforeEach(() => {
    localStorage.setItem("token", "mockToken");
  });

  afterEach(() => {
    localStorage.removeItem("token");
    vi.clearAllMocks();
  });

  test("displays message when no following users are found", async () => {
    render(
      <MemoryRouter>
        <UsersFollowingPage />
      </MemoryRouter>
    );

    const messageElement = await screen.findByText("No following users found.");
    expect(messageElement).toBeTruthy();
  });
});
