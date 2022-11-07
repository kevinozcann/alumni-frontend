import { IntlShape, MessageDescriptor, useIntl } from 'react-intl';
import { IntlMessageID } from 'theme/i18n/LocaleProvider';
import { PrimitiveType } from 'utils/shared-types';

type TMessageDescriptor = MessageDescriptor & {
  id: IntlMessageID;
};

interface ITranslationMessage extends IntlShape {
  translate(descriptor: TMessageDescriptor, values?: Record<string, PrimitiveType>): string;
}

export const useTranslation = (): ITranslationMessage => {
  const intl = useIntl();

  // Format message with custom HTML tags
  const translate = (
    descriptor: TMessageDescriptor,
    values?: Record<string, PrimitiveType>
  ): string => {
    return intl.formatMessage(descriptor, { ...values });
  };

  return { ...intl, translate };
};

export default useTranslation;
