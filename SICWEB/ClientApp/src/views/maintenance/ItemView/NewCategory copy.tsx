import React, { useState } from 'react';
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


interface NewCategoryProps {
    families?: any[],
    subFamilies?: any[],
    units?: any[],
    event?: Event;
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
  onAddComplete,
  onCancel,
  onDeleteComplete,
  onEditComplete,
  range
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [_unit, set_Unit] = useState(null);
  const [_family, set_Family] = useState(null);
  const [_subFamily, set_SubFamily] = useState(null);

  const [_enableFmaily, set__EnableFmaily] = useState(true);
  const [_enableSubFmaily, set__EnableSubFmaily] = useState(false);

  const saveFamily = () => {

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
    <Formik
      initialValues={getInitialValues(event, range)}
      validationSchema={Yup.object().shape({
        allDay: Yup.bool(),
        description: Yup.string().max(5000),
        end: Yup.date()
          .when(
            'start',
            (start: Date, schema: any) => (start && schema.min(start, 'End date must be later than start date'))
          ),
        start: Yup.date(),
        title: Yup.string().max(255).required('Title is required')
      })}
      onSubmit={async (values, {
        resetForm,
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          const data = {
            allDay: values.allDay,
            description: values.description,
            end: values.end,
            start: values.start,
            title: values.title
          };

          resetForm();
          setStatus({ success: true });
          setSubmitting(false);

          if (isCreating) {
            onAddComplete();
          } else {
            onEditComplete();
          }
        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldTouched,
        setFieldValue,
        touched,
        values
      }) => (
        <form>
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
            <Grid
                container
                spacing={3}
            >
              <Grid
                  item
                  lg={6}
                  sm={6}
                  xs={12}
              >
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
              <Grid
                  item
                  lg={6}
                  sm={6}
                  xs={12}
                  style={{display: 'flex'}}
              >  
                <TextField
                    size="small"
                    error={Boolean(touched.description && errors.description)}
                    fullWidth
                    helperText={touched.description && errors.description}
                    label="Agregar Unidad de Medida"
                    name="unit"
                    onBlur={handleBlur}
                    onChange={(e) => set_Unit(e.target.value)}
                    value={_unit}
                    variant="outlined"
                />       
                <IconButton size="small" color="secondary" aria-label="add to shopping cart">
                    <SaveIcon3 />
                </IconButton>             
              </Grid>
            </Grid>
            <Grid
                container
                spacing={3}
            >
              <Grid
                  item
                  lg={6}
                  sm={6}
                  xs={12}
              >
                  <TextField
                      size="small"
                      label="Familias"
                      name="availability"
                      fullWidth
                      SelectProps={{ native: true }}
                      select
                      variant="outlined"
                      >
                      <option disabled selected key="-1" value="-1">{'-- Seleccionar --'}</option>
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
              <Grid
                  item
                  lg={6}
                  sm={6}
                  xs={12}
                  style={{display: 'flex'}}
              >  
                <TextField
                    size="small"
                    error={Boolean(touched.description && errors.description)}
                    fullWidth
                    helperText={touched.description && errors.description}
                    label="Agregar Familia"
                    name="description"
                    onBlur={handleBlur}
                    onChange={(e)=>set_Family(e.target.value)}
                    value={_family}
                    variant="outlined"
                />       
                <IconButton 
                  size="small" 
                  color="secondary" 
                  aria-label="add to shopping cart"
                  onClick={() => saveFamily()}
                >
                    <SaveIcon3 />
                </IconButton>             
              </Grid>
            </Grid>
            <Grid
                container
                spacing={3}
            >
              <Grid
                  item
                  lg={6}
                  sm={6}
                  xs={12}
              >
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
              <Grid
                  item
                  lg={6}
                  sm={6}
                  xs={12}
                  style={{display: 'flex'}}
              >  
                <TextField
                    disabled={!_enableSubFmaily}
                    size="small"
                    error={Boolean(touched.description && errors.description)}
                    fullWidth
                    helperText={touched.description && errors.description}
                    label="	Agregar SubFamilia"
                    name="description"
                    onBlur={handleBlur}
                    onChange={(e) => set_SubFamily(e.target.value)}
                    value={_subFamily}
                    variant="outlined"
                />       
                <IconButton 
                  disabled={!_enableSubFmaily}
                  size="small" 
                  color="secondary" 
                  aria-label="add to shopping cart">
                    <SaveIcon3 />
                </IconButton>             
              </Grid>
            </Grid>
            {Boolean(touched.end && errors.end) && (
              <Box mt={2}>
                <FormHelperText error>
                  {errors.end}
                </FormHelperText>
              </Box>
            )}
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
        </form>
      )}
    </Formik>
  );
};

NewCategory.propTypes = {
  // @ts-ignore
  event: PropTypes.object,
  onAddComplete: PropTypes.func,
  onCancel: PropTypes.func,
  onDeleteComplete: PropTypes.func,
  onEditComplete: PropTypes.func,
  // @ts-ignore
  range: PropTypes.object
};

NewCategory.defaultProps = {
  onAddComplete: () => { },
  onCancel: () => { },
  onDeleteComplete: () => { },
  onEditComplete: () => { }
};

export default NewCategory;
