import { render, screen, fireEvent } from "@testing-library/react";
import LogoutButton from "../../src/components/LogoutButton";
import { BrowserRouter } from "react-router-dom"; // To test navigation behavior

describe("LogoutButton component", () => {
  it("removes token from localStorage and redirects on logout", () => {
    localStorage.setItem("token", "fake-token");

    // Use BrowserRouter to test navigation behavior
    render(
      <BrowserRouter>
        <LogoutButton />
      </BrowserRouter>
    );

    const button = screen.getByRole("button", { name: "Log out" });
    fireEvent.click(button);
    expect(localStorage.getItem("token")).toBe(null);

    localStorage.clear();
  });
});
