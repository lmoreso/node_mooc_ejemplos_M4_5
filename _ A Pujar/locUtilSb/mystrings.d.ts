declare interface IUtilSbWebPartStrings {
  stockD: string;
  stockF: string;
  stockP: string;
  paisES: string;
  paisFR: string;
  paisUK: string;
  paisIT: string;
  paisTK: string;
  roleST: string;
  roleSM: string;
  roleSU: string;
  roleCO: string;
  roleCM: string;
  locationST: string;
  locationCC: string;
  locationCO: string;
  locationAE: string;
}

declare module 'UtilSbWebPartStrings' {
  const utilSpStrings: IUtilSbWebPartStrings;
  export = utilSpStrings;
}
