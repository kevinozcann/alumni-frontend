import { createTheme, responsiveFontSizes, ThemeOptions, Theme } from '@mui/material/styles';
import type { Direction } from '@mui/material';
import { enUS, trTR } from '@mui/x-data-grid-pro';
import merge from 'deepmerge';

import { TLang } from 'utils/shared-types';

import { THEMES } from '../config';
import { lightShadows, darkShadows } from './shadows';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}
interface IThemeOptions extends ThemeOptions {
  custom?: {
    dnd?: {
      canDropColor: string;
      cannotDropColor: string;
      canDropMask: string;
      cannotDropMask: string;
      fileListCanDropMaskOne: string;
      fileListCanDropMaskTwo: string;
      fileListCannotDropMaskOne: string;
      fileListCannotDropMaskTwo: string;
    };
  };
}
export interface ITheme extends Theme {
  custom?: {
    dnd?: Record<string, string>;
  };
}
interface IThemeConfig {
  direction?: Direction;
  responsiveFontSizes?: boolean;
  roundedCorners?: boolean;
  theme?: string;
}

export const fontFamily = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"'
].join(',');

const baseOptions: IThemeOptions = {
  direction: 'ltr',
  components: {
    MuiAvatar: {
      styleOverrides: {
        fallback: {
          height: '75%',
          width: '75%'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginTop: 8,
          marginBottom: 8
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginTop: 8,
          marginBottom: 8
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none'
        }
      }
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: 'h6'
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: '0 !important',
          marginRight: '8px',
          width: '16px'
        }
      }
    }
  },
  typography: {
    button: {
      fontWeight: 600
    },
    fontFamily: fontFamily,
    fontSize: 12,
    h1: {
      fontWeight: 800,
      fontSize: '17px'
    },
    h2: {
      fontWeight: 800,
      fontSize: '16px'
    },
    h3: {
      fontWeight: 700,
      fontSize: '15px'
    },
    h4: {
      fontWeight: 600,
      fontSize: '15px'
    },
    h5: {
      fontWeight: 600,
      fontSize: '14px'
    },
    h6: {
      fontWeight: 600,
      fontSize: '14px'
    },
    overline: {
      fontWeight: 600
    }
  }
};

const themesOptions: IThemeOptions = {
  [THEMES.LIGHT]: {
    components: {
      MuiInputBase: {
        styleOverrides: {
          input: {
            '&::placeholder': {
              opacity: 0.86,
              color: '#42526e'
            }
          }
        }
      }
    },
    palette: {
      mode: 'light',
      action: {
        active: '#6b778c'
      },
      background: {
        default: '#f4f5f7',
        paper: '#ffffff'
      },
      secondary: {
        main: '#ff0000'
      },
      info: {
        contrastText: '#ffffff',
        main: '#4dd0e1'
      },
      primary: {
        contrastText: '#ffffff',
        main: '#5664d2'
      },
      success: {
        contrastText: '#ffffff',
        main: '#4caf50'
      },
      text: {
        primary: '#172b4d',
        secondary: '#6b778c'
      },
      warning: {
        contrastText: '#ffffff',
        main: '#ff9800'
      }
    },
    shadows: lightShadows,
    custom: {
      dnd: {
        canDropColor: 'green',
        cannotDropColor: 'red',
        canDropMask: 'rgba(180, 235, 180, 0.75)',
        cannotDropMask: 'rgba(235, 180, 180, 0.75)',
        fileListCanDropMaskOne: 'rgba(180, 235, 180, 0.1)',
        fileListCanDropMaskTwo: 'rgba(180, 235, 180, 0.2)',
        fileListCannotDropMaskOne: 'rgba(235, 180, 180, 0.1)',
        fileListCannotDropMaskTwo: 'rgba(235, 180, 180, 0.2)'
      }
    }
  },
  [THEMES.DARK]: {
    components: {
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: '1px solid rgba(145, 158, 171, 0.24)'
          }
        }
      }
    },
    palette: {
      background: {
        default: '#171c24',
        paper: '#222b36'
      },
      divider: 'rgba(145, 158, 171, 0.24)',
      error: {
        contrastText: '#ffffff',
        main: '#f44336'
      },
      mode: 'dark',
      primary: {
        contrastText: '#ffffff',
        main: '#688eff'
      },
      secondary: {
        main: '#ff0000'
      },
      success: {
        contrastText: '#ffffff',
        main: '#4caf50'
      },
      text: {
        primary: '#ffffff',
        secondary: '#919eab'
      },
      warning: {
        contrastText: '#ffffff',
        main: '#ff9800'
      },
      dnd: {
        canDropColor: 'green',
        cannotDropColor: 'red',
        canDropMask: 'rgba(180, 235, 180, 0.75)',
        cannotDropMask: 'rgba(235, 180, 180, 0.75)',
        fileListCanDropMaskOne: 'rgba(180, 235, 180, 0.1)',
        fileListCanDropMaskTwo: 'rgba(180, 235, 180, 0.2)',
        fileListCannotDropMaskOne: 'rgba(235, 180, 180, 0.1)',
        fileListCannotDropMaskTwo: 'rgba(235, 180, 180, 0.2)'
      }
    },
    shadows: darkShadows
  },
  [THEMES.NATURE]: {
    components: {
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: '1px solid rgba(145, 158, 171, 0.24)'
          }
        }
      }
    },
    palette: {
      mode: 'dark',
      background: {
        default: '#1c2531',
        paper: '#293142'
      },
      secondary: {
        main: '#ff0000'
      },
      divider: 'rgba(145, 158, 171, 0.24)',
      error: {
        contrastText: '#ffffff',
        main: '#f44336'
      },
      primary: {
        contrastText: '#ffffff',
        main: '#01ab56'
      },
      success: {
        contrastText: '#ffffff',
        main: '#4caf50'
      },
      text: {
        primary: '#ffffff',
        secondary: '#919eab'
      },
      warning: {
        contrastText: '#ffffff',
        main: '#ff9800'
      },
      dnd: {
        canDropColor: 'green',
        cannotDropColor: 'red',
        canDropMask: 'rgba(180, 235, 180, 0.75)',
        cannotDropMask: 'rgba(235, 180, 180, 0.75)',
        fileListCanDropMaskOne: 'rgba(180, 235, 180, 0.1)',
        fileListCanDropMaskTwo: 'rgba(180, 235, 180, 0.2)',
        fileListCannotDropMaskOne: 'rgba(235, 180, 180, 0.1)',
        fileListCannotDropMaskTwo: 'rgba(235, 180, 180, 0.2)'
      }
    },
    shadows: darkShadows
  }
};

export const createCustomTheme = (lang: TLang, config: IThemeConfig = {}): ITheme => {
  const dataGridLocale = lang === 'tr' ? trTR : enUS;
  let themeOptions = themesOptions[config.theme];

  if (!themeOptions) {
    console.warn(new Error(`The theme ${config.theme} is not valid`));
    themeOptions = themesOptions[THEMES.LIGHT];
  }

  const mergedOptions = merge.all([
    baseOptions,
    themeOptions,
    {
      ...(config.roundedCorners && {
        shape: {
          borderRadius: 8
        }
      })
    },
    {
      direction: config.direction
    },
    dataGridLocale
  ]);

  let theme = createTheme(mergedOptions);

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};
