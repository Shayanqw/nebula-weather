import { render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  // ✅ App.js requires this or it returns early and never calls fetch
  process.env.REACT_APP_OPENWEATHER_KEY = "test-key";

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          name: "Toronto",
          dt: 1700000000,
          sys: { country: "CA" },
          coord: { lat: 43.65, lon: -79.38 },
          main: { temp: 12.3, feels_like: 10.8, humidity: 60, pressure: 1012 },
          wind: { speed: 3.2 },
          visibility: 10000,
          clouds: { all: 20 },
          weather: [{ main: "Clouds", description: "scattered clouds", icon: "03d" }],
        }),
    })
  );
});

afterEach(() => {
  jest.resetAllMocks();
  delete process.env.REACT_APP_OPENWEATHER_KEY;
});

test("renders app title and loads default city weather", async () => {
  render(<App />);

  expect(screen.getByText(/Nebula Weather/i)).toBeInTheDocument();

  // Wait for the weather card heading to appear
  const cityHeading = await screen.findByRole("heading", { name: /Toronto/i });
  expect(cityHeading).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalled();
});
