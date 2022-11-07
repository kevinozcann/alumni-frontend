import { IPageTab } from 'utils/shared-types';

const pageTabs: IPageTab[] = [
  {
    value: 'general',
    label: 'school.general',
    visible: ['headquarters', 'campus', 'school']
  },
  {
    value: 'contact',
    label: 'school.contact',
    visible: ['headquarters', 'campus', 'school']
  },
  {
    value: 'images',
    label: 'school.images',
    visible: ['headquarters', 'campus', 'school']
  },
  {
    value: 'seasons',
    label: 'school.seasons',
    visible: ['headquarters', 'campus', 'school']
  },
  {
    value: 'campuses',
    label: 'campuses',
    visible: ['headquarters']
  },
  {
    value: 'schools',
    label: 'schools',
    visible: ['campus']
  },
  {
    value: 'grades',
    label: 'school.grades',
    visible: ['headquarters', 'campus', 'school']
  },
  {
    value: 'config',
    label: 'school.config',
    visible: ['headquarters', 'campus', 'school']
  }
];

export default pageTabs;
