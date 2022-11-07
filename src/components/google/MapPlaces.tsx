import React from 'react';
import throttle from 'lodash/throttle';
import parse from 'autosuggest-highlight/parse';
import { Autocomplete, Box, Grid, TextField, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import useTranslation from 'hooks/useTranslation';

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings: readonly MainTextMatchedSubstrings[];
}
export interface PlaceType {
  description: string;
  structured_formatting?: StructuredFormatting;
}
interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}
export interface Place {
  address_components?: AddressComponent[];
  formatted_address?: string;
}

type TMapPlacesProps = {
  address?: string;
  handleChange?: (place?: Place) => void;
};

const autocompleteService = { current: null };

/**
 * while using this component,
 * do not forget to add google api script url in parent component with Helmet
 */
const MapPlaces = (props: TMapPlacesProps) => {
  const { address, handleChange } = props;
  const intl = useTranslation();
  const [value, setValue] = React.useState<PlaceType | null>({ description: address });
  const [inputValue, setInputValue] = React.useState<string>('');
  const [options, setOptions] = React.useState<readonly PlaceType[]>([]);

  const googleMap = (address: string) => {
    if (!address) {
      return;
    }
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, _status) => {
      if (results) {
        const place = results[0];
        const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
          center: {
            lat: place.geometry?.location.lat(),
            lng: place.geometry?.location.lng()
          },
          zoom: 15
        });

        new google.maps.Marker({
          map,
          position: place.geometry?.location
        });

        map.setCenter(place.geometry?.location);

        // Set address details
        handleChange(place as Place);
      }
    });
  };

  const fetch = React.useMemo(
    () =>
      throttle((request: { input: string }, callback: (results?: readonly PlaceType[]) => void) => {
        (autocompleteService.current as any).getPlacePredictions(request, callback);
      }, 200),
    []
  );

  const handleAddressChange = (newValue: PlaceType | null) => {
    if (newValue) {
      googleMap(newValue?.description);
    }
  };

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && (window as any).google) {
      autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results?: readonly PlaceType[]) => {
      if (active) {
        let newOptions: readonly PlaceType[] = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  React.useEffect(() => {
    let geoLocation = null;
    if (address) {
      googleMap(address);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        geoLocation = { lat: position.coords.latitude, lng: position.coords.longitude };

        new google.maps.Map(document.getElementById('map') as HTMLElement, {
          center: geoLocation,
          zoom: 11
        });
      });
    }
  }, []);

  return (
    <Box>
      <Grid container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ height: 400, width: '100%' }} id='map' />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              id='google-map-address'
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.description
              }
              filterOptions={(x) => x}
              options={options}
              autoComplete
              includeInputInList
              filterSelectedOptions
              value={value}
              onChange={(event: any, newValue: PlaceType | null) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
                handleAddressChange(newValue);
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={intl.translate({ id: 'school.address' })}
                  fullWidth
                  value={options?.find((o) => o.description?.includes(value?.description))}
                />
              )}
              renderOption={(props, option) => {
                const matches = option.structured_formatting?.main_text_matched_substrings;
                const parts =
                  matches &&
                  parse(
                    option.structured_formatting?.main_text,
                    matches?.map((match: any) => [match.offset, match.offset + match.length])
                  );

                return (
                  <li {...props}>
                    <Grid container alignItems='center'>
                      <Grid item>
                        <Box component={LocationOnIcon} sx={{ color: 'text.secondary', mr: 2 }} />
                      </Grid>
                      <Grid item xs>
                        {parts?.map((part: any, index: number) => (
                          <span
                            key={index}
                            style={{
                              fontWeight: part.highlight ? 700 : 400
                            }}
                          >
                            {part.text}
                          </span>
                        ))}
                        <Typography variant='body2' color='text.secondary'>
                          {option?.structured_formatting?.secondary_text}
                        </Typography>
                      </Grid>
                    </Grid>
                  </li>
                );
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MapPlaces;
