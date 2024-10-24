import createFetchMock from "vitest-fetch-mock";
import { describe, expect, vi } from "vitest";

import { getUserById } from "../../src/services/getUserById";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock fetch function
createFetchMock(vi).enableMocks();

describe("get user by ID", () => {
  test("includes a token with its request", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ friendsIds: [], token: "newToken" }),
      {
        status: 201,
      }
    );

    await getUserById("testToken");

    // This is an array of the arguments that were last passed to fetch
    const fetchArguments = fetch.mock.lastCall;
    const url = fetchArguments[0];
    const options = fetchArguments[1];

    expect(url).toEqual(`${BACKEND_URL}/users/get_user_by_id`);
    expect(options.method).toEqual("POST");
    expect(options.headers["Authorization"]).toEqual("Bearer testToken");
  });

  test("rejects with an error if the status is not 200", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ message: "Something went wrong" }),
      { status: 400 }
    );

    try {
      await getUserById("testToken");
    } catch (err) {
      expect(err.message).toEqual("Unable to fetch posts");
    }
  });
});
