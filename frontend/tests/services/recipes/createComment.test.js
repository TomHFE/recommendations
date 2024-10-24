import { describe, expect, vi } from "vitest";
import { createComment } from  "../../../src/services/recipes/createComment";

describe("createComment", () => {
    const token = "mockToken";
    const message = "This is a comment";
    const recipe_id = "recipe1";

    // Mocking fetch request
    global.fetch = vi.fn();

    test("should make a PATCH request with the correct headers and body", async () => {
        const mockResponse = {
        status: 201,
        json: vi.fn().mockResolvedValue({ success: true }),
        };
        fetch.mockResolvedValue(mockResponse);

        const result = await createComment(token, message, recipe_id);

        expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/recipes/comments",
        {
            method: "PATCH",
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ message, recipe_id }),
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

        await expect(createComment(token, message, recipe_id)).rejects.toThrow("Unable to fetch posts");
    });

    test("should return the correct data on a successful request", async () => {
        const mockResponseData = {
        success: true,
        message: "Comment added successfully",
        };
        const mockResponse = {
        status: 201,
        json: vi.fn().mockResolvedValue(mockResponseData),
        };
        fetch.mockResolvedValue(mockResponse);

        const result = await createComment(token, message, recipe_id);

        expect(result).toEqual(mockResponseData);
    });
});
