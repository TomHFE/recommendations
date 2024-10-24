import createFetchMock from "vitest-fetch-mock";
import { describe, expect, vi } from "vitest";

import { getUserDetails } from "../../src/services/getUserDetails";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

createFetchMock(vi).enableMocks();

describe("Get User details", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  test("includes a token with its request", async () => {
    fetch.mockResponseOnce(JSON.stringify({ token: "newToken" }), {
      status: 201,
    });

    const result = await getUserDetails("testToken");

    const fetchArguments = fetch.mock.lastCall;
    const url = fetchArguments[0];
    const options = fetchArguments[1];

    expect(url).toEqual(`${BACKEND_URL}/users/get_user_details`);
    expect(options.method).toEqual("GET");
    expect(options.headers["Authorization"]).toEqual("Bearer testToken");
    expect(result).toEqual({ token: "newToken" });
  });

  test("rejects with an error if the status is not 201", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ message: "Something went wrong" }),
      { status: 400 }
    );

    try {
      await getUserDetails("testToken");
    } catch (err) {
      expect(err.message).toEqual("Unable to fetch posts");
    }
  });
});
