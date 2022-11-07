import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { TextField, Switch, Grid, FormControlLabel, MenuItem, Divider, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';

import { fontawesomeIcons } from 'data/icons';
import { RootState } from 'store/store';
import { menuActionPhases, menusPhaseSelector } from './_store/menus';
import { TActionType } from 'utils/shared-types';
import { SaveButton } from 'utils/ActionLinks';
import useSnackbar from 'hooks/useSnackbar';
import { IMenu, TMenuType } from 'pages/admin/menus/menu-types';

const mapStateToProps = (state: RootState) => ({
  menusPhase: menusPhaseSelector(state)
});
const connector = connect(mapStateToProps, null);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TMenuFormProps = PropsFromRedux & {
  actionType: TActionType;
  handleClose: any;
  handleSave: any;
  menuInfo?: IMenu;
  menuType?: TMenuType;
  treeData?: IMenu[];
};

const MenuForm = React.forwardRef((props: TMenuFormProps, ref: React.Ref<HTMLFormElement>) => {
  const { menuInfo, menuType, actionType, menusPhase, handleSave, handleClose, treeData } = props;
  const intl = useIntl();
  const { showSnackbar } = useSnackbar();

  const initialFormValues: Partial<IMenu> = {
    title: actionType === 'new' ? '' : menuInfo?.title,
    parent: actionType === 'new' ? '' : menuInfo?.parent,
    icon: actionType === 'new' ? 'folder' : menuInfo?.icon,
    url: actionType === 'new' ? '' : menuInfo?.url,
    appUrl: actionType === 'new' ? '' : menuInfo?.appUrl,
    position: actionType === 'new' ? 0 : menuInfo?.position,
    isActive: actionType === 'new' ? false : menuInfo?.isActive,
    isAdmin: actionType === 'new' ? false : menuInfo?.isAdmin,
    children: actionType === 'new' ? [] : menuInfo?.children
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

  const validateForm = (values: Partial<IMenu>) => {
    const errors: { [key: string]: any } = {};
    const nonEmptyFields = ['title'];

    nonEmptyFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = intl.formatMessage({ id: 'app.cannot_be_empty' });
      }
    });

    return errors;
  };

  const submitForm = (values: Partial<IMenu>) => {
    setStatus('submitted');

    if (values !== initialValues) {
      setSubmitting(true);

      let position = values.position;
      if (actionType === 'new' || values.parent !== initialValues.parent) {
        position = treeData.length;
        if (values.parent !== '') {
          const parentMenuId = values.parent.replace('/menus/', ''); // pull id from /menus/id pattern
          const parentMenu = treeData.find((m) => m.id === parseInt(parentMenuId));
          position = parentMenu.children.length;
        }
      }

      handleSave(actionType, menuInfo?.id || null, menuInfo?.type || menuType, {
        appUrl: values.appUrl,
        isActive: values.isActive || false,
        isAdmin: values.isAdmin || false,
        icon: values.icon,
        iconPrefix: menuInfo?.iconPrefix || 'fad',
        parent: values.parent || null,
        position: position,
        title: values.title,
        type: menuType,
        url: values.url
      });
    }
  };

  React.useEffect(() => {
    setStatus('notSubmitted');
  }, []);

  React.useEffect(() => {
    setSubmitting(false);

    if (status === 'submitted' && menusPhase === menuActionPhases.MENU_ACTION_SUCCESSFUL) {
      handleClose();

      showSnackbar({
        message: intl.formatMessage({
          id:
            actionType === 'new'
              ? 'menu.added'
              : actionType === 'edit'
              ? 'menu.updated'
              : 'menu.deleted'
        }),
        open: true
      });
    }
  }, [status, menusPhase, setSubmitting, handleClose]);

  return (
    <div style={{ display: actionType === 'delete' ? 'none' : 'flex' }}>
      <form ref={ref} className='form' noValidate={true} autoComplete='off' onSubmit={handleSubmit}>
        <Grid sx={{ paddingBottom: 3 }} container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              onChange={(event) => setFieldValue('parent', event.target.value)}
              className={`${errors.parent ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors?.parent || ''}
              error={!!errors.parent}
              fullWidth={true}
              id='parent'
              label={intl.formatMessage({ id: 'menu.parent' })}
              margin='normal'
              size='small'
              value={values.parent}
              variant='filled'
            >
              <MenuItem value=''>---</MenuItem>
              {treeData?.length > 0 &&
                treeData.map((menu: IMenu) => (
                  <MenuItem key={menu.id} value={`/menus/${menu.id}`}>
                    <FontAwesomeIcon
                      icon={[menu.iconPrefix, menu.icon]}
                      style={{ width: 16, marginRight: 8 }}
                    />
                    <FormattedMessage id={menu.title} />
                  </MenuItem>
                ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              disabled={true}
              fullWidth={true}
              id='type'
              label='Type'
              margin='normal'
              size='small'
              value={menuType}
              variant='filled'
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              className={`${errors.title ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.title ? errors.title : ''}
              error={!!errors.title}
              fullWidth={true}
              id='title'
              label={intl.formatMessage({ id: 'menu.title' })}
              margin='normal'
              onChange={handleChange}
              size='small'
              value={values.title}
              variant='filled'
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              className={`${errors.icon ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.icon ? errors.icon : ''}
              fullWidth={true}
              id='icon'
              label={intl.formatMessage({ id: 'menu.icon' })}
              margin='normal'
              onChange={(event) => setFieldValue('icon', event.target.value)}
              size='small'
              value={values.icon}
              variant='filled'
            >
              {fontawesomeIcons.map((icon, index) => (
                <MenuItem
                  key={index}
                  value={icon}
                  dense={true}
                  sx={{ '> svg.menu-form-icon': { width: 32 } }}
                >
                  <FontAwesomeIcon className='menu-form-icon' icon={['fad', icon]} />
                  {icon}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              className={`${errors.url ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.url ? errors.url : ''}
              fullWidth={true}
              id='url'
              label='URL'
              margin='normal'
              onChange={handleChange}
              size='small'
              value={values?.url || ''}
              variant='filled'
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              className={`${errors.appUrl ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.appUrl ? errors.appUrl : ''}
              fullWidth={true}
              id='appUrl'
              label='App URL'
              margin='normal'
              onChange={handleChange}
              size='small'
              value={values?.appUrl || ''}
              variant='filled'
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={values.isActive}
                  color='primary'
                  disabled={isSubmitting ? true : false}
                  id='isActive'
                  onChange={(event) => setFieldValue('isActive', event.target.checked)}
                />
              }
              label={intl.formatMessage({ id: 'menu.is_active' })}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={values.isAdmin}
                  color='primary'
                  disabled={isSubmitting ? true : false}
                  id='isAdmin'
                  onChange={(event) => setFieldValue('isAdmin', event.target.checked)}
                />
              }
              label={intl.formatMessage({ id: 'menu.is_admin' })}
            />
          </Grid>
        </Grid>

        <Divider sx={{ mx: -2 }} />

        <Box sx={{ p: 0, pt: 2 }}>
          <SaveButton mode={menusPhase.endsWith('ing') ? 'saving' : ''} />
        </Box>
      </form>
    </div>
  );
});

export default connector(MenuForm);
