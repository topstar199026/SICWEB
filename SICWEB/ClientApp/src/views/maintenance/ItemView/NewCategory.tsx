import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  FormControlLabel,
  FormHelperText,
  Switch,
  SvgIcon,
  makeStyles,
  Grid
} from '@material-ui/core';
import SaveIcon3 from '@material-ui/icons/Save';
import { Trash as TrashIcon } from 'react-feather';
import type { Theme } from 'src/theme';
import type { Event } from 'src/types/calendar';
import { useDispatch } from 'src/store';
import {saveFamily, saveSubFamily} from 'src/apis/itemApi';

interface NewCategoryProps {
    families?: any[],
    subFamilies?: any[],
    units?: any[],
    event?: Event;
    _getInitialData?: () => void;
    onAddComplete?: () => void;
    onCancel?: () => void;
    onDeleteComplete?: () => void;
    onEditComplete?: () => void;
    range?: { start: number, end: number };
}

const getInitialValues = (event?: Event, range?: { start: number, end: number; }) => {
  if (event) {
    return _.merge({}, {
      allDay: false,
      color: '',
      description: '',
      end: new Date(),
      start: new Date(),
      title: '',
      submit: null
    }, event);
  }

  if (range) {
    return _.merge({}, {
      allDay: false,
      color: '',
      description: '',
      end: new Date(range.end),
      start: new Date(range.start),
      title: '',
      submit: null
    }, event);
  }

  return {
    allDay: false,
    color: '',
    description: '',
    end: new Date(),
    start: new Date(),
    title: '',
    submit: null
  };
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  confirmButton: {
    marginLeft: theme.spacing(2)
  }
}));

