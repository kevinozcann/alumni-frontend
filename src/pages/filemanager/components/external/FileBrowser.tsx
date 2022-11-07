import React, { ReactNode, useMemo } from 'react';
import merge from 'deepmerge';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider } from 'react-jss';
import { createTheme } from '@mui/material/styles';

import { FileBrowserHandle, FileBrowserProps } from '../../types/file-browser.types';
import { defaultConfig } from '../../util/default-config';
import { getValueOrFallback } from '../../util/helpers';
import { SFMFormattersContext, defaultFormatters } from '../../util/i18n';
import { SFMIconContext } from '../../util/icon-helper';
import {
  darkThemeOverride,
  lightTheme,
  mobileThemeOverride,
  useIsMobileBreakpoint
} from '../../util/styles';
import { SFMBusinessLogic } from '../internal/SFMBusinessLogic';
import { SFMPresentationLayer } from '../internal/SFMPresentationLayer';

export const FileBrowser = React.forwardRef<
  FileBrowserHandle,
  FileBrowserProps & { children?: ReactNode }
>((props, ref) => {
  const { children } = props;
  const disableDragAndDrop = getValueOrFallback(
    props.disableDragAndDrop,
    defaultConfig.disableDragAndDrop,
    'boolean'
  );
  const disableDragAndDropProvider = getValueOrFallback(
    props.disableDragAndDropProvider,
    defaultConfig.disableDragAndDropProvider,
    'boolean'
  );
  const darkMode = getValueOrFallback(props.darkMode, defaultConfig.darkMode, 'boolean');
  const formatters = useMemo(() => ({ ...defaultFormatters }), []);

  const isMobileBreakpoint = useIsMobileBreakpoint();
  const theme = useMemo(() => {
    const muiTheme = createTheme({
      //@ts-ignore
      palette: { type: darkMode ? 'dark' : 'light' }
    });
    const combinedTheme = merge(muiTheme, merge(lightTheme, darkMode ? darkThemeOverride : {}));
    return isMobileBreakpoint ? merge(combinedTheme, mobileThemeOverride) : combinedTheme;
  }, [darkMode, isMobileBreakpoint]);

  const sFMComps = (
    <>
      <SFMBusinessLogic ref={ref} {...props} />
      <SFMPresentationLayer>{children}</SFMPresentationLayer>
    </>
  );

  return (
    <SFMFormattersContext.Provider value={formatters}>
      <ThemeProvider theme={theme}>
        <SFMIconContext.Provider value={defaultConfig.iconComponent}>
          {disableDragAndDrop || disableDragAndDropProvider ? (
            sFMComps
          ) : (
            <DndProvider backend={HTML5Backend}>{sFMComps}</DndProvider>
          )}
        </SFMIconContext.Provider>
      </ThemeProvider>
    </SFMFormattersContext.Provider>
  );
});
FileBrowser.displayName = 'FileBrowser';
