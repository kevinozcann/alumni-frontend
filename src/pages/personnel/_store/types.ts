export interface ITransferPerson {
  sourceSchool: number;
  destinationSchool: number;
  isActive: boolean;
}

export interface IPerson {
  id?: number;
  citizenId?: string;
  name: string;
  lastname: string;
  fullname: string;
  birthDate?: Date;
  manager?: number; // could be IPerson
  category?: number;
  department?: number;
  isManager?: boolean;
  isGuide?: boolean;
  isDepartmentHead?: boolean;
  isTeacher?: boolean;
  isClubTeacher?: boolean;
  isDoctor?: boolean;
  hasOfficeHour?: boolean;
  isTranslator?: boolean;
  gender?: string;
  resume?: string;
  cv?: string;
  address?: string;
  city?: number; // could be ICity
  state?: number; // could be IState
  zipCode?: string;
  country?: string; // could be ICountry
  phone?: string;
  phone2?: string;
  mobile: string;
  mobile2?: string;
  emailAddress: string;
  emailAddress2?: string;
  photo?: string;
  bloodType?: string;
  isActive: boolean;
  position?: number;
  startedWorkingAt?: Date;
  startedSchoolAt?: Date;
  emergencyContact?: string;
  emergencyPhone?: string;
  school?: number; // could be ISchool
  transfers?: ITransferPerson[];
}
