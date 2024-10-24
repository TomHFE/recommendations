import createFetchMock from "vitest-fetch-mock";
import { describe, expect, vi } from "vitest";

import { getUserFavouriteData } from "../../src/services/getUserFavouriteData";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock fetch function
createFetchMock(vi).enableMocks();

describe("Get user favourite data", () => {
  test("includes a token with its request", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ token: "newToken", favouriteData: [] }),
      {
        status: 201,
      }
    );

    const result = await getUserFavouriteData("testToken", []);

    const fetchArguments = fetch.mock.lastCall;
    const url = fetchArguments[0];
    const options = fetchArguments[1];

    expect(url).toEqual(`${BACKEND_URL}/recipes/get_favourite_data`);
    expect(options.method).toEqual("POST");
    expect(options.headers["Authorization"]).toEqual("Bearer testToken");
    expect(options.body).toEqual(JSON.stringify({ favourites: [] }));

    expect(result).toEqual({ favouriteData: [], token: "newToken" });
  });

  test("rejects with an error if the status is not 201", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ message: "Something went wrong" }),
      { status: 400 }
    );

    try {
      await getUserFavouriteData("testToken");
    } catch (err) {
      expect(err.message).toEqual("Unable to fetch followers");
    }
  });
});
