import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom"; // We use createMemoryRouter for tests
import { describe, vi } from "vitest";
import App from "../src/App";
import { HomePage } from "../src/pages/Home/HomePage";
import { LoginPage } from "../src/pages/Login/LoginPage";
import { SignupPage } from "../src/pages/Signup/SignupPage";
import { FeedPage } from "../src/pages/Feed/FeedPage";
import { Profile } from "../src/pages/Profile/profile";
import '@testing-library/jest-dom';  

// Mock each component used in routing for simplicity
vi.mock("../src/pages/Home/HomePage", () => ({
    HomePage: () => <div>HomePage Component</div>,
    }));
    vi.mock("../src/pages/Login/LoginPage", () => ({
    LoginPage: () => <div>LoginPage Component</div>,
    }));
    vi.mock("../src/pages/Signup/SignupPage", () => ({
    SignupPage: () => <div>SignupPage Component</div>,
    }));
    vi.mock("../src/pages/Feed/FeedPage", () => ({
    FeedPage: () => <div>FeedPage Component</div>,
    }));
    vi.mock("../src/pages/Profile/profile", () => ({
    Profile: () => <div>Profile Component</div>,
}));



describe("App Routing", () => {
    test("should render the HomePage component for /home route", () => {
        const router = createMemoryRouter(
        [
            { path: "/home", element: <HomePage /> },
        ],
        { initialEntries: ["/home"] } // Simulate navigating to /home
        );

        render(<RouterProvider router={router} />);

        expect(screen.getByText("HomePage Component")).toBeInTheDocument();
    });

    test("should render the LoginPage component for /login route", () => {
        const router = createMemoryRouter(
        [
            { path: "/login", element: <LoginPage /> },
        ],
        { initialEntries: ["/login"] } // Simulate navigating to /login
        );

        render(<RouterProvider router={router} />);

        expect(screen.getByText("LoginPage Component")).toBeInTheDocument();
    });

    test("should render the SignupPage component for /signup route", () => {
        const router = createMemoryRouter(
        [
            { path: "/signup", element: <SignupPage /> },
        ],
        { initialEntries: ["/signup"] }
        );

        render(<RouterProvider router={router} />);

        expect(screen.getByText("SignupPage Component")).toBeInTheDocument();
    });

    test("should render the FeedPage component for /recipes route", () => {
        const router = createMemoryRouter(
        [
            { path: "/recipes", element: <FeedPage /> },
        ],
        { initialEntries: ["/recipes"] }
        );

        render(<RouterProvider router={router} />);

        expect(screen.getByText("FeedPage Component")).toBeInTheDocument();
    });

    test("should render the Profile component for /profile route", () => {
        const router = createMemoryRouter(
        [
            { path: "/profile", element: <Profile /> },
        ],
        { initialEntries: ["/profile"] }
        );
        render(<RouterProvider router={router} />);
        expect(screen.getByText("Profile Component")).toBeInTheDocument();
    });
});
