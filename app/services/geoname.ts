// GeoName API service for Nigeria locations
const GEONAME_API_URL = "http://api.geonames.org";
const GEONAME_USERNAME = process.env.NEXT_PUBLIC_GEONAME_USERNAME || "demo";

// Nigeria's geonameId
const NIGERIA_GEONAME_ID = 2328926;

export interface GeoNamePlace {
  geonameId: number;
  name: string;
  adminName1?: string;
  countryName?: string;
}

/**
 * Fetch Nigerian states from GeoName API
 */
export const fetchNigerianStates = async (): Promise<GeoNamePlace[]> => {
  try {
    const response = await fetch(
      `${GEONAME_API_URL}/childrenJSON?geonameId=${NIGERIA_GEONAME_ID}&username=${GEONAME_USERNAME}&featureClass=A&featureCode=ADM1`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Nigerian states");
    }

    const data = await response.json();
    return data.geonames || [];
  } catch (error) {
    console.error("Error fetching Nigerian states:", error);
    return [];
  }
};

/**
 * Fetch cities for a specific Nigerian state
 */
export const fetchCitiesForState = async (
  stateGeonameId: number,
): Promise<GeoNamePlace[]> => {
  try {
    const response = await fetch(
      `${GEONAME_API_URL}/childrenJSON?geonameId=${stateGeonameId}&username=${GEONAME_USERNAME}&featureClass=P&featureCode=PPLA`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch cities");
    }

    const data = await response.json();
    return data.geonames || [];
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};
