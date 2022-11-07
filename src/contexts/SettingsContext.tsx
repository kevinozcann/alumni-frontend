import React from 'react';
import { THEMES } from '../config';

export interface ILayoutSettings {
  compact?: boolean;
  direction?: 'ltr' | 'rtl';
  responsiveFontSizes?: boolean;
  roundedCorners?: boolean;
  theme?: string;
  mainHeightGutter?: number;
}

export interface SettingsContextValue {
  settings: ILayoutSettings;
  saveSettings: (update: ILayoutSettings) => void;
}

interface SettingsProviderProps {
  children?: React.ReactNode;
}

const initialSettings: ILayoutSettings = {
  compact: false,
  direction: 'ltr',
  responsiveFontSizes: false,
  roundedCorners: false,
  theme: THEMES.LIGHT,
  mainHeightGutter: 225
};

export const restoreSettings = (): ILayoutSettings | null => {
  let settings = null;

  try {
    const storedData: string | null = localStorage.getItem('settings');

    if (storedData) {
      settings = JSON.parse(storedData);
    } else {
      settings = initialSettings;
    }
  } catch (err) {
    console.error(err);
    // If stored data is not a strigified JSON this will fail,
    // that's why we catch the error
  }

  return settings;
};

export const storeSettings = (settings: ILayoutSettings): void => {
  localStorage.setItem('settings', JSON.stringify(settings));
};

const SettingsContext = React.createContext<SettingsContextValue>({
  settings: initialSettings,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  saveSettings: (): void => {}
});

export const SettingsProvider = (props: SettingsProviderProps) => {
  const { children } = props;
  const [settings, setSettings] = React.useState<ILayoutSettings>(initialSettings);

  React.useEffect(() => {
    const restoredSettings = restoreSettings();

    if (restoredSettings) {
      // if (locale === 'ar') {
      //   restoredSettings.direction = 'rtl';
      // } else {
      //   restoredSettings.direction = 'ltr';
      // }
      restoredSettings.direction = 'ltr';

      setSettings(restoredSettings);
    } else {
      // setSettings({ ...initialSettings, direction: locale === 'ar' ? 'rtl' : 'ltr' });
      setSettings({ ...initialSettings, direction: 'ltr' });
    }
  }, []);

  const saveSettings = (updatedSettings: ILayoutSettings): void => {
    setSettings(updatedSettings);
    storeSettings(updatedSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        saveSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const SettingsConsumer = SettingsContext.Consumer;

export default SettingsContext;
