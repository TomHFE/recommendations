import createFetchMock from "vitest-fetch-mock";
import { describe, expect, vi } from "vitest";

import { getUserFollowingList } from "../../src/services/getUserFollowing";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

createFetchMock(vi).enableMocks();

describe("Get User following list", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  test("includes a token with its request", async () => {
    fetch.mockResponseOnce(JSON.stringify({ token: "newToken" }), {
      status: 201,
    });

    const result = await getUserFollowingList("testToken");

    const fetchArguments = fetch.mock.lastCall;
    const url = fetchArguments[0];
    const options = fetchArguments[1];

    expect(url).toEqual(`${BACKEND_URL}/users/get_following_list`);
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
      await getUserFollowingList("testToken");
    } catch (err) {
      expect(err.message).toEqual("Unable to fetch following");
    }
  });
});
