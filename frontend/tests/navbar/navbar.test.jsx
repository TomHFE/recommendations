import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, vi, beforeEach, test } from "vitest";
import NavBar from "../../src/navbar/navbar"; 
import { getUsersAndRecipes } from "../../src/services/getUserAndRecipes";
import '@testing-library/jest-dom'; 
import { useNavigate } from "react-router-dom";

vi.mock("../../src/services/getUserAndRecipes", () => ({
    getUsersAndRecipes: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
    }));

    describe("NavBar Component", () => {
    beforeEach(() => {
        window.localStorage.clear();
        mockNavigate.mockReset();
    });

    test("calls getUsersAndRecipes on search and updates state", async () => {
        window.localStorage.setItem("token", "testToken");

        getUsersAndRecipes.mockResolvedValue({
        token: "newToken", 
        recipes: [{ title: "Vegan Pancakes" }],
        user: { username: "testUser" },
        });

        render(<NavBar />);

        await act(async () => {
        fireEvent.change(screen.getByPlaceholderText(/search.../i), { target: { value: "pancake" } });
        fireEvent.click(screen.getByText(/search/i));
        });

        await waitFor(() => {
        expect(getUsersAndRecipes).toHaveBeenCalledWith("testToken", "pancake");
        expect(mockNavigate).toHaveBeenCalledWith("./searches", {
            state: { recipes: [{ title: "Vegan Pancakes" }], user: { username: "testUser" } },
        });
        });
    });
});
