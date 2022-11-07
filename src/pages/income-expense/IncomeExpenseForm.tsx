import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useParams } from 'react-router';
import { useFormik } from 'formik';
import { Autocomplete, Box, Grid, TextField } from '@mui/material';
import { AppDispatch, RootState } from 'store/store';
import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import { SaveButton, CancelButton, FormButtons } from 'utils/ActionLinks';
import { TActionType } from 'utils/shared-types';
import { userActiveSchoolSelector, userActiveSeasonSelector } from 'store/user';
import {
  IAccountCode,
  IincomeExpense,
  incomeExpensesActions,
  incomeExpensesPhaseSelector,
  incomeExpensesSelector
} from './_store/income-expense';
import { ISchool } from 'pages/organization/organization-types';
import {
  accountCodesActions,
  accountCodesSelector
} from 'pages/account-codes/_store/account-codes';
import { DateTimePicker } from '@mui/x-date-pickers';

const mapStateToProps = (state: RootState) => ({
  activeSchool: userActiveSchoolSelector(state),
  activeSeason: userActiveSeasonSelector(state),
  incomeExpenses: incomeExpensesSelector(state),
  accountCodes: accountCodesSelector(state),
  phase: incomeExpensesPhaseSelector(state)
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addIncomeExpense: (incomeExpenseInfo: Partial<IincomeExpense>) =>
    dispatch(incomeExpensesActions.addIncomeExpense(incomeExpenseInfo)),
  updateIncomeExpense: (incomeExpenseInfo: Partial<IincomeExpense>) =>
    dispatch(incomeExpensesActions.updateIncomeExpense(incomeExpenseInfo)),
  pullAccountCodes: (activeSchool: ISchool) =>
    dispatch(accountCodesActions.pullAccountCodes(activeSchool))
});
const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type TFormProps = PropsFromRedux & {
  actionType: TActionType;
  sideForm?: boolean;
  handleClose?: any;
};

const IncomeExpenseForm: React.FC<TFormProps> = (props) => {
  const {
    actionType,
    sideForm,
    incomeExpenses,
    phase,
    activeSchool,
    activeSeason,
    handleClose,
    accountCodes,
    pullAccountCodes,
    addIncomeExpense,
    updateIncomeExpense
  } = props;

  const { id } = useParams();

  const intl = useTranslation();
  const { showSnackbar } = useSnackbar();

  const incomExpenseInfo: IincomeExpense = incomeExpenses.find(
    (g: IincomeExpense) => g.id === parseInt(id)
  );

  const timeNow = new Date();
  const initialFormValues: Partial<IincomeExpense> = {
    id: (actionType === 'new' && null) || incomExpenseInfo?.id || null,
    accountCodeId: (actionType === 'new' && 0) || incomExpenseInfo?.accountCodeId || 0,
    institutionTitle: (actionType === 'new' && '') || incomExpenseInfo?.institutionTitle || '',
    addedAt: (actionType === 'new' && timeNow) || incomExpenseInfo?.addedAt || timeNow,
    amount: (actionType === 'new' && 0) || incomExpenseInfo?.amount || 0,
    explanation: (actionType === 'new' && '') || incomExpenseInfo?.explanation || ''
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
  const validateForm = (values: Partial<IincomeExpense>) => {
    const errors: { [key: string]: any } = {};
    const nonEmptyFields = ['institutionTitle', 'amount'];

    nonEmptyFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = intl.translate({ id: 'app.cannot_be_empty' });
      }
    });

    return errors;
  };

  const submitForm = (values: Partial<IincomeExpense>) => {
    setStatus('submitted');
    console.log('test');

    setSubmitting(true);

    if (actionType === 'add') {
      const accountCodeAdd: Partial<IincomeExpense> = Object.assign(values, {
        school: `/api/schools/${activeSchool.id}`,
        season: `/api/seasons/${activeSeason.id}`
      });
      addIncomeExpense(accountCodeAdd);
    } else {
      updateIncomeExpense(values);
    }
  };

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

  React.useEffect(() => {
    pullAccountCodes(activeSchool);
  }, []);

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
          <Grid item xs={12} md={6}>
            <Autocomplete
              id='accountCodeId'
              options={accountCodes || []}
              autoHighlight
              fullWidth
              value={accountCodes?.find((p) => p.id === values.accountCodeId)}
              onChange={(_e, value: IAccountCode) => setFieldValue('accountCodeId', value?.id)}
              getOptionLabel={(option: IAccountCode) => option.accountName}
              renderOption={(props, option: IAccountCode) => (
                <li {...props}>{option.accountName}</li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className={`${
                    errors.accountCodeId ? 'is-invalid' : isSubmitting ? 'is-valid' : ''
                  }`}
                  disabled={isSubmitting ? true : false}
                  helperText={errors.accountCodeId || ''}
                  label={intl.translate({ id: 'account.code' })}
                  variant='outlined'
                  fullWidth
                  margin='normal'
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password' // disable autocomplete and autofill
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DateTimePicker
              label={intl.translate({ id: 'app.date' })}
              value={values.addedAt}
              onChange={(value) => setFieldValue('addedAt', value)}
              renderInput={(params) => <TextField id='addedAt' fullWidth {...params} />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id='institutionTitle'
              className={`${
                errors.institutionTitle ? 'is-invalid' : isSubmitting ? 'is-valid' : ''
              }`}
              disabled={isSubmitting ? true : false}
              helperText={errors.institutionTitle ? errors.institutionTitle : ''}
              error={!!errors.institutionTitle}
              fullWidth={true}
              label={intl.translate({ id: 'name_surname_title' })}
              value={values.institutionTitle}
              variant='outlined'
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id='amount'
              className={`${errors.amount ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.amount ? errors.amount : ''}
              error={!!errors.amount}
              fullWidth={true}
              label={intl.translate({ id: 'app.amount' })}
              value={values.amount}
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
        </Grid>
        <FormButtons
          saveButton={
            <SaveButton
              disabled={values === initialValues || isSubmitting}
              mode={isSubmitting && 'saving'}
            />
          }
          cancelButton={<CancelButton onClick={handleClose} />}
        />
      </form>
    </Box>
  );
};

export default connector(IncomeExpenseForm);
