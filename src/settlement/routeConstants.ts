/** Clearance above `waterLevel` a route needs to consider a cell dry land — water is still a hard reject.
 *  This is the *lake/ocean* gate of the road router (`roadNetwork.ts`); the settlement layout's mainland filter
 *  (`settlementLayout.ts`, plan world-terrain-063 V1) walks the same rule so "reachable by road" and "on the
 *  mainland" cannot disagree. Rivers are handled separately and analytically (`roadRiverCrossing.ts`). */
export const ROUTE_WATER_CLEARANCE = 0.5
