import { SearchResult } from "../../utilities/types";

export const mockResults: SearchResult[] = [
  {
    id: 1,
    name: "Lagos",
    localGov: "",
    state: "Lagos State",
    country: "Nigeria",
    displayName: "Lagos, Lagos State, Nigeria",
    type: "PPLA2",
  },
  {
    id: 2,
    name: "Lagos",
    localGov: "Ndokwa East",
    state: "Delta State",
    country: "Nigeria",
    displayName: "Lagos-Iyidi, Ndokwa East LG, Delta State, Nigeria",
    type: "PPL",
  },
];

export const mockCity: SearchResult = {
  id: 1,
  name: "Lagos",
  localGov: "",
  state: "Lagos State",
  country: "Nigeria",
  displayName: "Lagos, Lagos State, Nigeria",
  type: "PPLA2",
};

export const mockApiResult = {
  id: 7099097,
  name: "Lagos Iyede-Ame",
  country: "Nigeria",
  feature_code: "PPLA2",
  admin1: "Delta",
  admin2: "Ndokwa East"
};

export const stateSuffixMockResult = {
  id: 2325200,
  name: "Oyo",
  country: "Nigeria",
  feature_code: "PPLA2",
  admin1: "Oyo State",
  admin2: "Oyo West",
};

export const fctMockResult = {
  id: 2352778,
  name: "Abuja",
  country: "Nigeria",
  feature_code: "PPLA2",
  admin1: "FCT",
  admin2: "Municipal Area Council"
};