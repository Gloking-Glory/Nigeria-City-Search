import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CityDetail from "../cityDetail";
import { mockCity } from "../testsUtilities/mocks";

describe("CityDetail", () => {
  const city = mockCity;

  it("shows the city detail header", () => {
    render(
      <CityDetail city={city} onClose={jest.fn()} />
    );

    expect(
      screen.getByRole("heading", { name: "City Details" })
    ).toBeInTheDocument();
  });

  it("shows all city detail information", () => {
    render(
      <CityDetail city={city} onClose={jest.fn()} />
    );

    const {
      name, displayName, state, country, type
    } = city;

    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(state)).toBeInTheDocument();
    expect(screen.getByText(country)).toBeInTheDocument();
    expect(screen.getByText(displayName)).toBeInTheDocument();
    expect(screen.getByText(type)).toBeInTheDocument();
  });

  it("shows accessible close button", () => {
    render(
      <CityDetail city={city} onClose={jest.fn()} />
    );

    expect(
      screen.getByRole("button", {
        name: "Close city details"
      })
    ).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();

    render(
      <CityDetail city={city} onClose={handleClose} />
    );

    const closeButton = screen.getByRole(
      "button", { name: "Close city details"
    });

    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
