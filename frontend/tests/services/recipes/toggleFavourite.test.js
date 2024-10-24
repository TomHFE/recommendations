import { describe, expect, vi } from "vitest";
import { createFavourite } from "../../../src/services/recipes/toggleFavourites"; // update with correct path

describe("createFavourite", () => {
    const token = "mockToken";
    const recipe_id = "recipe1";

    // Mocking fetch function
    global.fetch = vi.fn();

    test("should make a PATCH request with the correct headers and body", async () => {
        const mockResponse = {
        status: 201,
        json: vi.fn().mockResolvedValue({ success: true }),
        };
        fetch.mockResolvedValue(mockResponse);

        const result = await createFavourite(token, recipe_id);

        expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/recipes/toggle_favourites",
        {
            method: "PATCH",
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ recipe_id }),
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

        await expect(createFavourite(token, recipe_id)).rejects.toThrow("Unable to fetch posts");
    });

    test("should return the correct data on a successful request", async () => {
        const mockResponseData = {
        success: true,
        message: "Recipe added to favourites",
        };
        const mockResponse = {
        status: 201,
        json: vi.fn().mockResolvedValue(mockResponseData),
        };
        fetch.mockResolvedValue(mockResponse);

        const result = await createFavourite(token, recipe_id);

        expect(result).toEqual(mockResponseData);
    });
});
