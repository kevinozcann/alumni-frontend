import React from 'react';
import { FormattedDate } from 'react-intl';
import { LinearProgress } from '@mui/material';

import { ISchool } from 'pages/organization/organization-types';

type ArrayOrSchool = ISchool[] | ISchool;

export function recursiveFind(
  content: ArrayOrSchool,
  search: number,
  returnKey = '',
  filterKey = 'id',
  children = 'children'
): ISchool | null {
  let result: ISchool | null = null;
  if (content[filterKey] === search) {
    result = returnKey === '' ? content : content[returnKey];
  } else {
    const subs = content[children];
    if (subs === null) return null;

    const BreakException = {};
    try {
      subs.forEach((element: ArrayOrSchool) => {
        result = recursiveFind(element, search, returnKey, filterKey, children);

        if (!Array.isArray(result) || result === element) throw BreakException;
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }
  }

  return result;
}

export const arrayRange = (start: number, end: number, step = 1): number[] => {
  const output = [];
  if (typeof end === 'undefined') {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    output.push(i);
  }
  return output;
};

export const generateApiLegacyUrl = (host: string, type: string) => {
  const hostArr = host.split('.');
  hostArr.splice(0, 0, type);

  return hostArr.join('.');
};

export const fileExtension = (fileName: string) => fileName.substr(fileName.lastIndexOf('.') + 1);

export const filenameFromPath = (path: string) => {
  return path.split('\\').pop().split('/').pop();
};

export const filetypeFromFilename = (url: string) => {
  if (url.match(/\.(jpg|jpeg|png|gif)$/)) {
    return 'image';
  } else if (url.match(/\.(doc|docm|docx|dot|dotm|dotx|odt|wps|rtf)$/)) {
    return 'word';
  } else if (url.match(/\.(csv|dbf|dif|ods|xla|xlam|xls|xlsb|xlsm|xlsx|xlt|xltm|xltx|xlw)$/)) {
    return 'excel';
  } else if (url.match(/\.(odp|pot|potm|potx|ppa|ppam|pps|ppsm|ppsx|ppt|pptm|pptx)$/)) {
    return 'powerpoint';
  } else if (url.match(/\.(pdf)$/)) {
    return 'pdf';
  } else if (url.match(/\.(htm|html)$/)) {
    return 'html';
  } else if (url.match(/\.(mp4|mov|wmv|flv|avi|avchd|webm|mkv)$/)) {
    return 'video';
  } else if (url.match(/\.(wav|mp3)$/)) {
    return 'music';
  } else {
    return '';
  }
};

/** @deprecated */
export const SchoostLinearProgress = ({ color, variant }: { color?: any; variant?: any }) => (
  <LinearProgress color={color} variant={variant} />
);

export const ShortDate = ({ date }) => (
  <FormattedDate value={date} year='numeric' month='short' day='2-digit' />
);

export const countryToFlag = (isoCode: string) => {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char: string) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
};

/* Functions */
export const createMarkup = (content: string) => {
  return {
    __html: content
  };
};

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const basicList = (listArray) => {
  return Array.isArray(listArray) ? (
    <ul style={{ margin: '0', paddingLeft: '15px' }}>
      {listArray.map((elt) => (
        <li key={elt}>{elt}</li>
      ))}
    </ul>
  ) : (
    ''
  );
};

export const pxToRem = (px: number) => `${(px / 16).toFixed(2)}rem`;

export const PasswordMeterColor = (strength: number) => {
  return strength === 0
    ? '#D1462F'
    : strength === 1
    ? '#FF9800'
    : strength === 2
    ? '#57B8FF'
    : strength === 3
    ? '#8BC34A'
    : strength === 4
    ? '#009688'
    : 'transparent';
};

export function loadScript(src: string, position: HTMLElement | null, id: string) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

export const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);
