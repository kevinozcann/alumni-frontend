import { IStudent } from 'pages/students/_store/types';

export interface IGuardian {
  id: number;
  citizenId?: string;
  ogrId?: string; // we will remove this
  fullName: string;
  occupation?: string;
  relation?: string;
  email: string;
  homeAddress?: string;
  workAddress?: string;
  homePhone?: string;
  workPhone?: string;
  workPhoneExt?: string;
  cellPhone: string;
  mailAddress?: string; // work | home
  invoiceTitle?: string;
  taxOffice?: string;
  taxNumber?: string;
  invoiceAddress?: string;
  addedAt: Date;
  addedBy: string;
  schoolId: number;
  student?: IStudent[];
}
