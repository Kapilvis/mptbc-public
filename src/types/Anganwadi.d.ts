declare namespace Anganwadi {
  interface CenterRegistrationBase {
    code: string;
    name: string;
    establishmentDate: Date;
    operatingDaysPerMonth: number;
    openingTime: Date;
    closingTime: Date;
    fullAddress: string;
    pincode: string;
    latitude?: string;
    longitude?: string;
    numberOfRooms: number;
    nearestPostOffice: string;
    nearestHealthCenter: string;
    nearestPrimarySchool: string;
    distanceFromBlockHq: number;
    statusId: number;
    isLocked: boolean;
  }
  interface CenterRegistrationForm extends CenterRegistrationBase {
    anganwadiTypeId: number;
    areaTypeId: number;
    agencyId: number;
    divisionId: number;
    districtId: number;
    projectId: number;
    sectorId: number;
    buildingStatusId: number;
    anganwadiBuildingId: number;
    locatedPlaceId: number;
  }
  interface CenterRegistrationItem extends CenterRegistrationBase {
    centerRegistrationId: number;
    isActive: boolean;
    districtName: string;
    divisionName: string;
    projectName: string;
    sectorName: string;
    agencyName: string;
    anganwadiTypeName: string;
    areaTypeName: string;
    buildingStatusName: string;
    anganwadiBuildingName: string;
    locatedPlaceName: string;
    verificationStatus: string;
    verifiedBy?: string;
    verifiedOn?: Date;
    verifiedIp?: string;
  }

  export interface StaffType {
    staffTypeId: number;
    name: string;
    isActive: boolean;
  }

  export interface StaffTypeForm {
    name: string;
  }

  export interface StaffRegistration {
    staffRegistrationId: number;
    staffTypeId: number;
    staffTypeName: string;
    employeeCode: string;
    name: string;
    mobile: string;
    email: string;
    genderId: number;
    address: string;
    centerRegistrationId: number;
    anganwadiName: string | null;
    isIncharge: boolean;
    deregistrationDate: string | null;
    deregistrationReason: string | null;
    isActive: boolean;
    isRegistered: boolean;
  }

  export interface AnganwadiStaffForm {
    staffTypeId: number;
    employeeCode: string;
    name: string;
    mobile: string;
    email: string;
    genderId: number;
    address: string;
    centerRegistrationId: number;
    isIncharge: boolean;
  }
  export interface DeregisterForm {
    deregistrationDate: Date;
    deregistrationReason: string;
  }

  export interface InfrastructureForm {
    centerInfrastructureId?: number;
    centerRegistrationId: number;
    hasElectricity: boolean;
    hasFan: boolean;
    hasBulb: boolean;
    hasWaterFilter: boolean;
    drinkingWaterSourceId?: number | null;
    hasToilet: boolean;
    hasChildToilet: boolean;
    hasChildFriendlyToilet: boolean;
    hasHandwash: boolean;
    hasBasin: boolean;
    hasPlayArea: boolean;
    hasActivityCorner: boolean;
    hasSeparateKitchen: boolean;
    hasStorageSpace: boolean;
    hasCompoundWall: boolean;
    hasRoadReachability: boolean;
    hasPublicTransport: boolean;
    hasPoshanVatika: boolean;
    connectivityStatusId: number;
    connectivityRemarks: string;
  }

  export interface CenterInfrastructureItem {
    centerInfrastructureId: number;
    centerRegistrationId: number;
    centerName: string;
    hasElectricity: boolean;
    hasFan: boolean;
    hasBulb: boolean;
    hasWaterFilter: boolean;
    drinkingWaterSourceId: number;
    drinkingWaterSourceName: string;
    hasToilet: boolean;
    hasChildToilet: boolean;
    hasChildFriendlyToilet: boolean;
    hasHandwash: boolean;
    hasBasin: boolean;
    hasPlayArea: boolean;
    hasActivityCorner: boolean;
    hasSeparateKitchen: boolean;
    hasStorageSpace: boolean;
    hasCompoundWall: boolean;
    hasRoadReachability: boolean;
    hasPublicTransport: boolean;
    hasPoshanVatika: boolean;
    connectivityStatusId: number;
    connectivityStatusName: string;
    connectivityRemarks: string;
  }
}
