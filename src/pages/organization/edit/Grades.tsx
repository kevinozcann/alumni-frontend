import React from 'react';
import { useIntl } from 'react-intl';
import { useFormik } from 'formik';
import { Box, Card, CardHeader, Divider, CardContent } from '@mui/material';

import useSnackbar from 'hooks/useSnackbar';
import { SaveButton } from 'utils/ActionLinks';
import { TLang } from 'utils/shared-types';
import { IUser } from 'pages/account/account-types';
import { IGradeLevel } from 'pages/config/grade-levels/grade-types';

import { ISchool } from '../organization-types';
import GradesForm from '../view/ViewGrades';

type TGradesProps = {
  user: IUser;
  lang: TLang;
  phase: string;
  schoolInfo: ISchool;
  gradeLevels: IGradeLevel[];
  saveSchoolInfo: (
    user: IUser,
    lang: TLang,
    schoolId: number,
    schoolInfo: Partial<ISchool>
  ) => void;
};
type TFormValues = Record<string, number[]>;

const Grades = (props: TGradesProps) => {
  const { user, lang, phase, schoolInfo, gradeLevels, saveSchoolInfo } = props;
  const intl = useIntl();
  const { showSnackbar } = useSnackbar();

  const initialValues: TFormValues = {
    grades: schoolInfo.classLevels.split(',').map(Number)
  };

  const {
    handleSubmit,
    setFieldValue,
    values,
    errors,
    isSubmitting,
    setSubmitting,
    status,
    setStatus
  } = useFormik({
    initialValues: initialValues,
    validate: (values) => validateForm(values),
    onSubmit: (values) => submitForm(values)
  });

  const validateForm = (values: TFormValues) => {
    const errors = {};

    if (values.grades.length === 0) {
      errors['grades'] = intl.formatMessage({ id: 'app.no_row_selected' });
    }

    return errors;
  };

  const submitForm = (values: TFormValues) => {
    setStatus('submitted');

    saveSchoolInfo(user, lang, schoolInfo.id, { classLevels: values.grades.join(',') });
  };

  React.useEffect(() => {
    if (phase === 'school-updating-success') {
      setSubmitting(false);

      if (status === 'submitted') {
        showSnackbar({
          message: intl.formatMessage({ id: 'app.saved' }),
          open: true
        });
      }
    }
  }, [phase]);

  return (
    <form className='form' noValidate={true} autoComplete='off' onSubmit={handleSubmit}>
      <Card>
        <CardHeader title={intl.formatMessage({ id: 'school.grades' })} />
        <Divider />

        <CardContent>
          <GradesForm
            gradeLevels={gradeLevels}
            countryCode={schoolInfo?.countryCode}
            values={values}
            errors={errors}
            setFieldValue={setFieldValue}
          />
        </CardContent>

        <Divider />
        <Box sx={{ p: 2 }}>
          <SaveButton mode={isSubmitting ? 'saving' : ''} />
        </Box>
      </Card>
    </form>
  );
};

export default Grades;
