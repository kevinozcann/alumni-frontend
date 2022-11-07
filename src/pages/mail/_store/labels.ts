import { IMailLabel } from 'pages/mail/mail-types';

const labels: IMailLabel[] = [
  {
    id: 'inbox',
    type: 'system_label',
    name: 'inbox',
    unreadCount: 0,
    totalCount: 0
  },
  {
    id: 'starred',
    type: 'system_label',
    name: 'starred',
    unreadCount: 0,
    totalCount: 0
  },
  {
    id: 'sent',
    type: 'system_label',
    name: 'sent',
    unreadCount: 0,
    totalCount: 0
  },
  {
    id: 'drafts',
    type: 'system_label',
    name: 'drafts',
    unreadCount: 0,
    totalCount: 0
  },
  {
    id: 'trash',
    type: 'system_label',
    name: 'trash',
    unreadCount: 0,
    totalCount: 0
  }
  // {
  //   id: '5e892628d4bc60b4514d5d36',
  //   type: 'custom_label',
  //   name: 'Work',
  //   unreadCount: 1,
  //   totalCount: 1
  // },
  // {
  //   id: '5e8926820cf9ec6c834114ec',
  //   type: 'custom_label',
  //   name: 'Business',
  //   unreadCount: 0,
  //   totalCount: 2
  // }
];

export default labels;
