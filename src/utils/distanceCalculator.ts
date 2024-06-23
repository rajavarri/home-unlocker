import { Location } from "../types";

export const getDistanceFromLatLonInMeters = (
  userLocation: Location,
  homeLocation: Location
) => {
  const EARTH_RADIUS_KM = 6371; // Radius of the Earth in kilometers

  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const userLatitude = userLocation.latitude;
  const userLongitude = userLocation.longitude;
  const homeLatitude = homeLocation.latitude;
  const homeLongitude = homeLocation.longitude;

  const deltaLatitude = toRadians(homeLatitude - userLatitude);
  const deltaLongitude = toRadians(homeLongitude - userLongitude);

  const haversineOfLatitude =
    Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2);
  const haversineOfLongitude =
    Math.sin(deltaLongitude / 2) * Math.sin(deltaLongitude / 2);

  const cosUserLatitude = Math.cos(toRadians(userLatitude));
  const cosHomeLatitude = Math.cos(toRadians(homeLatitude));

  const haversineFormula =
    haversineOfLatitude +
    cosUserLatitude * cosHomeLatitude * haversineOfLongitude;

  const centralAngle =
    2 *
    Math.atan2(Math.sqrt(haversineFormula), Math.sqrt(1 - haversineFormula));

  const distanceInMeters = EARTH_RADIUS_KM * centralAngle * 1000; // Distance in meters

  return distanceInMeters;
};
