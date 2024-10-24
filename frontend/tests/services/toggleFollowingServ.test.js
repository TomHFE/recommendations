import createFetchMock from "vitest-fetch-mock";
import { describe, expect, vi } from "vitest";

import { toggleFollowingServ } from "../../src/services/toggleFollowingServ";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

createFetchMock(vi).enableMocks();
describe("Toggle following service", () => {
  test("includes a token with its request and sends correct body", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ target_id: 1, token: "newToken" }),
      { status: 201 }
    );

    const result = await toggleFollowingServ("testToken", 1);

    const fetchArguments = fetch.mock.lastCall;
    const url = fetchArguments[0];
    const options = fetchArguments[1];

    expect(url).toEqual(`${BACKEND_URL}/users/toggle_following`);
    expect(options.method).toEqual("PATCH");
    expect(options.headers["Authorization"]).toEqual("Bearer testToken");
    expect(options.headers["Content-Type"]).toEqual("application/json");
    expect(options.body).toEqual(JSON.stringify({ target_id: 1 }));

    expect(result).toEqual({ target_id: 1, token: "newToken" });
  });

  test("rejects with an error if the status is not 201", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ message: "Something went wrong" }),
      { status: 400 }
    );

    try {
      await toggleFollowingServ("testToken");
    } catch (err) {
      expect(err.message).toEqual("Unable to toggle");
    }
  });
});
