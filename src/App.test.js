import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  process.env.REACT_APP_OPENWEATHER_KEY = "test_key";

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          name: "Toronto",
          dt: 1700000000,
          sys: { country: "CA" },
          main: { temp: 12.3, feels_like: 10.8, humidity: 60, pressure: 1012 },
          wind: { speed: 3.2 },
          visibility: 9000,
          clouds: { all: 40 },
          coord: { lat: 43.65, lon: -79.38 },
          weather: [{ main: "Clouds", description: "broken clouds", icon: "04d" }],
        }),
    })
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

test("renders app title and loads default city weather", async () => {
  render(<App />);

  expect(screen.getByText(/Nebula Weather/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByRole("region", { name: /weather details/i })).toBeInTheDocument();
  });

  expect(screen.getByText(/Toronto/i)).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalled();
});
