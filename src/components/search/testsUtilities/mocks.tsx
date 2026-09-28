"use client";

import { SearchResult } from "../../utilities/types";

export const mockResults: SearchResult[] = [
  {
    id: 1,
    name: "Lagos",
    localGov: "",
    state: "Lagos",
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
  state: "Lagos",
  country: "Nigeria",
  displayName: "Lagos, Lagos State, Nigeria",
  type: "PPLA2",
};
