import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useParams } from 'react-router';
import { useFormik } from 'formik';
import { Box, FormControlLabel, Grid, MenuItem, Switch, TextField } from '@mui/material';

import { AppDispatch, RootState } from 'store/store';
import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import { SaveButton, CancelButton } from 'utils/ActionLinks';
import { TActionType } from 'utils/shared-types';
import { userActiveSchoolSelector } from 'store/user';
import {
  accountCodesActions,
  accountCodesPhaseSelector,
  accountCodesSelector,
  IAccountCode
} from './_store/account-codes';

const mapStateToProps = (state: RootState) => ({
  activeSchool: userActiveSchoolSelector(state),
  accountCodes: accountCodesSelector(state),
  phase: accountCodesPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addAccountCode: (accountCodeInfo: Partial<IAccountCode>) =>
    dispatch(accountCodesActions.addAccountCode(accountCodeInfo)),
  updateAccountCode: (accountCodeInfo: Partial<IAccountCode>) =>
    dispatch(accountCodesActions.updateAccountCode(accountCodeInfo))
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TFormProps = PropsFromRedux & {
  actionType: TActionType;
  sideForm?: boolean;
  handleClose?: any;
};

const AccountCodeForm: React.FC<TFormProps> = (props) => {
  const {
    actionType,
    sideForm,
    accountCodes,
    phase,
    activeSchool,
    handleClose,
    addAccountCode,
    updateAccountCode
  } = props;
  const { id } = useParams();
  const intl = useTranslation();

  const { showSnackbar } = useSnackbar();
  const [switchChecked, setSwitchChecked] = useState(true);

  const switchHandler = (event) => {
    setSwitchChecked(event.target.checked);
  };
  const accountCodeInfo: IAccountCode = accountCodes.find(
    (g: IAccountCode) => g.id === parseInt(id)
  );

  const initialFormValues: Partial<IAccountCode> = {
    id: (actionType === 'new' && null) || accountCodeInfo?.id || null,
    mainCode: (actionType === 'new' && '') || accountCodeInfo?.mainCode || '',
    subCode1: (actionType === 'new' && '') || accountCodeInfo?.subCode1 || '',
    subCode2: (actionType === 'new' && '') || accountCodeInfo?.subCode2 || '',
    accountName: (actionType === 'new' && '') || accountCodeInfo?.accountName || '',
    explanation: (actionType === 'new' && '') || accountCodeInfo?.explanation || '',
    accountType: (actionType === 'new' && '0') || accountCodeInfo?.accountType || '0'
  };

  const {
    handleSubmit,
    handleChange,
    setFieldValue,
    values,
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
  const validateForm = (values: Partial<IAccountCode>) => {
    const errors: { [key: string]: any } = {};
    const nonEmptyFields = ['mainCode', 'accountType', 'accountName'];

    nonEmptyFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = intl.translate({ id: 'app.cannot_be_empty' });
      }
    });

    return errors;
  };

  const submitForm = (values: Partial<IAccountCode>) => {
    setStatus('submitted');

    setSubmitting(true);

    if (actionType === 'add') {
      const accountCodeAdd: Partial<IAccountCode> = Object.assign(values, {
        school: `/api/schools/${activeSchool.id}`,
        isActive: switchChecked ? '1' : '0'
      });
      addAccountCode(accountCodeAdd);
    } else {
      const accountCodeUpdate: Partial<IAccountCode> = Object.assign(values, {
        isActive: switchChecked ? '1' : '0'
      });
      updateAccountCode(accountCodeUpdate);
    }
  };

  React.useEffect(() => {
    setStatus('notSubmitted');
    if (actionType === 'edit') {
      accountCodeInfo.isActive != '1' ? setSwitchChecked(false) : setSwitchChecked(true);
    }
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
          <Grid item xs={12} md={4}>
            <TextField
              id='mainCode'
              autoFocus
              className={`${errors.mainCode ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.mainCode ? errors.mainCode : ''}
              error={!!errors.mainCode}
              fullWidth={true}
              label={intl.translate({ id: 'account.codes.main_code' })}
              value={values.mainCode}
              variant='outlined'
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              id='subCode1'
              className={`${errors.subCode1 ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.subCode1 ? errors.subCode1 : ''}
              error={!!errors.subCode1}
              fullWidth={true}
              label={intl.translate({ id: 'account.codes.sub_code' }) + ' 1'}
              value={values.subCode1}
              variant='outlined'
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              id='subCode2'
              className={`${errors.subCode2 ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.subCode2 ? errors.subCode2 : ''}
              error={!!errors.subCode2}
              fullWidth={true}
              label={intl.translate({ id: 'account.codes.sub_code' }) + ' 2'}
              value={values.subCode2}
              variant='outlined'
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <TextField
              id='accountType'
              select={true}
              className={`${errors.accountType ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.accountType ? errors.accountType : ''}
              error={!!errors.accountType}
              fullWidth={true}
              label={intl.translate({ id: 'account.type' })}
              value={values.accountType}
              variant='outlined'
              onChange={(event) => setFieldValue('accountType', event.target.value)}
            >
              <MenuItem key='1' value='1' dense={true}>
                {`${intl.translate({ id: 'income' })}`}
              </MenuItem>
              <MenuItem key='2' value='2' dense={true}>
                {`${intl.translate({ id: 'expense' })}`}
              </MenuItem>
              <MenuItem key='3' value='3' dense={true}>
                {`${intl.translate({ id: 'other' })}`}
              </MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={12}>
            <TextField
              id='accountName'
              className={`${errors.accountName ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.accountName ? errors.accountName : ''}
              error={!!errors.accountName}
              fullWidth={true}
              label={intl.translate({ id: 'account.name' })}
              value={values.accountName}
              variant='outlined'
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              id='explanation'
              className={`${errors.explanation ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.explanation ? errors.explanation : ''}
              error={!!errors.explanation}
              fullWidth={true}
              label={intl.translate({ id: 'online.class.description' })}
              value={values.explanation}
              variant='outlined'
              multiline
              rows={3}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={switchChecked}
                  color='primary'
                  disabled={isSubmitting ? true : false}
                  id='isActive'
                  onChange={switchHandler}
                />
              }
              label={intl.translate({ id: 'app.is_active' })}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 0, pt: 2 }}>
          <SaveButton />
          <CancelButton onClick={handleClose} />
        </Box>
      </form>
    </Box>
  );
};

export default connector(AccountCodeForm);
