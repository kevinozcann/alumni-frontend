import React from 'react';
import { IBreadcrumb } from '../pages/admin/menus/menu-types';

interface SubheaderContextValueProps {
  breadcrumbs?: IBreadcrumb[];
  setBreadcrumbs?: React.Dispatch<React.SetStateAction<any>>;
}

const initialState: SubheaderContextValueProps = {};

const SubheaderContext = React.createContext<SubheaderContextValueProps>(initialState);

export function useSubheader() {
  return React.useContext(SubheaderContext);
}

export const SubheaderConsumer = SubheaderContext.Consumer;

export function SubheaderProvider({ children }) {
  const [breadcrumbs, setBreadcrumbs] = React.useState([]);
  const value = {
    breadcrumbs,
    setBreadcrumbs
  };

  return <SubheaderContext.Provider value={value}>{children}</SubheaderContext.Provider>;
}
