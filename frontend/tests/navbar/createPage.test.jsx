import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, vi, beforeEach } from "vitest";
import CreatePage from "../../src/navbar/create_button/createPage";
import { useNavigate } from "react-router-dom";
import '@testing-library/jest-dom'; 

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
    }));

    describe("CreatePage Component", () => {
    beforeEach(() => {
        mockNavigate.mockReset(); 
    });

    test("renders the form with inputs and checkboxes", () => {
        render(<CreatePage />);

        // Check if form elements are rendered
        expect(screen.getByPlaceholderText(/Enter nationality/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter dish type/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter maximum time for dish to be ready/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter maximum price/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter number of servings/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter maximum time for dish preparation/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter maximum cooking time/i)).toBeInTheDocument();

        // Check if dietary requirement checkboxes are rendered
        expect(screen.getByLabelText(/Vegeterian/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Vegan/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Pescatarian/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/GlutenFree/i)).toBeInTheDocument();

        // Check if allergy checkboxes are rendered
        expect(screen.getByLabelText(/Nuts/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Shellfish/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Dairy/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Soy/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Eggs/i)).toBeInTheDocument();
    });

    test("updates state when inputs change", () => {
        render(<CreatePage />);

        const nationalityInput = screen.getByPlaceholderText(/Enter nationality/i);
        fireEvent.change(nationalityInput, { target: { value: "Italian" } });
        expect(nationalityInput.value).toBe("Italian");

        const dishTypeInput = screen.getByPlaceholderText(/Enter dish type/i);
        fireEvent.change(dishTypeInput, { target: { value: "Dessert" } });
        expect(dishTypeInput.value).toBe("Dessert");

        const servingsInput = screen.getByPlaceholderText(/Enter number of servings/i);
        fireEvent.change(servingsInput, { target: { value: "4" } });
        expect(servingsInput.value).toBe("4");

        const timeInput = screen.getByPlaceholderText(/Enter maximum time for dish to be ready/i);
        fireEvent.change(timeInput, { target: { value: "60" } });
        expect(timeInput.value).toBe("60");
    });

    test("toggles dietary requirement checkboxes", () => {
        render(<CreatePage />);

        const veganCheckbox = screen.getByLabelText(/Vegan/i);
        expect(veganCheckbox.checked).toBe(false); // Initially unchecked

        fireEvent.click(veganCheckbox);
        expect(veganCheckbox.checked).toBe(true); 
    });

    test("toggles allergy checkboxes", () => {
        render(<CreatePage />);

        const nutsCheckbox = screen.getByLabelText(/Nuts/i);
        expect(nutsCheckbox.checked).toBe(false); 

        fireEvent.click(nutsCheckbox);
        expect(nutsCheckbox.checked).toBe(true); 
    });

    test("handles ingredients input", () => {
        render(<CreatePage />);
        const ingredientInputs = screen.getAllByPlaceholderText(/Enter ingredients/i);
    
        fireEvent.change(ingredientInputs[0], { target: { value: "tomato" } });
        expect(ingredientInputs[0].value).toBe("tomato");
        fireEvent.change(ingredientInputs[1], { target: { value: "basil" } });
        expect(ingredientInputs[1].value).toBe("basil");
    });

    test("submits the form and calls fetchData", async () => {
        global.fetch = vi.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ results: [{ id: 1, title: "Test Recipe", image: "test.jpg" }] }),
        })
        );
        render(<CreatePage />);

        fireEvent.click(screen.getByRole("submit-button"));

        await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
        expect(screen.getByText(/Test Recipe/i)).toBeInTheDocument();
        });
    });

    test("navigates to fetched_recipe when a recipe is clicked", async () => {
        const recipe = { id: 1, title: "Test Recipe", image: "test.jpg" };

        global.fetch = vi.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ results: [recipe] }),
        })
        );

        render(<CreatePage />);
        fireEvent.click(screen.getByRole("submit-button"));

        await waitFor(() => {
        // Check if recipe is rendered
        const recipeTitle = screen.getByText(/Test Recipe/i);
        expect(recipeTitle).toBeInTheDocument();

        // Simulate clicking on the recipe
        fireEvent.click(recipeTitle);
        expect(mockNavigate).toHaveBeenCalledWith("./fetched_recipe", {
            state: { props: recipe, allergies: expect.any(Array) },
        });
        });
    });
});
