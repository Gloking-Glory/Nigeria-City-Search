export type OpenMeteoLocation = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id: number;
  admin2_id?: number;
  admin3_id?: number;
  timezone: string;
  population?: number;
  country_id: number;
  country: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
};

export type OpenMeteoResponse = {
  results?: OpenMeteoLocation[];
  generationtime_ms: number;
};
