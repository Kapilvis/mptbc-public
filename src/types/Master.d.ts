declare namespace Master {
  //Office Master
  interface OfficeBase {
    name: string;
    localName?: string;
    code: string;
  }
  interface OfficeForm extends OfficeBase {
    officeLevelId: number;
    officeTypeId: number;
    supervisingOfficeId?: number;
    divisionId?: number;
    districtId?: number;
    projectId?: number;
    sectorId?: number;
  }
  interface OfficeItem extends OfficeBase {
    officeId: number;
    officeLevelId: number;
    officeLevelName: string;
    officeTypeName: string;
    isActive: boolean;
    supervisingOfficeId?: number;
    divisionId?: number;
    districtId?: number;
    projectId?: number;
    sectorId?: number;
  }

  //Office Level
  interface OfficeLevelBase {
    name: string;
    localName?: string;
    code: string;
  }

  interface OfficeLevelList extends OfficeLevelBase {
    officeLevelId: number;
    isActive: boolean;
  }
  type OfficeLevelForm = OfficeLevelBase;

  //Office Type
  interface OfficeTypeBase {
    name: string;
    localName?: string;
    code: string;
  }
  interface OfficeTypeForm extends OfficeTypeBase {
    officeLevelId: number;
  }
  interface OfficeTypeList extends OfficeTypeBase {
    officeTypeId: number;
    officeLevelName: string;
    officeLevel: OfficeLevelList;
    isActive: boolean;
  }

  //Anganwadi Type
  interface AnganwadiTypeBase {
    name: string;
    code: string;
  }

  interface AnganwadiTypeList extends AnganwadiTypeBase {
    anganwadiTypeId: number;
    isActive: boolean;
  }
  type AnganwadiTypeForm = AnganwadiTypeBase;

  //Designation Master
  interface DesignationBase {
    name: string;
    localName?: string;
    code: string;
  }
  interface DesignationList extends DesignationBase {
    designationId: number;
    isActive: boolean;
  }
  type DesignationForm = DesignationBase;

  //State Master
  interface StateBase {
    name: string;
    localName?: string;
    lgdCode?: string;
    code: string;
  }
  interface StateItem extends StateBase {
    stateId: number;
    isActive: boolean;
  }
  type StateForm = StateBase;

  //Division Master
  interface DivisionBase {
    name: string;
    localName?: string;
    code: string;
    lgdCode?: string;
  }
  interface DivisionItem extends DivisionBase {
    divisionId: number;
    isActive: boolean;
  }
  type DivisionForm = DivisionBase;

  //District Master
  interface DistrictBase {
    name: string;
    localName?: string;
    code: string;
    lgdCode?: string;
  }
  interface DistrictItem extends DistrictBase {
    districtId: number;
    divisionName?: string;
    division?: DivisionItem;
    isActive: boolean;
  }

  interface DistrictForm extends DistrictBase {
    divisionId: number;
  }

  //Caste Master
  interface CasteBase {
    name: string;
    localName?: string;
  }
  interface CasteList extends CasteBase {
    casteId: number;
    isActive: boolean;
  }
  type CasteForm = CasteBase;
  //Project Master
  interface ProjectBase {
    name: string;
    localName?: string;
    code: string;
    lgdCode?: string;
  }

  interface ProjectItem extends ProjectBase {
    projectId: number;
    divisionName?: string;
    districtName?: string;
    district?: DistrictItem;
    isActive: boolean;
  }

  interface ProjectForm extends ProjectBase {
    divisionId: number;
    districtId: number;
  }

  //Sector Master
  interface SectorBase {
    name: string;
    localName?: string;
    code: string;
    lgdCode?: string;
  }

  interface SectorItem extends SectorBase {
    sectorId: number;
    divisionName?: string;
    districtName?: string;
    projectName?: string;
    project?: ProjectItem;
    isActive: boolean;
  }

  interface SectorForm extends SectorBase {
    divisionId: number;
    districtId: number;
    projectId: number;
  }

  //Agency Master
  interface AgencyBase {
    name: string;
    localName?: string;
  }

  interface AgencyItem extends AgencyBase {
    agencyId: number;
    isActive: boolean;
  }
  type AgencyForm = AgencyBase;

  //Located Place Master
  interface LocatedPlaceBase {
    name: string;
    localName?: string;
  }

  interface LocatedPlaceItem extends LocatedPlaceBase {
    locatedPlaceId: number;
    isActive: boolean;
  }
  type LocatedPlaceForm = LocatedPlaceBase;

  //AWC Service Master
  interface AwcServiceBase {
    name: string;
    localName?: string;
  }

  interface AwcServiceItem extends AwcServiceBase {
    awcServiceId: number;
    isActive: boolean;
  }
  type AwcServiceForm = AwcServiceBase;

  //Marital Status Master
  interface MaritalStatusBase {
    name: string;
    localName?: string;
  }

  interface MaritalStatusList extends MaritalStatusBase {
    maritalStatusId: number;
    isActive: boolean;
  }

  type MaritalStatusForm = MaritalStatusBase;

  //Designation Type Master
  interface DesignationTypeBase {
    name: string;
    localName?: string;
  }
  interface DesignationTypeList extends DesignationTypeBase {
    designationTypeId: number;
    isActive: boolean;
  }

  type DesignationTypeForm = DesignationTypeBase;

  //Area Type Master
  interface AreaTypeBase {
    name: string;
    localName?: string;
  }
  interface AreaTypeItem extends AreaTypeBase {
    areaTypeId: number;
    isActive: boolean;
  }
  type AreaTypeForm = AreaTypeBase;

  //Building Status Master
  interface BuildingStatusBase {
    name: string;
    localName?: string;
  }
  interface BuildingStatusItem extends BuildingStatusBase {
    buildingStatusId: number;
    isActive: boolean;
  }
  type BuildingStatusForm = BuildingStatusBase;

  //Anganwadi Building Master
  interface AnganwadiBuildingBase {
    name: string;
    localName?: string;
  }
  interface AnganwadiBuildingItem extends AnganwadiBuildingBase {
    anganwadiBuildingId: number;
    isActive: boolean;
  }
  type AnganwadiBuildingForm = AnganwadiBuildingBase;

  //Located In Master
  interface LocatedInBase {
    name: string;
    localName?: string;
  }
  interface LocatedInItem extends LocatedInBase {
    id: number;
    isActive: boolean;
  }
  type LocatedInForm = LocatedInBase;

  //Connectivity Status Master
  interface ConnectivityStatusBase {
    name: string;
    localName?: string;
  }
  interface ConnectivityStatusItem extends ConnectivityStatusBase {
    connectivityStatusId: number;
    isActive: boolean;
  }
  type ConnectivityStatusForm = ConnectivityStatusBase;

  //Anganwadi Type Master
  interface AnganwadiTypeBase {
    name: string;
    localName?: string;
    code: string;
  }
  interface AnganwadiTypeItem extends AnganwadiTypeBase {
    id: number;
    isActive: boolean;
  }
  type AnganwadiTypeForm = AnganwadiTypeBase;

  //Drinking Water Source Master
  interface DrinkingWaterSourceBase {
    name: string;
    localName?: string;
  }
  interface DrinkingWaterSourceItem extends DrinkingWaterSourceBase {
    drinkingWaterSourceId: number;
    isActive: boolean;
  }
  type DrinkingWaterSourceForm = DrinkingWaterSourceBase;

  //Gender Master
  interface GenderBase {
    name: string;
    localName?: string;
  }
  interface GenderItem extends GenderBase {
    genderId: number;
    isActive: boolean;
  }
  type GenderForm = GenderBase;
  //Disability Type Master
  interface DisabilityTypeBase {
    name: string;
    localName?: string;
  }

  interface DisabilityTypeList extends DisabilityTypeBase {
    disabilityTypeId: number;
    isActive: boolean;
  }

  type DisabilityTypeForm = DisabilityTypeBase;

  //Disability Percentage Master
  interface DisabilityPercentageBase {
    name: string;
    localName?: string;
  }

  interface DisabilityPercentageList extends DisabilityPercentageBase {
    disabilityPercentageId: number;
    isActive: boolean;
  }

  type DisabilityPercentageForm = DisabilityPercentageBase;

  //Qualification Type Master
  interface QualificationTypeBase {
    name: string;
    localName?: string;
  }

  interface QualificationTypeList extends QualificationTypeBase {
    qualificationTypeId: number;
    isActive: boolean;
  }

  type QualificationTypeForm = QualificationTypeBase;
  interface CenterTypeList {
    typeId: number;
    name: string;
    isActive: boolean;
  }

  interface RelationList {
    relationId: number;
    name: string;
    isActive: boolean;
  }

  interface ReligionList {
    religionId: number;
    name: string;
    isActive: boolean;
  }

  interface GenderList {
    genderId: number;
    name: string;
    isActive: boolean;
  }

  //Qualification Master
  interface QualificationBase {
    name: string;
    localName?: string;
    qualificationTypeId: number;
  }

  interface QualificationList extends QualificationBase {
    qualificationId: number;
    isActive: boolean;
    qualificationTypeName: string;
  }

  type QualificationForm = QualificationBase;

  // Qualification Subject Master
  interface QualificationSubjectBase {
    name: string;
    localName?: string;
    qualificationId: number;
  }
  interface QualificationSubjectList extends QualificationSubjectBase {
    qualificationSubjectId: number;
    isActive: boolean;
    qualificationName: string;
  }

  type QualificationSubjectForm = QualificationSubjectBase;

  //Bank Type List
  interface BankTypeList {
    bankTypeId: number;
    name: string;
    isActive: boolean;
  }

  //Bank Master
  interface BankBase {
    name: string;
    localName?: string;
    bankTypeId: number;
    accNoMaxLength?: number;
    accNoMinLength?: number;
  }

  interface BankList extends BankBase {
    bankId: number;
    bankTypeName: string;
    isActive: boolean;
  }

  type BankForm = BankBase;

  //IFSCCode Master
  interface IFSCCodeBase {
    ifscCode: string;
    bankId: number;
    branchName?: string;
    branchAddress?: string;
  }
  interface IFSCCodeList extends IFSCCodeBase {
    ifscCodeId: number;
    bankName: string;
    isActive: boolean;
  }

  type IFSCCodeForm = IFSCCodeBase;

  // Religion Master
  interface ReligionBase {
    name: string;
    localName?: string;
    code?: string;
  }
  interface ReligionItem extends ReligionBase {
    religionId: number;
    isActive: boolean;
  }
  type ReligionForm = ReligionBase;

  // Blood Group Master
  interface BloodGroupBase {
    name: string;
    localName?: string;
    code?: string;
  }
  interface BloodGroupItem extends BloodGroupBase {
    bloodGroupId: number;
    isActive: boolean;
  }
  type BloodGroupForm = BloodGroupBase;

  // Nationality Master
  interface NationalityBase {
    name: string;
    localName?: string;
    code?: string;
  }
  interface NationalityItem extends NationalityBase {
    nationalityId: number;
    isActive: boolean;
  }
  type NationalityForm = NationalityBase;

  // Class Master
  interface ClassBase {
    name: string;
    localName?: string;
    code?: string;
  }
  interface ClassItem extends ClassBase {
    classId: number;
    isActive: boolean;
  }
  type ClassForm = ClassBase;

  // Book Type Master
  interface BookTypeBase {
    name: string;
    localName?: string;
    code?: string;
  }
  interface BookTypeItem extends BookTypeBase {
    bookTypeId: number;
    isActive: boolean;
  }
  type BookTypeForm = BookTypeBase;

  // Medium Master
  interface MediumBase {
    name: string;
    localName?: string;
    code?: string;
  }
  interface MediumItem extends MediumBase {
    mediumId: number;
    isActive: boolean;
  }
  type MediumForm = MediumBase;

  // GSM Master (Paper Specification)
  interface GsmBase {
    gsm: number;
    reelWidth: number;
    cutoff: number;
    sheetSize: string;
    area: number;
    sheetWeightInGM: number;
    reamWeightInMT: number;
  }
  interface GsmItem extends GsmBase {
    gsmId: number;
    isActive: boolean;
    name?: string;
  }
  type GsmForm = GsmBase;

  // Title Master
  interface TitleBase {
    name: string;
    localName?: string;
    code: string;
    classId: number;
    bookTypeId: number;
    mediumId: number;
    innerPages: number;
    innerGsmId: number;
    coverPages: number;
    coverGsmId: number;
    specialPages?: number;
    specialGsmId?: number;
    totalPages: number;
    weight: number;
    length: number;
    width: number;
    paperArea: number;
    matterDocumentUrl?: string;
    receivedDate?: string;
  }
  interface TitleItem extends TitleBase {
    titleId: number;
    className?: string;
    bookTypeName?: string;
    mediumName?: string;
    innerGsmName?: string;
    coverGsmName?: string;
    specialGsmName?: string;
    isActive: boolean;
  }
  type TitleForm = TitleBase;

  // Block Master
  interface BlockBase {
    name: string;
    localName?: string;
    code: string;
    districtId: number;
    divisionId?: number;
    lgdCode?: string;
  }
  interface BlockItem extends BlockBase {
    blockId: number;
    districtName?: string;
    divisionName?: string;
    isActive: boolean;
  }
  type BlockForm = BlockBase;

  // Depot Master
  interface DepotBase {
    name: string;
    code?: string;
    isActive: boolean;
  }
  interface Depot extends DepotBase {
    depotId: number;
  }
  type DepotForm = DepotBase;

  // Sub Depot Master
  interface SubDepotBase {
    depotId: number;
    name: string;
    code?: string;
    isActive: boolean;
  }
  interface SubDepot extends SubDepotBase {
    subDepotId: number;
    depotName: string;
  }
  type SubDepotForm = SubDepotBase;
}
