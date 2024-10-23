import { render, screen } from "@testing-library/react";
import FollowCard from "../../src/components/follow_component/FollowCard";

describe("FollowCard component", () => {
  // Mock data for testing
  const mockFollow = {
    username: "Avnita",
    profilePictureURL: "",
    followingData: {
      followers: ["follower1", "follower2"],
      following: ["following1", "following2", "following3"],
    },
  };

  test("renders username", () => {
    render(<FollowCard props={mockFollow} />);
    const usernameElement = screen.getByText("Avnita");
    expect(usernameElement.textContent).toBe("Avnita");
  });

  test("renders the number of followers", () => {
    render(<FollowCard props={mockFollow} />);
    const followersCountElement = screen.getByText("2");
    expect(followersCountElement.textContent).toBe("2");
  });

  test("renders the number of following", () => {
    render(<FollowCard props={mockFollow} />);
    const followingCountElement = screen.getByText("3");
    expect(followingCountElement.textContent).toBe("3");
  });

  test("renders the 'followers' and 'following' headings", () => {
    render(<FollowCard props={mockFollow} />);

    const followersHeading = screen.getByText(/followers/i);
    const followingHeading = screen.getByText(/following/i);

    expect(followersHeading.textContent).toBe("followers");
    expect(followingHeading.textContent).toBe("following");
  });
});
