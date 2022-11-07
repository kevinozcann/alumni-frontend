import { connect, ConnectedProps } from 'react-redux';
import React from 'react';
import { useParams } from 'react-router';
import { useFormik } from 'formik';
import { Box, Grid, TextField, FormControlLabel, Switch, MenuItem } from '@mui/material';

import { AppDispatch, RootState } from 'store/store';
import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import { SaveButton } from 'utils/ActionLinks';
import { TActionType } from 'utils/shared-types';

import { userTypesSelector, userTypesPhaseSelector, userTypesActions } from './_store/user-types';
import { IUserType } from './user-types-type';

const mapStateToProps = (state: RootState) => ({
  userTypes: userTypesSelector(state),
  phase: userTypesPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addUserType: (userTypeInfo: Partial<IUserType>) =>
    dispatch(userTypesActions.addUserType(userTypeInfo)),
  updateUserType: (userTypeInfo: Partial<IUserType>) =>
    dispatch(userTypesActions.updateUserType(userTypeInfo))
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TFormProps = PropsFromRedux & {
  actionType: TActionType;
  sideForm?: boolean;
  handleClose?: any;
};

const UserTypesForm = (props: TFormProps) => {
  const { actionType, sideForm, userTypes, phase, handleClose, addUserType, updateUserType } =
    props;
  const { id } = useParams();
  const intl = useTranslation();
  const { showSnackbar } = useSnackbar();

  const maxValueTypeOrder = Math.max(...userTypes.map((val) => val.typeOrder), 0) + 1;

  const userTypeInfo: IUserType = userTypes.find((g: IUserType) => g.id === parseInt(id));
  const initialFormValues: Partial<IUserType> = {
    id: (actionType === 'new' && null) || userTypeInfo?.id || null,
    isActive: (actionType === 'new' && '1') || userTypeInfo?.isActive || '1',
    isEditable: (actionType === 'new' && '1') || userTypeInfo?.isEditable || '1',
    loginType: (actionType === 'new' && 'manager') || userTypeInfo?.loginType || 'manager',
    userType: (actionType === 'new' && '') || userTypeInfo?.userType || '',
    typeOrder:
      (actionType === 'new' && maxValueTypeOrder) || userTypeInfo?.typeOrder || maxValueTypeOrder
  };

  const {
    handleSubmit,
    handleChange,
    setFieldValue,
    values,
    initialValues,
    errors,
    isSubmitting,
    setSubmitting,
    status,
    setStatus
  } = useFormik({
    initialValues: initialFormValues,
    validate: (values) => validateForm(values),
    onSubmit: (values) => submitForm(values)
  });

  const validateForm = (values: Partial<IUserType>) => {
    const errors: { [key: string]: any } = {};
    const nonEmptyFields = ['userType'];

    nonEmptyFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = intl.translate({ id: 'app.cannot_be_empty' });
      }
    });

    return errors;
  };

  const submitForm = (values: Partial<IUserType>) => {
    setStatus('submitted');

    if (values !== initialValues) {
      setSubmitting(true);

      if (actionType === 'add') {
        addUserType(values);
      } else {
        updateUserType(values);
      }
    }
  };

  React.useEffect(() => {
    setStatus('notSubmitted');
  }, []);

  React.useEffect(() => {
    setSubmitting(false);

    if (status === 'submitted' && phase === 'success') {
      showSnackbar({
        message: intl.translate({ id: 'app.saved' }),
        open: true
      });

      if (!sideForm) {
        setTimeout(() => {
          handleClose();
        }, 500);
      }
    }
  }, [status, phase, setSubmitting, handleClose]);

  return (
    <Box sx={{ display: 'flex' }}>
      <form
        style={{ width: '100%' }}
        className='form'
        noValidate={true}
        autoComplete='off'
        onSubmit={handleSubmit}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={sideForm ? 12 : 6}>
            <TextField
              id='userType'
              autoFocus
              className={`${errors.userType ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.userType ? errors.userType : ''}
              error={!!errors.userType}
              fullWidth={true}
              label={intl.translate({ id: 'user.type' })}
              value={values.userType}
              variant='outlined'
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={sideForm ? 12 : 6}>
            <TextField
              id='loginType'
              select={true}
              className={`${errors.loginType ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.loginType ? errors.loginType : ''}
              error={!!errors.loginType}
              fullWidth={true}
              label={intl.translate({ id: 'login.type' })}
              value={values.loginType}
              variant='outlined'
              onChange={(event) => setFieldValue('loginType', event.target.value)}
            >
              <MenuItem key='1' value='manager' dense={true}>
                {intl.translate({ id: 'menu.type.manager' })}
              </MenuItem>
              <MenuItem key='2' value='teacher' dense={true}>
                {`${intl.translate({ id: 'menu.type.teacher' })}`}
              </MenuItem>
              <MenuItem key='3' value='student' dense={true}>
                {intl.translate({ id: 'menu.type.student' })}
              </MenuItem>
              <MenuItem key='4' value='parent' dense={true}>
                {intl.translate({ id: 'menu.type.parent' })}
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={!!parseInt(values.isActive)}
                  color='primary'
                  disabled={isSubmitting ? true : false}
                  id='isActive'
                  onChange={handleChange}
                />
              }
              label={intl.translate({ id: 'app.is_active' })}
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            p: 0,
            pt: 2
          }}
        >
          <SaveButton />
        </Box>
      </form>
    </Box>
  );
};

export default connector(UserTypesForm);
