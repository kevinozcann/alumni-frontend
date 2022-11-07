import { IntlShape } from 'react-intl';
import { IFlatMenu, IMenu } from '../pages/admin/menus/menu-types';

const getFlatMenus = (intl: IntlShape, menus: IMenu[]) => {
  const flatMenus: IFlatMenu[] = [];

  if (menus) {
    menus.forEach((menu) => {
      flatMenus.push({
        id: menu.id,
        globalId: menu.globalId,
        title: intl.formatMessage({ id: menu.title }),
        url: menu.url,
        iconPrefix: menu.iconPrefix,
        icon: menu.icon
      });

      if (menu.children) {
        menu.children.forEach((child) => {
          flatMenus.push({
            id: child.id,
            globalId: child.globalId,
            title: intl.formatMessage({ id: child.title }),
            url: child.url,
            iconPrefix: child.iconPrefix,
            icon: child.icon
          });

          if (child.children) {
            child.children.forEach((subchild) => {
              flatMenus.push({
                id: subchild.id,
                globalId: subchild.globalId,
                title: intl.formatMessage({ id: subchild.title }),
                url: subchild.url,
                iconPrefix: subchild.iconPrefix,
                icon: subchild.icon
              });
            });
          }
        });
      }
    });
  }

  return flatMenus;
};

export default getFlatMenus;
