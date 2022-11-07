import React from 'react';
import loadable from '@loadable/component';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { useIntl } from 'react-intl';
import { Box, Divider, Tab, Tabs } from '@mui/material';

import Page from 'layout/Page';
import { userActiveSchoolSelector } from 'store/user';
import { RootState } from 'store/store';
import { useSubheader } from 'contexts/SubheaderContext';
import { IPageTab } from 'utils/shared-types';
import { ISchool } from 'pages/organization/organization-types';
import { TMenuType } from 'pages/admin/menus/menu-types';

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
  const intl = useIntl();

  const pageTabs: IPageTab[] = [
    {
      value: 'headquarters',
      label: intl.formatMessage({ id: 'menu.type.headquarters' }),
      component: 'Headquarters',
      icon: 'User',
      url: `/global/menus/headquarters`
    },
    {
      value: 'campus',
      label: intl.formatMessage({ id: 'menu.type.campus' }),
      component: 'Campus',
      icon: 'User',
      url: `/global/menus/campus`
    },
    {
      value: 'school',
      label: intl.formatMessage({ id: 'menu.type.school' }),
      component: 'School',
      icon: 'User',
      url: `/global/menus/school`
    },
    {
      value: 'teacher',
      label: intl.formatMessage({ id: 'menu.type.teacher' }),
      component: 'Teacher',
      icon: 'User',
      url: `/global/menus/teacher`
    },
    {
      value: 'parent',
      label: intl.formatMessage({ id: 'menu.type.parent' }),
      component: 'Parent',
      icon: 'User',
      url: `/global/menus/parent`
    },
    {
      value: 'student',
      label: intl.formatMessage({ id: 'menu.type.student' }),
      component: 'Student',
      icon: 'User',
      url: `/global/menus/student`
    }
  ];

  const handleTabChange = (_event: React.SyntheticEvent<Element, Event>, newValue: TMenuType) => {
    setActiveTab(newValue);

    navigate(`/global/menus/${newValue}`);
  };

  React.useEffect(() => {
    if (section) {
      const isExists = pageTabs.find((p) => p.value === section);
      if (isExists) {
        navigate(`/global/menus/${section}`);
        setActiveTab(section);
      } else {
        navigate(`/global/menus/${activeSchool.type}`);
        setActiveTab(activeSchool.type);
      }
    } else {
      navigate(`/global/menus/${activeSchool.type}`);
      setActiveTab(activeSchool.type);
    }
  }, [activeSchool]);

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'Global', url: '/global', original: true });
    breadcrumbs.push({ title: 'MENUS', url: '/global/menus' });
    if (activeTab) {
      breadcrumbs.push({
        title: activeTab.toUpperCase(),
        url: `/global/menus/${activeTab}`
      });
    }
    subheader.setBreadcrumbs(breadcrumbs);
  }, [activeTab]);

  return (
    <Page title={intl.formatMessage({ id: 'menu.menus' })}>
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
