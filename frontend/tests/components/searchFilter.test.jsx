import { render, screen, fireEvent } from "@testing-library/react";

import { vi } from "vitest";
import { SearchFilter } from "../../src/components/searchFilter";
import { getFilteredRecipes } from "../../src/services/recipes/getFilteredRecipes";

// import { getFilteredRecipes } from "../../src/services/recipes/getFilteredRecipes";

vi.mock("./../src/services/recipes/getFilteredRecipes", () => ({
  getFilteredRecipes: vi.fn(),
}));

describe("SearchFilter", () => {
  const onSearchMock = vi.fn();

  beforeEach(() => {
    // Clear previous calls to onSearchMock
    onSearchMock.mockClear();
    render(<SearchFilter onSearch={onSearchMock} />);
  });

  test("handles input changes", () => {
    const nationalityInput = screen.getByPlaceholderText(/enter nationality/i);

    fireEvent.change(nationalityInput, { target: { value: "Italian" } });
    expect(nationalityInput.value).toBe("Italian");
  });

  test("renders the search form", () => {
    //Truthy - checks that the element exists
    expect(screen.getByPlaceholderText(/enter nationality/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/enter dish type/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/enter preparation time/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/enter cooking time/i)).toBeTruthy();
    expect(
      screen.getByPlaceholderText(/Enter total cooking and prep time/i)
    ).toBeTruthy();
    expect(screen.getByPlaceholderText(/Enter servings amount/i)).toBeTruthy();
  });

  test("handles checkbox changes", () => {
    const nutsLabel = screen.getByText(/nuts/i);
    const nutsCheckbox = nutsLabel.previousElementSibling;

    fireEvent.click(nutsCheckbox);
    expect(nutsCheckbox.checked).toBe(true);
  });
});