const NewCategory: FC<NewCategoryProps> = ({
  families,
  subFamilies,
  units,
  event,
  _getInitialData,
  onAddComplete,
  onCancel,
  onDeleteComplete,
  onEditComplete,
  range
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [selectedFamily, setSelectedFamily] = useState('-1');

  const [_unit, set_Unit] = useState(null);
  const [_unitE, set_UnitE] = useState(false);
  const [_family, set_Family] = useState(null);
  const [_familyE, set_FamilyE] = useState(false);
  const [_subFamily, set_SubFamily] = useState(null);
  const [_subFamilyE, set_SubFamilyE] = useState(false);

  const [_enableFmaily, set__EnableFmaily] = useState(true);
  const [_enableSubFmaily, set__EnableSubFmaily] = useState(false);

  useEffect(() => {
    if(selectedFamily === "-1") set__EnableSubFmaily(false);
    else set__EnableSubFmaily(true);

    console.log('selectedFamily', selectedFamily)
  }, [selectedFamily]) 

  const _set_Family =(e) => {
    set_Family(e);
    if(e === null || e === '')
      set_FamilyE(true)
    else
      set_FamilyE(false)
  }
  
  const __saveFamily = () => {
    if(!_familyE) {
      saveFamily(_family).then(res => {
        _getInitialData();
      });
    }
  }


  const _set_SubFamily =(e) => {
    set_SubFamily(e);
    if(e === null || e === '')
      set_SubFamilyE(true)
    else
      set_SubFamilyE(false)
  }

  const __saveSubFamily = () => {
    if(!_subFamilyE) {
      saveSubFamily(selectedFamily, _subFamily).then(res => {
        _getInitialData();
      });
    }
  }
  
  const isCreating = !event;

  const handleDelete = async (): Promise<void> => {
    try {
      onDeleteComplete();
    } catch (err) {
      console.error(err);
    }
  };

  return (
        <>
          <Box p={3}>
            <Typography
              align="center"
              gutterBottom
              variant="h4"
              color="textPrimary"
            >
              {isCreating ? 'Agregar ítem nuevo' : 'Agregar ítem nuevo'}
            </Typography>
          </Box>
          <Box p={3}>    
            <Grid container spacing={3}>
              <Grid item lg={6} sm={6} xs={12}>
                  <TextField
                      size="small"
                      label="Unidad de Medida"
                      name="availability"
                      fullWidth
                      SelectProps={{ native: true }}
                      select
                      variant="outlined"
                      >
                      <option disabled selected key="-1" value="-1">{'-- Seleccionar --'}</option>
                      {units.map((unit) => (
                          <option
                          key={unit.und_c_yid}
                          value={unit.und_c_yid}
                          >
                          {unit.und_c_vdesc}
                          </option>
                      ))}
                  </TextField>
              </Grid>
              <Grid item lg={6} sm={6} xs={12} style={{display: 'flex'}}>  
                <TextField
                    size="small"
                    fullWidth
                    label="Agregar Unidad de Medida"
                    name="unit"
                    onChange={(e) => set_Unit(e.target.value)}
                    value={_unit}
                    variant="outlined"
                />       
                <IconButton size="small" color="secondary" aria-label="add to shopping cart">
                    <SaveIcon3 />
                </IconButton>             
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item lg={6} sm={6} xs={12}>
                  <TextField
                      size="small"
                      label="Familias"
                      name="availability"
                      fullWidth
                      SelectProps={{ native: true }}
                      select
                      variant="outlined"
                      value={selectedFamily}
                      onChange={(e) => 
                        //console.log(e.target.value)
                        setSelectedFamily(e.target.value + '')
                      }
                    >
                      <option selected key="-1" value="-1">{'-- Seleccionar --'}</option>
                      {families.map((family) => (
                          <option
                          key={family.ifm_c_iid}
                          value={family.ifm_c_iid}
                          >
                          {family.ifm_c_des}
                          </option>
                      ))}
                  </TextField>
              </Grid>
              <Grid item lg={6} sm={6} xs={12} style={{display: 'flex'}}> 
                <TextField
                    size="small"
                    fullWidth
                    label="Agregar Familia"
                    name="description"
                    onChange={(e)=>_set_Family(e.target.value)}
                    value={_family}
                    variant="outlined"
                    error={_familyE}
                />       
                <IconButton 
                  size="small" 
                  color="secondary" 
                  aria-label="add to shopping cart"
                  onClick={() => __saveFamily()}
                >
                    <SaveIcon3 />
                </IconButton>             
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item lg={6} sm={6} xs={12}>
                  <TextField
                    size="small"
                    label="SubFamilia"
                    name="availability"
                    fullWidth
                    SelectProps={{ native: true }}
                    select
                    variant="outlined"
                  >
                      <option disabled  selected key="-1" value="-1">{'-- Seleccionar --'}</option>
                      {subFamilies.map((subFamily) => (
                          <option
                          key={subFamily.isf_c_iid}
                          value={subFamily.isf_c_iid}
                          >
                          {subFamily.isf_c_vdesc}
                          </option>
                      ))}
                  </TextField>
              </Grid>
              <Grid item lg={6} sm={6} xs={12} style={{display: 'flex'}}>  
                <TextField
                    disabled={!_enableSubFmaily}
                    size="small"
                    fullWidth
                    label="	Agregar SubFamilia"
                    name="description"
                    onChange={(e) => _set_SubFamily(e.target.value)}
                    value={_subFamily}
                    variant="outlined"
                    error={_subFamilyE}
                />   
                <IconButton 
                  disabled={!_enableSubFmaily}
                  size="small" 
                  color="secondary" 
                  aria-label="add to shopping cart"
                  onClick={() => __saveSubFamily()}
                >
                  <SaveIcon3 />
                </IconButton>             
              </Grid>
            </Grid>
          </Box>
          <Divider />
          <Box
            p={2}
            display="flex"
            alignItems="center"
          >
            <Box flexGrow={1} />
            <Button onClick={onCancel}>
              Cancel
            </Button>
          </Box>
        </>
  );
};

NewCategory.propTypes = {
};

NewCategory.defaultProps = {
};

export default NewCategory;
