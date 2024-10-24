import { describe, expect, vi } from "vitest";
import { createRecipe } from "../../../src/services/recipes/createRecipe"


describe("createRecipe", () => {
    const token = "mockToken";
    const recipeList = ["recipe1", "recipe2"];

    // Mocking fetch request
    global.fetch = vi.fn();

    test("should make a POST request with the correct headers and body", async () => {
        const mockResponse = {
        status: 201,
        json: vi.fn().mockResolvedValue({ success: true }),
        };
        fetch.mockResolvedValue(mockResponse);

        const result = await createRecipe(token, recipeList);

        expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/recipes/create_recipe",
        {
            method: "POST",
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ recipeList }),
        }
        );
        expect(result).toEqual({ success: true });
    });

    test("should throw an error if the response status is not 201", async () => {
        const mockResponse = {
        status: 400,
        json: vi.fn().mockResolvedValue({ error: "Bad request" }),
        };
        fetch.mockResolvedValue(mockResponse);

        await expect(createRecipe(token, recipeList)).rejects.toThrow(
        "Unable to fetch posts"
        );
    });

    test("should handle a different status code", async () => {
        const mockResponse = {
        status: 500,
        json: vi.fn().mockResolvedValue({ error: "Internal server error" }),
        };
        fetch.mockResolvedValue(mockResponse);

        await expect(createRecipe(token, recipeList)).rejects.toThrow(
        "Unable to fetch posts"
        );
    });
});
