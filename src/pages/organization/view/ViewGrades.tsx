import React from 'react';
import { useIntl } from 'react-intl';
import { FormHelperText, Box, Grid, Chip, ListItem } from '@mui/material';

import { IGradeLevel } from 'pages/config/grade-levels/grade-types';

type TGradesFormProps = {
  gradeLevels: IGradeLevel[];
  countryCode?: string;
  values?: any;
  errors?: any;
  setFieldValue?: any;
};

const ViewGrades = (props: TGradesFormProps) => {
  const { gradeLevels, countryCode, values, errors, setFieldValue } = props;
  const intl = useIntl();

  const countryTrans = intl.formatMessage({ id: 'app.country' });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}
          component='ul'
        >
          {gradeLevels?.map((grade: IGradeLevel) => {
            const selected = values.grades.length > 0 && values.grades.includes(grade.id);

            return (
              <ListItem key={grade.id} sx={{ mr: 2, mb: 2, width: 'auto', p: 0 }}>
                <Chip
                  clickable={true}
                  color={selected ? 'primary' : 'default'}
                  label={grade.gradeName}
                  variant='outlined'
                  onClick={() => {
                    if (!selected) {
                      const newValue = values.grades;
                      newValue.push(grade.id);
                      setFieldValue('grades', newValue);
                    }
                  }}
                  onDelete={
                    selected
                      ? () =>
                          setFieldValue(
                            'grades',
                            values.grades.filter((n: number) => n !== grade.id)
                          )
                      : undefined
                  }
                />
              </ListItem>
            );
          })}
        </Box>

        {!countryCode && (
          <FormHelperText>
            {intl.formatMessage({ id: 'app.cannot_be_empty_w_name' }, { name: countryTrans })}
          </FormHelperText>
        )}

        {errors['grades'] && <FormHelperText error={true}>{errors['grades']}</FormHelperText>}
      </Grid>
    </Grid>
  );
};

export default ViewGrades;
