import { ISchool } from '../pages/organization/organization-types';

const getFlatSchools = (schools: ISchool[]) => {
  const flatSchools: ISchool[] = [];

  if (!schools || !Array.isArray(schools) || schools?.length === 0) {
    return flatSchools;
  }

  schools?.forEach((school) => {
    school.itemMargin = 0;
    flatSchools.push(school);

    addChildren(school);
  });

  function addChildren(school: ISchool) {
    if (school?.children?.length > 0) {
      school.children.forEach((child) => {
        child.itemMargin = school.itemMargin + 1.5;
        flatSchools.push(child);

        addChildren(child);
      });
    }
  }

  return flatSchools;
};

export default getFlatSchools;
