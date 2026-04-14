import { render } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import * as apiCall from "../request/apiCalls";

vi.mock("../request/apiCalls", () => ({
  authenticate: vi.fn(),
}));

describe("Signin Component", () => {
  it("should", () => {});
});
