import { describe, expect, vi } from "vitest";
import { getUserRecipesById } from "../../../src/services/recipes/getUserRecipesById"; 

describe("getUserRecipesById", () => {
    const token = "mockToken";
    const user_id = "user1";

    // Mocking fetch function
    global.fetch = vi.fn();

    test("should make a GET request with the correct headers and body", async () => {
        const mockResponse = {
        status: 200,
        json: vi.fn().mockResolvedValue({ recipes: [] }),
        };
        fetch.mockResolvedValue(mockResponse);

        const result = await getUserRecipesById(token, user_id);

        expect(fetch).toHaveBeenCalledWith(
            "http://localhost:3000/recipes/get_user_recipes",
        {
            method: "GET",
            headers: {
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id }),
        }
        );
        expect(result).toEqual({ recipes: [] });
    });

    test("should throw an error if the response status is not 200", async () => {
        const mockResponse = {
        status: 404,
        json: vi.fn().mockResolvedValue({ error: "Not found" }),
        };
        fetch.mockResolvedValue(mockResponse);

        await expect(getUserRecipesById(token, user_id)).rejects.toThrow("Unable to fetch posts");
    });

    test("should return the correct data on a successful request", async () => {
        const mockResponseData = {
        recipes: ["recipe1", "recipe2"],
        };
        const mockResponse = {
        status: 200,
        json: vi.fn().mockResolvedValue(mockResponseData),
        };
        fetch.mockResolvedValue(mockResponse);

        const result = await getUserRecipesById(token, user_id);

        expect(result).toEqual(mockResponseData);
    });
});
