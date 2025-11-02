import React, { useState, useRef, useEffect } from 'react';
import {
  CustomTooltip,
  styled,
  TextField,
  IconButton,
  ClickAwayListener,
  CloseIcon,
  SearchIcon,
  useTheme,
} from '@sistent/sistent';
import debounce from './debounce';


const SearchContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
});


const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: theme.palette.icon.secondary,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.icon.secondary,
    '&:hover': {
      borderColor: '#00b39f',
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.icon.secondary,
  },
  '& .MuiInputBase-input': {
    color: theme.palette.icon.secondary,
    caretColor: theme.palette.icon.secondary,
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: theme.palette.icon.secondary,
  },
  '& .MuiInput-underline:hover:before': {
    borderBottomColor: '#00b39f',
  },
  '& .MuiInput-underline:hover:after': {
    borderBottomColor: '#00b39f',
  },
  '& .MuiInput-underline.Mui-focused:before': {
    borderBottomColor: '#00b39f',
  },
  '& .MuiInput-underline.Mui-focused:after': {
    borderBottomColor: '#00b39f',
  },
}));


const SearchBar = ({
  onSearch,
  placeholder,
  expanded,
  setExpanded,
  value = '',
  setModelsFilters,
}) => {
  const [searchText, setSearchText] = useState(value);
  const searchRef = useRef(null);
  const debouncedFunctionRef = useRef(null);

  // Sync searchText when value prop changes (from URL or parent)
  useEffect(() => {
    if (value !== searchText) {
      setSearchText(value);
    }
  }, [value]);

  // Create debounced function
  useEffect(() => {
    debouncedFunctionRef.current = debounce((text) => {
      if (onSearch) {
        onSearch(text);
      }
    }, 500);
  }, [onSearch]);

  const handleSearchChange = (event) => {
    const newValue = event.target.value;
    setSearchText(newValue);
    if (debouncedFunctionRef.current) {
      debouncedFunctionRef.current(newValue);
    }
  };

  const handleClearIconClick = () => {
    // Reset all state
    setModelsFilters({ page: 0 });
    setSearchText('');
    setExpanded(false);
    
    // Cancel any pending debounced calls
    if (debouncedFunctionRef.current) {
      debouncedFunctionRef.current.cancel?.();
    }
    
    // Call onSearch with empty string
    if (onSearch) {
      onSearch('');
    }
  };

  const handleSearchIconClick = () => {
    if (expanded) {
      handleClearIconClick();
    } else {
      setExpanded(true);
      setTimeout(() => {
        searchRef.current?.focus();
      }, 300);
    }
  };

  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
  let searchWidth = '12.5rem';
  if (width <= 750) {
    searchWidth = '7.5rem';
  }
  const theme = useTheme();
  return (
    <SearchContainer>
      <SearchTextField
        id="searchClick"
        variant="standard"
        value={searchText}
        onChange={handleSearchChange}
        inputRef={searchRef}
        placeholder={placeholder}
        style={{
          width: expanded ? searchWidth : '0',
          opacity: expanded ? 1 : 0,
          transition: 'width 0.3s ease, opacity 0.3s ease',
        }}
      />

      {expanded ? (
        <ClickAwayListener
          onClickAway={(event) => {
            const isTable = event.target.closest('#ref');

            // Close search bar when clicking away
            // Remove the searchText !== '' condition that was blocking the close
            if (isTable) {
              handleClearIconClick();
            } else {
              // Close without clearing if clicking elsewhere
              setExpanded(false);
            }
          }}
        >
          <CustomTooltip title="Close">
            <IconButton onClick={handleClearIconClick}>
              <CloseIcon fill={theme.palette.icon.secondary} height={'1.5rem'} width={'1.5rem'} />
            </IconButton>
          </CustomTooltip>
        </ClickAwayListener>
      ) : (
        <CustomTooltip title="Search">
          <IconButton onClick={handleSearchIconClick} data-testid="search-icon">
            <SearchIcon fill={theme.palette.icon.secondary} height={'1.5rem'} width={'1.5rem'} />
          </IconButton>
        </CustomTooltip>
      )}
    </SearchContainer>
  );
};

export default SearchBar;
