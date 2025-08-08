import { IconSearch } from '@tabler/icons-react';
import { InputAdornment, OutlinedInput, SvgIcon, Zoom } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setQuery } from 'store/slices/general';

export const SearchBox = ({ title }) => {
  const { query, transitions } = useSelector((state) => state.general);
  const dispatch = useDispatch();
  const handleTextChange = (event) => {
    dispatch(setQuery(event.target.value));
  };
  return (
    <Zoom
      in={transitions}
      style={{ transitionDelay: '400ms' }}
      {...(transitions ? { timeout: 500 } : {})}
    >
      <OutlinedInput
        value={query}
        onChange={handleTextChange}
        placeholder={'Search ' + title}
        startAdornment={
          <InputAdornment position="start">
            <SvgIcon color="primary" fontSize="small">
              <IconSearch />
            </SvgIcon>
          </InputAdornment>
        }
        sx={{
          height: '3rem',
          width: { xs: '15rem', md: '20rem' },
          borderRadius: '0.5rem',
        }}
      />
    </Zoom>
  );
};
