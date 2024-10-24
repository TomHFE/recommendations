import createFetchMock from "vitest-fetch-mock";
import { describe, expect, vi } from "vitest";

import { getUsersAndRecipes } from "../../src/services/getUserAndRecipes";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock fetch function
createFetchMock(vi).enableMocks();

describe("get users and recipes", () => {
  //   test("includes a token with its request", async () => {
  //     fetch.mockResponseOnce(
  //       JSON.stringify({ searchparam: [], token: "newToken" }),
  //       {
  //         status: 201,
  //       }
  //     );
  //     const result = await getUsersAndRecipes("testToken", []);

  //     const fetchArguments = fetch.mock.lastCall;
  //     const url = fetchArguments[0];
  //     const options = fetchArguments[1];

  //     expect(url).toEqual(`${BACKEND_URL}/searchbar/`);
  //     expect(options.method).toEqual("POST");
  //     expect(options.headers["Authorization"]).toEqual("Bearer testToken");

  //     expect(result).toEqual({
  // =
  //       token: "newToken",
  //     });
  //   });

  test("rejects with an error if the status is not 200", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ message: "Something went wrong" }),
      { status: 400 }
    );

    try {
      await getUsersAndRecipes("testToken");
    } catch (err) {
      expect(err.message).toEqual("Unable to fetch following");
    }
  });
});
