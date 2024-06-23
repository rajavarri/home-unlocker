import { getDistanceFromLatLonInMeters } from "../src/utils/distanceCalculator";

describe("getDistanceFromLatLonInMeters", () => {
  it("should return the correct distance between two points", () => {
    const userLocation = { latitude: 37.7749, longitude: -122.4194 }; // San Francisco, CA
    const homeLocation = { latitude: 34.0522, longitude: -118.2437 }; // Los Angeles, CA

    const distance = getDistanceFromLatLonInMeters(userLocation, homeLocation);

    expect(distance).toBeCloseTo(559120.5770615533, -2); // The distance should be around 559046 meters
  });

  it("should return 0 meters when the locations are the same", () => {
    const userLocation = { latitude: 37.7749, longitude: -122.4194 }; // Same location
    const homeLocation = { latitude: 37.7749, longitude: -122.4194 };

    const distance = getDistanceFromLatLonInMeters(userLocation, homeLocation);

    expect(distance).toBe(0);
  });

  it("should handle negative latitude and longitude values", () => {
    const userLocation = { latitude: -37.7749, longitude: -122.4194 }; // Some location in the southern and western hemispheres
    const homeLocation = { latitude: -34.0522, longitude: -118.2437 }; // Another location in the southern and western hemispheres

    const distance = getDistanceFromLatLonInMeters(userLocation, homeLocation);

    expect(distance).toBeCloseTo(559120.5770615533, 0); // The distance should be around 559046 meters
  });

  it("should handle locations on the equator", () => {
    const userLocation = { latitude: 0, longitude: 0 }; // Equator and Prime Meridian
    const homeLocation = { latitude: 0, longitude: 90 }; // Equator and 90 degrees east

    const distance = getDistanceFromLatLonInMeters(userLocation, homeLocation);

    expect(distance).toBeCloseTo(10007543.398010286, 0); // The distance should be around 10007557 meters (1/4th of Earth's circumference)
  });
});
