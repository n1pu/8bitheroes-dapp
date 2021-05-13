import { fireEvent } from "@testing-library/react";
import { routeNames } from "routes";
import { renderWithRouter } from "testUtils";

test("allows reaching Unlock page", () => {
  const screen = renderWithRouter({ route: "/" });
  const loginBtn = screen.getByTestId("loginBtn");
  fireEvent.click(loginBtn);
  expect(screen.history.location.pathname).toBe(routeNames.unlock);
});
