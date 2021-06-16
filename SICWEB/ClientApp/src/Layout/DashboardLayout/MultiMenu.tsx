import React, {
  useState,
  useRef
} from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  FormControlLabel,
  MenuItem,
  makeStyles,
  Card
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import type { Theme } from 'src/theme';

interface MultiSelectProps {
  label: string;
  onChange?: (value: string[]) => void;
  options: any[];
  value: string[];
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  customMenu: {
    marginTop: 57
  },
  card: {
    position: 'absolute'
  },
  menuItem: {
    padding: 0
  },
  formControlLabel: {
    padding: theme.spacing(0.5, 2),
    width: '100%',
    margin: 0
  }
}));

const MultiSelect: FC<MultiSelectProps> = ({
  label,
  options,
  value,
  onChange
}) => {
  const classes = useStyles();
  const anchorRef = useRef<any>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const handleMenuOpen = (): void => {
    setOpenMenu(true);
  };

  const handleMenuClose = (): void => {
    setOpenMenu(false);
  };

  const handleLeave = (): void => {
    setOpenMenu(false);
  };

  return (
    <div
      onMouseLeave={handleLeave}
    >
      <Button
        onClick={handleMenuOpen}
        onMouseOver={handleMenuOpen}
        ref={anchorRef}
      >
        {label}
        <ArrowDropDownIcon />
      </Button>
      <Card 
        className={classes.card}
        style={{
          display: openMenu ? 'block' : 'none'
        }}
        onMouseLeave={handleMenuClose}
      >
        {options.map((option, index) => (
          <MenuItem
            className={classes.menuItem}
            key={option.menu_c_iid}
            onClick={handleMenuClose}
          >
            <FormControlLabel
              className={classes.formControlLabel}
              control={(
                <></>
              )}
              label={option.menu_c_vnomb}
            />
          </MenuItem>
        ))}
      </Card>      
    </div>
  );
};

MultiSelect.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired
};

export default MultiSelect;
