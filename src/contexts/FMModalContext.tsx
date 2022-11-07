import React from 'react';
import FileManagerDialog from 'components/FileManagerDialog';
import FileManager from 'pages/filemanager/FileManager';

export interface IFMModalSettings {
  intro?: string;
  iframeSrc: string;
  isOpen: boolean;
  handleClose?: () => void;
  selectCallback: (fieldId: string, url: string) => void;
  title: string;
}

const defaultSettings: IFMModalSettings = {
  intro: null,
  iframeSrc: null,
  isOpen: false,
  handleClose: null,
  selectCallback: null,
  title: 'SmartClass File Manager'
};
interface FMProviderProps {
  children?: React.ReactNode;
}
export interface FileManagerContextValue {
  fileManagerSettings: Partial<IFMModalSettings>;
  showFileManager: (settings: Partial<IFMModalSettings>) => void;
}

const FileManagerContext = React.createContext<FileManagerContextValue>({
  fileManagerSettings: defaultSettings,
  showFileManager: () => {}
});
FileManagerContext.displayName = 'FileManager';

export const FileManagerProvider = ({ children }: FMProviderProps) => {
  const [fileManagerSettings, setFileManagerSettings] = React.useState(defaultSettings);

  const showFileManager = (fileManagerSettings: Partial<IFMModalSettings>) => {
    setFileManagerSettings(Object.assign({}, defaultSettings, fileManagerSettings));
  };

  const handleHideFileManager = () => {
    setFileManagerSettings(Object.assign({}, fileManagerSettings, { isOpen: false }));
  };

  const handleModalClose = () => {
    if (fileManagerSettings.handleClose) {
      fileManagerSettings.handleClose();
    }
    handleHideFileManager();
  };

  React.useEffect(() => {
    const handleFileManagerCallback = (event) => {
      // const originalEvent = event.originalEvent;

      // Make sure the sender of the event is trusted
      if (event.data.sender === 'responsivefilemanager') {
        if (event.data.field_id) {
          const fieldId = event.data.field_id;
          const url = event.data.url;

          if (fieldId) {
            fileManagerSettings.selectCallback(fieldId, url);
          }
          handleHideFileManager();
        }
      }
    };

    //handler for a message from out of the box
    window.addEventListener('message', handleFileManagerCallback, false);

    return () => window.removeEventListener('message', handleFileManagerCallback, false);
  }, [fileManagerSettings]);

  return (
    <FileManagerContext.Provider
      value={{
        fileManagerSettings,
        showFileManager
      }}
    >
      {children}

      <FileManagerDialog
        isOpen={fileManagerSettings.isOpen || defaultSettings.isOpen}
        intro={fileManagerSettings.intro || defaultSettings.intro}
        handleClose={handleModalClose}
        title={fileManagerSettings.title || defaultSettings.title}
      >
        <FileManager iframeSrc={fileManagerSettings.iframeSrc} />
      </FileManagerDialog>
    </FileManagerContext.Provider>
  );
};

export const FileManagerConsumer = FileManagerContext.Consumer;

export default FileManagerContext;
