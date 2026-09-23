export type NominatimAddress = {
  city?: string;
  village?: string;
  town?: string;
  municipality?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
  "ISO3166-2-lvl4"?: string;
};

export type NominatimResult = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address?: NominatimAddress;
  boundingbox: string[];
};

export type NominatimResponse = NominatimResult[];
