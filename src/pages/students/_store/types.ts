import { IGuardian } from 'pages/guardians/_store/types';
import { ISchool } from 'pages/organization/organization-types';
import { IPerson } from 'pages/personnel/_store/types';

export interface IStudentBatch {
  id?: number;
  title?: string;
}

export interface IStudentCourses {
  id?: number;
  title?: string;
  courseBatch?: IStudentBatch;
}

export interface IStudent {
  id: number;
  studentNumber?: number;
  stdUniqueId?: string;
  name: string;
  middleName?: string;
  lastname: string;
  fullName: string;
  email?: string;
  isActive?: boolean;
  school?: ISchool;
  gender?: string;
  preEnrollmentDate?: string;
  enrollmentDate?: string;
  nationality?: string;
  placeOfBirth?: string;
  dateOfBirth?: string;
  photo?: string;
  formerSchool?: string;
  batchId?: number; // we will remove this
  courseId?: number; // we will remove this
  guardians?: IGuardian[];
  batchNames?: string;
  courseNames?: string;
  guide?: IPerson;
  advisor?: IPerson;
  studentCourses?: IStudentCourses[];
}
