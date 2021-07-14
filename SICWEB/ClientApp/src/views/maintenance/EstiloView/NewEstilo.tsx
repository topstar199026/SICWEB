import { useEffect, useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import * as Yup from 'yup';
import { Field, FieldArray, Formik } from 'formik';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  FormHelperText,
  makeStyles,
  Grid,
  Dialog,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@material-ui/core';
import AddIcon2 from '@material-ui/icons/Add';
import type { Theme } from 'src/theme';
import type { Event } from 'src/types/calendar';
import NewCategory from './NewCategory';
import { getFamilyAndSub, getSubFamilies, saveItem } from 'src/apis/itemApi';
import { useSnackbar } from 'notistack';
import useSettings from 'src/hooks/useSettings';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';

interface NewEstiloProps {
    editID: number,
    onCancel?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  confirmButton: {
    marginLeft: theme.spacing(2)
  }
}));

const NewEstilo: FC<NewEstiloProps> = ({
    editID,
    onCancel
}) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { saveSettings } = useSettings();   

    const getInitialValues = () => {
        return {
            code: '',
            name: '',
            description: '',
            item: '',
            image: null,
            imageUrl: null,
            brand: [
                {id: '-1', value: 'ab'},
                {id: '-1', value: 'ab'}
            ],
            color: [
                {id: '-1', value: 'ab'},
                {id: '-1', value: 'ab'}
            ],
            category: [
                {id: '-1', value: 'ab'},
                {id: '-1', value: 'ab'}
            ],
            size: 0,
            submit: null
        };
        
    };
    return (
        <>
            <Formik
                initialValues={getInitialValues()}
                validationSchema={Yup.object().shape({
                    code: Yup.string().max(20, 'Debe tener 20 caracteres como máximo').required('Este campo es obligatorio.'),
                    name: Yup.string().max(50, 'Debe tener 50 caracteres como máximo').required('Este campo es obligatorio.'),
                    description: Yup.string().max(200, 'Debe tener 50 caracteres como máximo'),
                    
                })}
                onSubmit={async (values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                }) => {
                    console.log(values)
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
                            { editID>-1 ? 'Editar ESTILO' : 'Nuevo ESTILO'}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box p={3}>         
                            <Grid container spacing={3}>
                                <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                                    <Grid container spacing={3}>
                                        <Grid  item xl={12} xs={12}>
                                            <label style={{fontSize: 15, color: 'rgba(0, 0, 0, 0.54)'}}>&nbsp;&nbsp;&nbsp;&nbsp;Datos del Estilo</label>
                                        </Grid> 
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                label={<label>Código <span style={{color: 'red'}}>*</span></label>}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                variant="outlined"
                                                InputProps={{
                                                    endAdornment: <IconButton 
                                                        size="small" 
                                                        color="primary" 
                                                        aria-label="add to shopping cart"
                                                        onClick={() => { }}
                                                    >
                                                        <FileCopyIcon />
                                                    </IconButton>
                                                }}
                                                name="code"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.code}
                                                error={Boolean(touched.code && errors.code)}
                                                helperText={touched.code && errors.code}
                                            />
                                        </Grid>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                label={<label>Nombre <span style={{color: 'red'}}>*</span></label>}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                variant="outlined"
                                                name="name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.name}
                                                error={Boolean(touched.name && errors.name)}
                                                helperText={touched.name && errors.name}
                                            />
                                        </Grid>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                label={<label>Descripción</label>}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                variant="outlined"
                                                name="description"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.description}
                                                error={Boolean(touched.description && errors.description)}
                                                helperText={touched.description && errors.description}
                                            />
                                        </Grid>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                label={<label>Item <span style={{color: 'red'}}>*</span></label>}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                variant="outlined"
                                                name="item"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.item}
                                                error={Boolean(touched.item && errors.item)}
                                                helperText={touched.item && errors.item}
                                            />
                                        </Grid>
                                        <FieldArray
                                            name="brand"
                                            render={arrayHelpers => (
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <Grid container style={{background: '#efefef'}}>
                                                        <Grid item xl={11} xs={11}>
                                                            <Grid container spacing={1}>
                                                                <Grid  item xl={12} xs={12}>
                                                                    <label style={{fontSize: 12.5, color: 'rgba(0, 0, 0, 0.54)'}}>&nbsp;&nbsp;&nbsp;&nbsp;Marca</label>
                                                                </Grid>                                                            
                                                                {values.brand && values.brand.length > 0 ? 
                                                                    (
                                                                        values.brand.map((_brand, index) => (
                                                                            <Grid key={index} item xl={12} xs={12}>
                                                                                <TextField
                                                                                    size="small"
                                                                                    error={Boolean(
                                                                                        touched.brand && touched.brand[index] && touched.brand[index].value &&
                                                                                        errors.brand && errors.brand[index] && errors.brand[index]
                                                                                    )}
                                                                                    fullWidth
                                                                                    helperText={
                                                                                        <>{touched.brand && touched.brand[index] && touched.brand[index].value &&
                                                                                        errors.brand && errors.brand[index] && errors.brand[index]['value']}</>
                                                                                    }
                                                                                    label={<label><span style={{color: 'red'}}>*</span></label>}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    InputProps={{
                                                                                        endAdornment: <IconButton 
                                                                                            size="small" 
                                                                                            color="primary" 
                                                                                            aria-label="add to shopping cart"
                                                                                            onClick={() => { values.brand.length > 1 && arrayHelpers.remove(index)}}
                                                                                        >
                                                                                            <DeleteIcon />
                                                                                        </IconButton>
                                                                                    }}
                                                                                    name={`brand[${index}].value`}
                                                                                    onBlur={handleBlur}
                                                                                    onChange={handleChange}
                                                                                    value={values.brand[index].value}
                                                                                    variant="outlined"
                                                                                />
                                                                            </Grid>
                                                                        ))
                                                                    ) : (
                                                                        <></>
                                                                    )
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xl={1} xs={1}>
                                                            <IconButton 
                                                                size="small" 
                                                                color="secondary" 
                                                                aria-label="add to shopping cart"
                                                                onClick={() => { arrayHelpers.push({id: -1, value: ''})}}
                                                            >
                                                                <AddIcon2 />
                                                            </IconButton>
                                                        </Grid>
                                                        
                                                    </Grid>
                                                </Grid> 
                                            )}                                        
                                        />  
                                        <FieldArray
                                            name="color"
                                            render={arrayHelpers => (
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <Grid container style={{background: '#efefef'}}>
                                                        <Grid item xl={11} xs={11}>
                                                            <Grid container spacing={1}>
                                                                <Grid  item xl={12} xs={12}>
                                                                    <label style={{fontSize: 12.5, color: 'rgba(0, 0, 0, 0.54)'}}>&nbsp;&nbsp;&nbsp;&nbsp;Color</label>
                                                                </Grid>                                                            
                                                                {values.color && values.color.length > 0 ? 
                                                                    (
                                                                        values.color.map((_color, index) => (
                                                                            <Grid key={index} item xl={12} xs={12}>
                                                                                <TextField
                                                                                    size="small"
                                                                                    error={Boolean(
                                                                                        touched.color && touched.color[index] && touched.color[index].value &&
                                                                                        errors.color && errors.color[index] && errors.color[index]
                                                                                    )}
                                                                                    fullWidth
                                                                                    helperText={
                                                                                        <>{touched.color && touched.color[index] && touched.color[index].value &&
                                                                                        errors.color && errors.color[index] && errors.color[index]['value']}</>
                                                                                    }
                                                                                    label={<label><span style={{color: 'red'}}>*</span></label>}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    InputProps={{
                                                                                        endAdornment: <IconButton 
                                                                                            size="small" 
                                                                                            color="primary" 
                                                                                            aria-label="add to shopping cart"
                                                                                            onClick={() => { values.color.length > 1 && arrayHelpers.remove(index)}}
                                                                                        >
                                                                                            <DeleteIcon />
                                                                                        </IconButton>
                                                                                    }}
                                                                                    name={`color[${index}].value`}
                                                                                    onBlur={handleBlur}
                                                                                    onChange={handleChange}
                                                                                    value={values.color[index].value}
                                                                                    variant="outlined"
                                                                                />
                                                                            </Grid>
                                                                        ))
                                                                    ) : (
                                                                        <></>
                                                                    )
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xl={1} xs={1}>
                                                            <IconButton 
                                                                size="small" 
                                                                color="secondary" 
                                                                aria-label="add to shopping cart"
                                                                onClick={() => { arrayHelpers.push({id: -1, value: ''})}}
                                                            >
                                                                <AddIcon2 />
                                                            </IconButton>
                                                        </Grid>
                                                        
                                                    </Grid>
                                                </Grid> 
                                            )}                                        
                                        />  
                                      
                                    </Grid>
                                </Grid>
                                <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                                    <Grid container spacing={3}>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <div style={{padding: '10%'}}>
                                                <div style={{minHeight: '50px',position: 'relative'}}>
                                                    <input type="file" style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        background: 'red',
                                                        left: 0,
                                                        top: 0,
                                                        position: 'absolute',
                                                        opacity: 0,
                                                        zIndex: 99999
                                                    }}                                                     
                                                    onChange={(e) => {                                                        
                                                        setFieldValue('imageUrl', URL.createObjectURL(e.target.files[0]))
                                                        setFieldValue('image', e.target.files[0])
                                                    }}
                                                    />
                                                    {/* <Field /> */}
                                                    <img 
                                                        src={
                                                            values.imageUrl === null ?
                                                            'https://mtxweb.ch/wp-content/uploads/2017/02/UploadLimit-Header.png'
                                                            :
                                                            values.imageUrl
                                                        }
                                                        style={{width: '100%'}}
                                                        alt=''
                                                    />
                                                </div>
                                            </div>
                                        </Grid>
                                        <FieldArray
                                            name="category"
                                            render={arrayHelpers => (
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <Grid container style={{background: '#efefef'}}>
                                                        <Grid item xl={11} xs={11}>
                                                            <Grid container spacing={1}>
                                                                <Grid  item xl={12} xs={12}>
                                                                    <label style={{fontSize: 12.5, color: 'rgba(0, 0, 0, 0.54)'}}>&nbsp;&nbsp;&nbsp;&nbsp;Categoría</label>
                                                                </Grid>                                                            
                                                                {values.category && values.category.length > 0 ? 
                                                                    (
                                                                        values.category.map((_category, index) => (
                                                                            <Grid key={index} item xl={12} xs={12}>
                                                                                <TextField
                                                                                    size="small"
                                                                                    error={Boolean(
                                                                                        touched.category && touched.category[index] && touched.category[index].value &&
                                                                                        errors.category && errors.category[index] && errors.category[index]
                                                                                    )}
                                                                                    fullWidth
                                                                                    helperText={
                                                                                        <>{touched.category && touched.category[index] && touched.category[index].value &&
                                                                                        errors.category && errors.category[index] && errors.category[index]['value']}</>
                                                                                    }
                                                                                    label={<label><span style={{color: 'red'}}>*</span></label>}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    InputProps={{
                                                                                        endAdornment: <IconButton 
                                                                                            size="small" 
                                                                                            color="primary" 
                                                                                            aria-label="add to shopping cart"
                                                                                            onClick={() => { values.category.length > 1 && arrayHelpers.remove(index)}}
                                                                                        >
                                                                                            <DeleteIcon />
                                                                                        </IconButton>
                                                                                    }}
                                                                                    name={`category[${index}].value`}
                                                                                    onBlur={handleBlur}
                                                                                    onChange={handleChange}
                                                                                    value={values.category[index].value}
                                                                                    variant="outlined"
                                                                                />
                                                                            </Grid>
                                                                        ))
                                                                    ) : (
                                                                        <></>
                                                                    )
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xl={1} xs={1}>
                                                            <IconButton 
                                                                size="small" 
                                                                color="secondary" 
                                                                aria-label="add to shopping cart"
                                                                onClick={() => { arrayHelpers.push({id: -1, value: ''})}}
                                                            >
                                                                <AddIcon2 />
                                                            </IconButton>
                                                        </Grid>
                                                        
                                                    </Grid>
                                                </Grid> 
                                            )}                                        
                                        />
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <Grid container spacing={0}  style={{background: '#efefef'}}>
                                                <Grid  item xl={12} xs={12}>
                                                    <label style={{fontSize: 12.5, color: 'rgba(0, 0, 0, 0.54)'}}>&nbsp;&nbsp;&nbsp;&nbsp;Talla <span style={{color: 'red'}}>*</span></label>
                                                </Grid> 
                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <FormControl component="fieldset">
                                                        <RadioGroup row aria-label="position" name="size" defaultValue="0" onChange={handleChange}>
                                                            <FormControlLabel
                                                                value="0"
                                                                control={<Radio color="primary" />}
                                                                label="S"
                                                            />
                                                            <FormControlLabel
                                                                value="1"
                                                                control={<Radio color="primary" />}
                                                                label="M"
                                                            />
                                                            <FormControlLabel
                                                                value="2"
                                                                control={<Radio color="primary" />}
                                                                label="L"
                                                            />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                            
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
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
                            <Box flexGrow={1} />
                            <Button onClick={onCancel}>
                                {'Cancelar'}
                            </Button>
                            <Button
                            variant="contained"
                            type="submit"
                            disabled={isSubmitting}
                            color="secondary"
                            className={classes.confirmButton}
                            >
                                {'Confirmar'}
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
            
        </>
    );
};

NewEstilo.propTypes = {
};

export default NewEstilo;
