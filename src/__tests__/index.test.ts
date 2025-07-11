import * as core from "@actions/core";

/* -------------------------------------------------------------------------- */
/* 1. Mock only what we really need                                           */
/* -------------------------------------------------------------------------- */
jest.mock("@actions/core", () => ({
  getInput: jest.fn(),
  setFailed: jest.fn(),
}));

const mockedCore = jest.requireMock("@actions/core") as jest.Mocked<typeof core>;

/* -------------------------------------------------------------------------- */
/* 2. Helper: import the action in isolation so `run()` executes each time    */
/* -------------------------------------------------------------------------- */
const loadAction = () =>
  jest.isolateModulesAsync(async () => {
    await import("../index"); // path relative to this test file
  });

/* -------------------------------------------------------------------------- */
/* 3.  Tests                                                                  */
/* -------------------------------------------------------------------------- */
describe("`user_id` input validation", () => {
  beforeEach(() => jest.clearAllMocks());

  it.each([["-2"], ["abc"]])('fails when `user_id` is "%s"', async (value) => {
    mockedCore.getInput.mockReturnValue(value);

    await loadAction();

    expect(mockedCore.setFailed).toHaveBeenCalledWith("`user_id` must be a positive integer.");
  });
});
