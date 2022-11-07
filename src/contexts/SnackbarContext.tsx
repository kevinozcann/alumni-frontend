import React from 'react';
import { Slide, Snackbar } from '@mui/material';

export interface ISnackbarSettings {
  autoHideDuration?: number;
  message: string;
  open?: boolean;
}
interface SnackbarProviderProps {
  children?: React.ReactNode;
}
export interface SnackbarContextValue {
  snackbarSettings: Partial<ISnackbarSettings>;
  showSnackbar: (settings: Partial<ISnackbarSettings>) => void;
}

const defaultSettings: ISnackbarSettings = {
  autoHideDuration: 5000,
  message: '',
  open: false
};

const SnackbarContext = React.createContext<SnackbarContextValue>({
  snackbarSettings: defaultSettings,
  showSnackbar: () => {}
});
SnackbarContext.displayName = 'Snackbar';

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [snackbarSettings, setSnackbarSettings] =
    React.useState<ISnackbarSettings>(defaultSettings);

  const handleHideSnackbar = () => {
    setSnackbarSettings(Object.assign({}, snackbarSettings, { open: false }));
  };

  const showSnackbar = (settings: ISnackbarSettings): void => {
    setSnackbarSettings(settings);
  };

  return (
    <SnackbarContext.Provider
      value={{
        snackbarSettings,
        showSnackbar
      }}
    >
      {children}

      <Snackbar
        message={snackbarSettings.message || defaultSettings.message}
        open={snackbarSettings.open || defaultSettings.open}
        autoHideDuration={snackbarSettings.autoHideDuration || defaultSettings.autoHideDuration}
        TransitionComponent={Slide}
        onClose={handleHideSnackbar}
      />
    </SnackbarContext.Provider>
  );
};

export const SnackbarConsumer = SnackbarContext.Consumer;

export default SnackbarContext;
