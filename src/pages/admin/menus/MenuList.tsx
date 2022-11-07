import React from 'react';
import loadable from '@loadable/component';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { Box, Divider, Tab, Tabs } from '@mui/material';

import Page from 'layout/Page';
import { RootState } from 'store/store';
import { userActiveSchoolSelector } from 'store/user';
import { useSubheader } from 'contexts/SubheaderContext';
import useTranslation from 'hooks/useTranslation';
import { IPageTab } from 'utils/shared-types';
import { ISchool } from 'pages/organization/organization-types';

import { TMenuType } from './menu-types';

const MenuContent = loadable(() => import('./MenuContent'));

const mapStateToProps = (state: RootState): { activeSchool: ISchool } => ({
  activeSchool: userActiveSchoolSelector(state)
});
const connector = connect(mapStateToProps, null);
type PropsFromRedux = ConnectedProps<typeof connector>;
type MenuListParams = PropsFromRedux;

const MenuList: React.FC<MenuListParams> = ({ activeSchool }) => {
  const { section } = useParams();
  const [activeTab, setActiveTab] = React.useState<string>(section);
  const subheader = useSubheader();
  const navigate = useNavigate();
  const intl = useTranslation();

  const pageTabs: IPageTab[] = [];
  if (activeSchool.type === 'headquarters') {
    pageTabs.push({
      value: 'headquarters',
      label: intl.translate({ id: 'menu.type.headquarters' }),
      component: 'Headquarters',
      icon: 'User',
      url: `/admin/menus/headquarters`
    });
  } else if (activeSchool.type === 'campus') {
    pageTabs.push({
      value: 'campus',
      label: intl.translate({ id: 'menu.type.campus' }),
      component: 'Campus',
      icon: 'User',
      url: `/admin/menus/campus`
    });
  } else {
    pageTabs.push(
      {
        value: 'school',
        label: intl.translate({ id: 'menu.type.school' }),
        component: 'School',
        icon: 'User',
        url: `/admin/menus/school`
      },
      {
        value: 'teacher',
        label: intl.translate({ id: 'menu.type.teacher' }),
        component: 'Teacher',
        icon: 'User',
        url: `/admin/menus/teacher`
      },
      {
        value: 'parent',
        label: intl.translate({ id: 'menu.type.parent' }),
        component: 'Parent',
        icon: 'User',
        url: `/admin/menus/parent`
      },
      {
        value: 'student',
        label: intl.translate({ id: 'menu.type.student' }),
        component: 'Student',
        icon: 'User',
        url: `/admin/menus/student`
      }
    );
  }

  const handleTabChange = (_event: React.SyntheticEvent<Element, Event>, newValue: TMenuType) => {
    setActiveTab(newValue);

    navigate(`/admin/menus/${newValue}`);
  };

  React.useEffect(() => {
    if (section) {
      const isExists = pageTabs.find((p) => p.value === section);
      if (isExists) {
        navigate(`/admin/menus/${section}`);
        setActiveTab(section);
      } else {
        navigate(`/admin/menus/${activeSchool.type}`);
        setActiveTab(activeSchool.type);
      }
    } else {
      navigate(`/admin/menus/${activeSchool.type}`);
      setActiveTab(activeSchool.type);
    }
  }, [activeSchool]);

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'menu.menus', url: '/admin/menus' });
    if (activeTab) {
      breadcrumbs.push({
        title: activeTab.toUpperCase(),
        url: `/admin/menus/${activeTab}`
      });
    }
    subheader.setBreadcrumbs(breadcrumbs);
  }, [activeTab]);

  return (
    <Page title={intl.translate({ id: 'menu.menus' })}>
      <Box>
        {activeTab && (
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor='primary'
            textColor='primary'
            scrollButtons='auto'
            variant='scrollable'
            aria-label='page tabs'
          >
            {pageTabs.map((tab: IPageTab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        )}
      </Box>

      <Divider />

      <Box sx={{ my: 3 }}>
        {activeTab && (
          <MenuContent
            title={activeTab.toUpperCase()}
            menuType={activeTab as TMenuType}
            pageTabs={pageTabs}
          />
        )}
      </Box>
    </Page>
  );
};

export default connector(MenuList);
