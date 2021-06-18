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
import { getSubFamilies, saveItem } from 'src/apis/itemApi';


interface NewItemProps {
    families?: any[],
    subFamilies?: any[],
    units?: any[],
    event?: Event;
    _getInitialData?: () => void;
    onAddComplete?: () => void;
    onCancel?: () => void;
    onDeleteComplete?: () => void;
    onEditComplete?: () => void;
}

const getInitialValues = (event?: Event) => {
    return _.merge({}, {
        code: '',
        description: '',
        unit: -1,
        purchaseprice: '',
        saleprice: '',
        family: -1,
        subfamily: -1,
        submit: null
      }, event);
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  confirmButton: {
    marginLeft: theme.spacing(2)
  }
}));

const NewItem: FC<NewItemProps> = ({
    families,
    units,
    event,
    _getInitialData,
    onAddComplete,
    onCancel,
    onDeleteComplete,
    onEditComplete
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const isCreating = !event;
    const [isModalOpen3, setIsModalOpen3] = useState(false);
    const [subFamilies, setSubFamilies] = useState<any>([]);

    const _getSubFamilies = (family) => {
        getSubFamilies(family).then(res => {
            setSubFamilies(res);
        })
    }

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
                initialValues={getInitialValues(event)}
                validationSchema={Yup.object().shape({
                    code: Yup.string().max(5000).required('Se requiere el código'),
                    description: Yup.string().max(5000).required('Se requiere una descripción'),
                    unit: Yup.string().min(0).max(5000).required('Se requiere unidad de medida'),
                    purchaseprice: Yup.number().required('Se requiere el precio de compra'),
                    saleprice: Yup.number().required('Se requiere el Precio de Venta'),
                    family: Yup.number().min(1).required('Se requiere el familia'),
                    subfamily: Yup.number().min(1).required('Se requiere el subFamilia')
                })}
                onSubmit={async (values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                }) => {
                    try {
                    const data = {
                        code: values.code,
                        unit: values.unit,
                        description: values.description,
                        purchaseprice: values.purchaseprice,
                        saleprice: values.saleprice,
                        family: values.family,
                        subfamily: values.subfamily,
                    };

                    await saveItem(data);
                    
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
                            {'Agregar ítem nuevo'}
                            </Typography>
                        </Box>
                        <Box p={3}>            
                            <Grid container spacing={3}>
                                <Grid item lg={12} sm={12} xs={12}>
                                    <TextField
                                        size="small"
                                        error={Boolean(touched.code && errors.code)}
                                        fullWidth
                                        helperText={touched.code && errors.code}
                                        label="Código"
                                        name="code"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.code}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                spacing={3}
                            >
                                <Grid item lg={6} sm={6} xs={12}>  
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
                                <Grid item lg={6} sm={6} xs={12} style={{display: 'flex'}}>
                                    <TextField
                                        size="small"
                                        error={Boolean(touched.unit && errors.unit)}
                                        helperText={touched.unit && errors.unit}
                                        label="Unidad de Medida"
                                        name="unit"
                                        fullWidth
                                        SelectProps={{ native: true }}
                                        select
                                        variant="outlined"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.unit}
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
                            <Grid container spacing={3}>
                                <Grid item lg={6} sm={6} xs={12}>  
                                    <TextField
                                        size="small"
                                        error={Boolean(touched.purchaseprice && errors.purchaseprice)}
                                        fullWidth
                                        helperText={touched.purchaseprice && errors.purchaseprice}
                                        label="Precio de Compra"
                                        name="purchaseprice"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.purchaseprice}
                                        variant="outlined"
                                    />                    
                                </Grid>
                                <Grid item lg={6} sm={6} xs={12} >
                                    <TextField
                                        size="small"
                                        error={Boolean(touched.saleprice && errors.saleprice)}
                                        fullWidth
                                        helperText={touched.saleprice && errors.saleprice}
                                        label="Precio de Venta"
                                        name="saleprice"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.saleprice}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item lg={6} sm={6} xs={12} style={{display: 'flex'}}>
                                    <TextField
                                        size="small"
                                        label="Familia"
                                        name="family"
                                        error={Boolean(touched.family && errors.family)}
                                        helperText={touched.family && errors.family}
                                        fullWidth
                                        SelectProps={{ native: true }}
                                        select
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            console.log(e.target.value)
                                            _getSubFamilies(e.target.value);
                                            handleChange(e);
                                        }}
                                        value={values.family}
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
                                <Grid item lg={6} sm={6} xs={12} style={{display: 'flex'}}>
                                    <TextField
                                        size="small"
                                        label="SubFamilia"
                                        name="subfamily"
                                        error={Boolean(touched.subfamily && errors.subfamily)}
                                        helperText={touched.subfamily && errors.subfamily}
                                        fullWidth
                                        SelectProps={{ native: true }}
                                        select
                                        variant="outlined"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.subfamily}
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
                            {Boolean(touched.end && errors.end) && (
                            <Box mt={2}>
                                <FormHelperText error>
                                {errors.end}
                                </FormHelperText>
                            </Box>
                            )}
                        </Box>
                        <Divider />
                        {errors.submit && (
                            <Box mt={3}>
                            <FormHelperText error>
                                {errors.submit}
                            </FormHelperText>
                            </Box>
                        )}
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
                {isModalOpen3 && (
                <NewCategory
                    families={families}
                    subFamilies={subFamilies}
                    units={units}
                    _getInitialData={_getInitialData}
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
