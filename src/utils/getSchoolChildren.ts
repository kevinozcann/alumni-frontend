import { ISchool } from '../pages/organization/organization-types';

export const getSchoolChildrenIds = (school: ISchool) => {
  const childrenIds = [];

  if (school.children?.length > 0) {
    const children = school.children;
    for (let i = 0; i < children.length; i++) {
      childrenIds.push(children[i].id);

      if (children[i].children?.length > 0) {
        const childChildren = children[i].children;
        for (let j = 0; j < childChildren.length; j++) {
          childrenIds.push(childChildren[j].id);
        }
      }
    }
  }

  return childrenIds;
};
