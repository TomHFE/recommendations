import createFetchMock from "vitest-fetch-mock";
import { describe, expect, vi } from "vitest";

import { getUserDetailsByUsername } from "../../src/services/getUserDetailsByUsername";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock fetch function
createFetchMock(vi).enableMocks();

describe("Get user details by their username", () => {
  test("includes a token with its request", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ token: "newToken", username: "Avnita" }),
      {
        status: 201,
      }
    );

    const result = await getUserDetailsByUsername("testToken", "Avnita");

    const fetchArguments = fetch.mock.lastCall;
    const url = fetchArguments[0];
    const options = fetchArguments[1];

    expect(url).toEqual(`${BACKEND_URL}/users/public_details_username`);
    expect(options.method).toEqual("POST");
    expect(options.headers["Authorization"]).toEqual("Bearer testToken");
    expect(options.body).toEqual(JSON.stringify({ username: "Avnita" }));

    expect(result).toEqual({ username: "Avnita", token: "newToken" });
  });

  test("rejects with an error if the status is not 201", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ message: "Something went wrong" }),
      { status: 400 }
    );

    try {
      await getUserDetailsByUsername("testToken");
    } catch (err) {
      expect(err.message).toEqual("Unable to fetch posts");
    }
  });
});
