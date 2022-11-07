import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Paper,
  TextField
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDoubleLeft,
  faChevronDoubleRight,
  faChevronLeft,
  faChevronRight,
  faCopy
} from '@fortawesome/pro-duotone-svg-icons';

import { AppDispatch, RootState } from 'store/store';
import { i18nLangSelector } from 'store/i18n';
import { configActions, configPhaseSelector, seasonsSelector } from 'store/config';
import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import { SaveButton } from 'utils/ActionLinks';
import { TLang } from 'utils/shared-types';
import ConfirmDialog from 'components/ConfirmDialog';

export interface ISeasonTable {
  name: string;
  title: string;
}

function not(a: readonly ISeasonTable[], b: readonly ISeasonTable[]) {
  return a?.filter((av) => b?.find((bv) => av.name != bv.name));
}

function intersection(a: readonly ISeasonTable[], b: readonly ISeasonTable[]) {
  return a?.filter((av) => b?.find((bv) => av.name === bv.name));
}

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  seasons: seasonsSelector(state),
  configPhase: configPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  copySelectedData: (
    lang: TLang,
    sourceDb: string,
    destinationDb: string,
    dataTables: ISeasonTable[]
  ) => dispatch(configActions.copySeasonData(lang, sourceDb, destinationDb, dataTables)),
  resetPhase: () => dispatch(configActions.setPhase(null))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TCopySeasonDataProps = PropsFromRedux & {
  handleClose?: () => void;
};

