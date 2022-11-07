import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SFMIconName, SFMIconProps } from '../types/icons.types';
import {
  faArrowDown,
  faBalanceScale,
  faBoxOpen,
  faChevronDown,
  faChevronRight,
  faCircleNotch,
  faCogs,
  faCopy,
  faCubes,
  faDatabase,
  faDownload,
  faEraser,
  faExclamationTriangle,
  faExternalLinkAlt,
  faEyeSlash,
  faFile,
  faFileAlt,
  faFileArchive,
  faFileCode,
  faFileExcel,
  faFileImage,
  faFilePdf,
  faFileWord,
  faFilm,
  faFistRaised,
  faFolder,
  faFolderOpen,
  faFolderPlus,
  faInfoCircle,
  faKey,
  faLevelUpAlt,
  faList,
  faLock,
  faMinus,
  faMusic,
  faObjectGroup,
  faPaste,
  faRunning,
  faSearch,
  faShareAlt,
  faSortAmountDownAlt,
  faSortAmountUpAlt,
  faTerminal,
  faTh,
  faThLarge,
  faThList,
  faTimes,
  faToggleOff,
  faToggleOn,
  faTrash,
  faUpload,
  faUsers
} from '@fortawesome/pro-duotone-svg-icons';
import {
  faAdobe,
  faGitAlt,
  faLinux,
  faNodeJs,
  faPhp,
  faPython,
  faRust,
  faUbuntu,
  faWindows
} from '@fortawesome/free-brands-svg-icons';

const IconMap: { [iconName in SFMIconName]: any } = {
  // Misc
  [SFMIconName.loading]: faCircleNotch,
  [SFMIconName.dropdown]: faChevronDown,
  [SFMIconName.placeholder]: faMinus,

  // File Actions: Drag & drop
  [SFMIconName.dndDragging]: faFistRaised,
  [SFMIconName.dndCanDrop]: faArrowDown,
  [SFMIconName.dndCannotDrop]: faTimes,

  // File Actions: File operations
  [SFMIconName.openFiles]: faBoxOpen,
  [SFMIconName.openParentFolder]: faLevelUpAlt,
  [SFMIconName.copy]: faCopy,
  [SFMIconName.paste]: faPaste,
  [SFMIconName.share]: faShareAlt,
  [SFMIconName.search]: faSearch,
  [SFMIconName.selectAllFiles]: faObjectGroup,
  [SFMIconName.clearSelection]: faEraser,

  // File Actions: Sorting & options
  [SFMIconName.sortAsc]: faSortAmountDownAlt,
  [SFMIconName.sortDesc]: faSortAmountUpAlt,
  [SFMIconName.toggleOn]: faToggleOn,
  [SFMIconName.toggleOff]: faToggleOff,

  // File Actions: File Views
  [SFMIconName.list]: faList,
  [SFMIconName.compact]: faThList,
  [SFMIconName.smallThumbnail]: faTh,
  [SFMIconName.largeThumbnail]: faThLarge,

  // File Actions: Unsorted
  [SFMIconName.folder]: faFolder,
  [SFMIconName.folderCreate]: faFolderPlus,
  [SFMIconName.folderOpen]: faFolderOpen,
  [SFMIconName.folderChainSeparator]: faChevronRight,
  [SFMIconName.download]: faDownload,
  [SFMIconName.upload]: faUpload,
  [SFMIconName.trash]: faTrash,
  [SFMIconName.fallbackIcon]: faExclamationTriangle,

  // File modifiers
  [SFMIconName.symlink]: faExternalLinkAlt,
  [SFMIconName.hidden]: faEyeSlash,

  // Generic file types
  [SFMIconName.file]: faFile,
  [SFMIconName.license]: faBalanceScale,
  [SFMIconName.code]: faFileCode,
  [SFMIconName.config]: faCogs,
  [SFMIconName.model]: faCubes,
  [SFMIconName.database]: faDatabase,
  [SFMIconName.text]: faFileAlt,
  [SFMIconName.archive]: faFileArchive,
  [SFMIconName.image]: faFileImage,
  [SFMIconName.video]: faFilm,
  [SFMIconName.info]: faInfoCircle,
  [SFMIconName.key]: faKey,
  [SFMIconName.lock]: faLock,
  [SFMIconName.music]: faMusic,
  [SFMIconName.terminal]: faTerminal,
  [SFMIconName.users]: faUsers,

  // OS file types
  [SFMIconName.linux]: faLinux,
  [SFMIconName.ubuntu]: faUbuntu,
  [SFMIconName.windows]: faWindows,

  // Programming language file types
  [SFMIconName.rust]: faRust,
  [SFMIconName.python]: faPython,
  [SFMIconName.nodejs]: faNodeJs,
  [SFMIconName.php]: faPhp,

  // Development tools file types
  [SFMIconName.git]: faGitAlt,

  // Brands file types
  [SFMIconName.adobe]: faAdobe,

  // Other program file types
  [SFMIconName.pdf]: faFilePdf,
  [SFMIconName.excel]: faFileExcel,
  [SFMIconName.word]: faFileWord,
  [SFMIconName.flash]: faRunning
} as const;

export const FileManagerIcons = React.memo((props: SFMIconProps) => {
  const { icon } = props;

  let faIcon: any; // FontAwesome `IconDefinition`
  if (typeof icon === 'object') faIcon = icon;
  else faIcon = IconMap[icon as keyof typeof IconMap] ?? IconMap.fallbackIcon;

  const faProps = {
    ...props,
    icon: faIcon
  } as const;
  return <FontAwesomeIcon {...faProps} />;
});
