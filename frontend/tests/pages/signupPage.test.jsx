import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { useNavigate } from "react-router-dom";
import { signup } from "../../src/services/authentication";
import { SignupPage } from "../../src/pages/Signup/SignupPage";

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

// Mocking the signup service
vi.mock("../../src/services/authentication", () => {
  const signupMock = vi.fn();
  return { signup: signupMock };
});

// Reusable function for filling out signup form
async function completeSignupForm() {
  const user = userEvent.setup();

  const emailInputEl = screen.getByLabelText("Email:");
  const passwordInputEl = screen.getByLabelText("Password:");
  const usernameInputEl = screen.getByLabelText("Username:");
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(emailInputEl, "test@email.com");
  await user.type(passwordInputEl, "Password123!");
  await user.type(usernameInputEl, "Someone-12345?");
  await user.click(submitButtonEl);
}

describe("Signup Page", () => {
  beforeEach(() => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.resetAllMocks();
  });

  test("allows a user to signup", async () => {
    render(<SignupPage />);
    await completeSignupForm();
    expect(signup).toHaveBeenCalledWith(
      "test@email.com",
      "Password123!",
      "Someone-12345?",
      ""
    );
  });

  test("navigates to /login on successful signup", async () => {
    render(<SignupPage />);
    const navigateMock = useNavigate();
    await completeSignupForm();
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  test("navigates to /signup on wrong email", async () => {
    signup.mockRejectedValue(new Error("Error signing up"));
    render(<SignupPage />);

    async function failedSignUpForm() {
      const user = userEvent.setup();

      const emailInputEl = screen.getByLabelText("Email:");
      const passwordInputEl = screen.getByLabelText("Password:");
      const usernameInputEl = screen.getByLabelText("Username:");
      const submitButtonEl = screen.getByRole("submit-button");

      await user.type(emailInputEl, "temail.com");
      await user.type(passwordInputEl, "Pass");
      await user.type(usernameInputEl, "Someone-12345?");
      await user.click(submitButtonEl);
    }
    await failedSignUpForm();

    expect(window.alert).toHaveBeenCalledWith("Email is invalid try again");
  });
  test("navigates to /signup on wrong password", async () => {
    signup.mockRejectedValue(new Error("Error signing up"));
    render(<SignupPage />);

    async function failedSignUpForm() {
      const user = userEvent.setup();

      const emailInputEl = screen.getByLabelText("Email:");
      const passwordInputEl = screen.getByLabelText("Password:");
      const usernameInputEl = screen.getByLabelText("Username:");
      const submitButtonEl = screen.getByRole("submit-button");

      await user.type(emailInputEl, "temail@jisjs.com");
      await user.type(passwordInputEl, "Pass");
      await user.type(usernameInputEl, "Someone-12345?");
      await user.click(submitButtonEl);
    }
    await failedSignUpForm();

    expect(window.alert).toHaveBeenCalledWith(
      "Password must:\n - Be min. 8 characters\n - Have a capital letter\n - Have a special character"
    );
  });

  test("test alert sign up successfully ", async () => {
    render(<SignupPage />);
    await completeSignupForm();

    expect(window.alert).toHaveBeenCalledWith("You signed up successfully");
  });

  test("test alert email already exists ", async () => {
    signup.mockRejectedValue(new Error("Email is invalid try again"));
    render(<SignupPage />);
    await completeSignupForm();
    expect(signup).toHaveBeenCalledWith(
      "test@email.com",
      "Password123!",
      "Someone-12345?",
      ""
    );

    expect(window.alert).toHaveBeenCalledWith("Email is invalid try again");
  });
});