const CopySeasonData = (props: TCopySeasonDataProps) => {
  const { lang, seasons, configPhase, copySelectedData, resetPhase, handleClose } = props;
  const [isSubmitted, setSubmitted] = React.useState<boolean>(false);
  const [source, setSource] = React.useState<string>(null);
  const [destination, setDestination] = React.useState<string>(null);
  const [checked, setChecked] = React.useState<readonly ISeasonTable[]>([]);
  const [left, setLeft] = React.useState<readonly ISeasonTable[]>([]);
  const [right, setRight] = React.useState<ISeasonTable[]>([]);
  const [error, setError] = React.useState<string>(null);
  const intl = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

  const tablesToCopy: ISeasonTable[] = [
    {
      name: 'ders_saatleri',
      title: intl.translate({ id: 'settings.class_hours' })
    },
    {
      name: 'derslikler',
      title: intl.translate({ id: 'erp.classrooms' })
    },
    {
      name: 'ogrenci_ucretleri',
      title: intl.translate({ id: 'erp.courses' })
    },
    {
      name: 'batches',
      title: intl.translate({ id: 'batches' })
    },
    {
      name: 'classes',
      title: intl.translate({ id: 'classes' })
    },
    {
      name: 'ogrenciler',
      title: intl.translate({ id: 'school.students' })
    },
    {
      name: 'personel',
      title: intl.translate({ id: 'personnel' })
    },
    {
      name: 'kayit_sozlesmeleri',
      title: intl.translate({ id: 'settings.enrollment_contracts' })
    }
  ];

  const transSource = intl.translate({ id: 'season.copy.source' });
  const transDestination = intl.translate({ id: 'season.copy.destination' });
  const transSelectedData = intl.translate({ id: 'season.copy.selected_data' });

  const handleCloseConfirm = () => {
    setShowConfirmDialog(false);
  };

  const copyData = () => {
    setSubmitted(true);
    setShowConfirmDialog(false);

    copySelectedData(lang, source, destination, right);
  };

  const validate = () => {
    if (right.length === 0) {
      setError(intl.translate({ id: 'app.cannot_be_empty_w_name' }, { name: transSelectedData }));
      return;
    }
    if (!destination) {
      setError(intl.translate({ id: 'app.cannot_be_empty_w_name' }, { name: transDestination }));
      return;
    }
    if (source === destination) {
      setError(intl.translate({ id: 'season.copy.source_destionation_same' }));
      return;
    }
    if (!source) {
      setError(intl.translate({ id: 'app.cannot_be_empty_w_name' }, { name: transSource }));
      return;
    }
    setError(null);
  };

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (item: ISeasonTable) => () => {
    console.log(item);
    const currentIndex = checked.findIndex((c) => c.name === item.name);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(item);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const changeSource = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSource(event.target.value);
  };

  const changeDestination = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDestination(event.target.value);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
    setChecked([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked([]);
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked([]);
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
    setChecked([]);
  };

  const customList = (items: readonly ISeasonTable[]) => (
    <Paper sx={{ p: 1, width: '100%', height: 350, overflow: 'auto' }}>
      <FormGroup>
        {items?.map((item) => (
          <FormControlLabel
            key={item.name}
            control={
              <Checkbox
                value={item.name}
                name={item.name}
                color='primary'
                checked={checked?.some((c: ISeasonTable) => c.name === item.name)}
                onChange={handleToggle(item)}
              />
            }
            label={item.title}
          />
        ))}
      </FormGroup>
    </Paper>
  );

  React.useEffect(() => {
    if (isSubmitted && configPhase === 'success') {
      showSnackbar({
        message: intl.translate({ id: 'app.saved' }),
        open: true
      });

      if (handleClose) {
        setTimeout(() => {
          handleClose();
        }, 500);
      }
    }
  }, [configPhase]);

  React.useEffect(() => {
    if (isSubmitted) {
      validate();
    }
  }, [isSubmitted, source, destination, left, right]);

  React.useEffect(() => {
    resetPhase();
    setLeft(tablesToCopy);
  }, []);

  return (
    <Grid container spacing={2} justifyContent='center' alignItems='center'>
      <Grid item container xs={12}>
        <Alert sx={{ width: '100%' }} severity='error'>
          {intl.translate({ id: 'season.copy.data.warning' })}
        </Alert>
      </Grid>

      <Grid item xs={5}>
        <TextField
          id='source'
          name='source'
          variant='outlined'
          label={transSource}
          value={source}
          select
          fullWidth
          onChange={changeSource}
        >
          {seasons?.map((season) => (
            <MenuItem key={season.id} value={season.database}>
              {season.title}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button disabled>
          <FontAwesomeIcon icon={faChevronDoubleRight} />
        </Button>
      </Grid>
      <Grid item xs={5}>
        <TextField
          id='destination'
          name='destination'
          variant='outlined'
          label={transDestination}
          value={destination}
          select
          fullWidth
          onChange={changeDestination}
        >
          {seasons?.map((season) => (
            <MenuItem key={season.id} value={season.database}>
              {season.title}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={5}>
        {customList(tablesToCopy)}
      </Grid>
      <Grid item xs={2} container direction='column' alignItems='center'>
        <Button
          sx={{ my: 0.5, py: 1 }}
          variant='outlined'
          size='small'
          onClick={handleAllRight}
          disabled={left?.length === 0}
          aria-label='move all right'
        >
          <FontAwesomeIcon icon={faChevronDoubleRight} />
        </Button>
        <Button
          sx={{ my: 0.5, py: 1 }}
          variant='outlined'
          size='small'
          onClick={handleCheckedRight}
          disabled={leftChecked?.length === 0}
          aria-label='move selected right'
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
        <Button
          sx={{ my: 0.5, py: 1 }}
          variant='outlined'
          size='small'
          onClick={handleCheckedLeft}
          disabled={rightChecked?.length === 0}
          aria-label='move selected left'
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <Button
          sx={{ my: 0.5, py: 1 }}
          variant='outlined'
          size='small'
          onClick={handleAllLeft}
          disabled={right?.length === 0}
          aria-label='move all left'
        >
          <FontAwesomeIcon icon={faChevronDoubleLeft} />
        </Button>
      </Grid>
      <Grid item xs={5}>
        {customList(right)}
      </Grid>

      {error && (
        <Grid item container xs={12}>
          <Alert sx={{ width: '100%' }} severity='error'>
            {error}
          </Alert>
        </Grid>
      )}

      <Grid item container xs={12} direction='column' alignItems='center'>
        <SaveButton
          text='app.copy'
          mode={configPhase?.includes('ing') && 'saving'}
          modeText='app.copying'
          startIcon={<FontAwesomeIcon icon={faCopy} />}
          buttonType='button'
          disabled={!source || !destination || source === destination || right.length === 0}
          onClick={() => setShowConfirmDialog(true)}
        />
      </Grid>

      <ConfirmDialog
        title={intl.translate({ id: 'app.copy' })}
        confirmBtnText={intl.translate({ id: 'app.copy' })}
        intro={intl.translate({ id: 'season.copy.data.warning' })}
        handleClose={handleCloseConfirm}
        handleConfirm={copyData}
        isOpen={showConfirmDialog}
        phase={configPhase}
      />
    </Grid>
  );
};

export default connector(CopySeasonData);
