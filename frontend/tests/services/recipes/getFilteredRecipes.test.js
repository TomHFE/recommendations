import createFetchMock from "vitest-fetch-mock";
import { describe, expect, vi } from "vitest";

import { getFilteredRecipes } from "../../../src/services/recipes/getFilteredRecipes";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock fetch function
createFetchMock(vi).enableMocks();

describe("filtered recipes service", () => {
  describe("getFilteredRecipes", () => {
    test("includes a token with its request", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ filters: [], token: "newToken" }),
        {
          status: 200,
        }
      );

      await getFilteredRecipes("testToken");

      // This is an array of the arguments that were last passed to fetch
      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/recipes/filtered`);
      expect(options.method).toEqual("POST");
      expect(options.headers["Authorization"]).toEqual("Bearer testToken");
    });

    test("rejects with an error if the status is not 200", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ message: "Something went wrong" }),
        { status: 400 }
      );

      try {
        await getFilteredRecipes("testToken");
      } catch (err) {
        expect(err.message).toEqual("Unable to fetch filteres recipes");
      }
    });
  });
});
