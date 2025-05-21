export interface RouteData {
  duration: number; // duration in minutes
  distance: number; // distance in meters
}

export interface RouteCalculatorInterface {
  getRouteWithTraffic(origin: string, destination: string): Promise<RouteData>;
  getRouteWithoutTraffic(origin: string, destination: string): Promise<RouteData>;
}
