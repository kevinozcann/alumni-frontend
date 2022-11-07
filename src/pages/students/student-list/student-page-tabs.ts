import { IPageTab } from 'utils/shared-types';

const studentPageTabs: IPageTab[] = [
  {
    value: 'school-info',
    label: 'school.info',
    visible: ['headquarters', 'campus', 'school']
  }
];

export default studentPageTabs;
