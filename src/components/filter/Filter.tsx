import React from 'react';
import { useIntl } from 'react-intl';
import { Box, Card, Checkbox, Chip, Divider, FormControlLabel, Input } from '@mui/material';
import { Search } from '@mui/icons-material';
import MultiSelect from './MultiSelect';

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250
//     }
//   }
// };
export interface IFilter {
  id: string;
  title: string;
  translate?: boolean;
}
export interface IFilterOptions {
  label: string;
  filters: IFilter[];
}

type TFilterProps = {
  search?: boolean;
  searchTitle?: string;
  filters?: IFilter[];
  filterOptions?: IFilterOptions[];
  filterChecks?: IFilterOptions[];
  setFilters?: (filter: IFilter[]) => void;
};

const Filter = (props: TFilterProps) => {
  const { search = true, searchTitle, filterOptions, filterChecks, filters, setFilters } = props;
  const intl = useIntl();
  const [inputValue, setInputValue] = React.useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
  };

  const handleInputKeyup = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.code === 'Enter' && inputValue) {
      setFilters([...filters, { id: `search:${inputValue}`, title: inputValue }]);
      setInputValue('');
    }
  };

  const handleChipDelete = (chip: IFilter): void => {
    setFilters(filters.filter((f) => chip.id !== f.id));
  };

  const handleMultiSelectChange = (value: IFilter[]): void => {
    setFilters(value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentFilters = [...filters];
    if (filters?.map((c) => c.id).includes(event.target.value)) {
      setFilters(filters.filter((f) => f.id !== event.target.value));
    } else {
      setFilters([
        ...currentFilters,
        { id: event.target.value, title: event.target.getAttribute('name') }
      ]);
    }
  };

  return (
    <Card>
      {search && (
        <React.Fragment>
          <Box sx={{ alignItems: 'center', display: 'flex', p: 2 }}>
            <Search fontSize='small' />
            <Box sx={{ flexGrow: 1, ml: 3 }}>
              <Input
                disableUnderline
                fullWidth
                onChange={handleInputChange}
                onKeyUp={handleInputKeyup}
                placeholder={intl.formatMessage({ id: searchTitle || 'app.search' })}
                value={inputValue}
              />
            </Box>
          </Box>
          <Divider />
        </React.Fragment>
      )}

      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          minHeight: 64,
          p: 1
        }}
      >
        {filters?.map((chip) => (
          <Chip
            key={chip.id}
            label={chip.translate ? intl.formatMessage({ id: chip.title }) : chip.title}
            onDelete={(): void => handleChipDelete(chip)}
            sx={{ m: 1 }}
            variant='outlined'
          />
        ))}
      </Box>

      <Divider />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          p: 1
        }}
      >
        {filterOptions?.map((option) => (
          // <FormControl key={option.label} sx={{ minWidth: 150, maxWidth: 200, m: 1 }}>
          //   <InputLabel id={option.label}>{option.label}</InputLabel>
          //   <Select
          //     id={option.label}
          //     multiple
          //     value={filters.filter((c) => option.options.includes(c))}
          //     input={<OutlinedInput label={option.label} />}
          //     renderValue={(selected) => selected.join(', ')}
          //     onChange={(event) => handleMultiSelectChange(event, option.options)}
          //     MenuProps={MenuProps}>
          //     {option.options.map((option) => (
          //       <MenuItem key={option} value={option}>
          //         <Checkbox checked={filters.includes(option)} />
          //         <ListItemText primary={option} />
          //       </MenuItem>
          //     ))}
          //   </Select>
          // </FormControl>
          <MultiSelect
            key={option.label}
            label={option.label}
            onChange={handleMultiSelectChange}
            filters={option.filters}
            value={filters}
          />
        ))}
        <Box sx={{ flexGrow: 1 }} />
        {filterChecks?.map((check) => {
          const checkProps = check.filters.at(0);

          return (
            <FormControlLabel
              key={check.label}
              control={
                <Checkbox
                  color='primary'
                  value={checkProps.id}
                  name={checkProps.title}
                  checked={filters?.map((c) => c.id).includes(checkProps.id)}
                  onChange={handleCheckboxChange}
                />
              }
              label={checkProps.title}
            />
          );
        })}
      </Box>
    </Card>
  );
};

export default Filter;
