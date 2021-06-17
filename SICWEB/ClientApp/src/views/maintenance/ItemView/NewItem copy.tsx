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
  Grid,
  Dialog
} from '@material-ui/core';
import AddIcon2 from '@material-ui/icons/Add';
import { Trash as TrashIcon } from 'react-feather';
import type { Theme } from 'src/theme';
import type { Event } from 'src/types/calendar';
import { useDispatch } from 'src/store';
import NewCategory from './NewCategory';


interface NewItemProps {
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

const NewItem: FC<NewItemProps> = ({
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

    const isCreating = !event;
    const [isModalOpen3, setIsModalOpen3] = useState(false);

    const handleDelete = async (): Promise<void> => {
        try {
        onDeleteComplete();
        } catch (err) {
        console.error(err);
        }
    };

    const handleModalClose3 = (): void => {
        setIsModalOpen3(false);
    };

    const handleModalOpen3 = (): void => {
        setIsModalOpen3(true);
    };

    return (
        <>
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
                <form onSubmit={handleSubmit}>
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
                            lg={12}
                            sm={12}
                            xs={12}
                        >
                            <TextField
                                size="small"
                                error={Boolean(touched.title && errors.title)}
                                fullWidth
                                helperText={touched.title && errors.title}
                                label="Código"
                                name="title"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.title}
                                variant="outlined"
                            />
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
                                error={Boolean(touched.description && errors.description)}
                                fullWidth
                                helperText={touched.description && errors.description}
                                label="Descripción"
                                name="description"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.description}
                                variant="outlined"
                            />                    
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
                            <IconButton 
                                size="small" 
                                color="secondary" 
                                aria-label="add to shopping cart"
                                onClick={() => handleModalOpen3()}
                            >
                                <AddIcon2 />
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
                                error={Boolean(touched.description && errors.description)}
                                fullWidth
                                helperText={touched.description && errors.description}
                                label="Precio de Compra"
                                name="description"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.description}
                                variant="outlined"
                            />                    
                        </Grid>
                        <Grid
                        item
                        lg={6}
                        sm={6}
                        xs={12}
                        >
                            <TextField
                                size="small"
                                error={Boolean(touched.title && errors.title)}
                                fullWidth
                                helperText={touched.title && errors.title}
                                label="Precio de Venta"
                                name="title"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.title}
                                variant="outlined"
                            />
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
                            style={{display: 'flex'}}
                        >
                            <TextField
                                size="small"
                                label="Familia"
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
                            <IconButton 
                                size="small" 
                                color="secondary" 
                                aria-label="add to shopping cart"
                                onClick={() => handleModalOpen3()}
                            >
                                <AddIcon2 />
                            </IconButton>
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
                            <IconButton 
                                size="small" 
                                color="secondary" 
                                aria-label="add to shopping cart"
                                onClick={() => handleModalOpen3()}
                            >
                                <AddIcon2 />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Box mt={2}>
                    <FormControlLabel
                        control={(
                        <Switch
                            checked={values.allDay}
                            name="allDay"
                            onChange={handleChange}
                        />
                        )}
                        label="All day"
                    />
                    </Box>
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
                    {!isCreating && (
                    <IconButton onClick={() => handleDelete()}>
                        <SvgIcon>
                        <TrashIcon />
                        </SvgIcon>
                    </IconButton>
                    )}
                    <Box flexGrow={1} />
                    <Button onClick={onCancel}>
                    Cancel
                    </Button>
                    <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                    color="secondary"
                    className={classes.confirmButton}
                    >
                    Confirm
                    </Button>
                </Box>
                </form>
            )}
            </Formik>
            <Dialog
                maxWidth="sm"
                fullWidth
                onClose={handleModalClose3}
                open={isModalOpen3}
            >
                {/* Dialog renders its body even if not open */}
                {isModalOpen3 && (
                <NewCategory
                    families={families}
                    subFamilies={subFamilies}
                    units={units}
                    onAddComplete={handleModalClose3}
                    onCancel={handleModalClose3}
                    onDeleteComplete={handleModalClose3}
                    onEditComplete={handleModalClose3}
                />
                )}
            </Dialog>
        </>
    );
};

NewItem.propTypes = {
  // @ts-ignore
  event: PropTypes.object,
  onAddComplete: PropTypes.func,
  onCancel: PropTypes.func,
  onDeleteComplete: PropTypes.func,
  onEditComplete: PropTypes.func,
  // @ts-ignore
  range: PropTypes.object
};

NewItem.defaultProps = {
  onAddComplete: () => { },
  onCancel: () => { },
  onDeleteComplete: () => { },
  onEditComplete: () => { }
};

export default NewItem;
