import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
function Badge() {
  return <span>ok</span>;
}

describe("smoke", () => {
  it("renders", () => {
    const { getByText } = render(<Badge />);
    expect(getByText("ok")).toBeInTheDocument();
  });
});
