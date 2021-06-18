import { FC, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  FormControlLabel,
  Switch,
  Grid
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import SaveIcon3 from '@material-ui/icons/Save';
import useSettings from 'src/hooks/useSettings';
import { getFamilies1, getSubFamilies, saveFamily, saveSubFamily, saveUnit } from 'src/apis/itemApi';

interface NewCategoryProps {
    segments?: any[],
    families?: any[],
    subFamilies?: any[],
    units?: any[],
    event?: Event;
    _getInitialData?: () => void;
    onCancel?: () => void;
}

const NewCategory: FC<NewCategoryProps> = ({
  segments,
  families,
  units,
  _getInitialData,
  onCancel,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { saveSettings } = useSettings();

  const [families1, setFamilies1] = useState<any>([]);
  const [subFamilies1, setSubFamilies1] = useState<any>([]);

  const _getFamilies = (sid) => {
    getFamilies1(sid).then(res => {
      setFamilies1(res);
    }).catch(err => {
      setFamilies1([]);
    });
  }

  const _getSubFamilies = (sid) => {
    getSubFamilies(sid).then(res => {
      setSubFamilies1(res);
    }).catch(err => {
      setSubFamilies1([]);
    });
  }

  

  return (
        <>
          <Box p={3}>
            <Typography
              align="center"
              gutterBottom
              variant="h4"
              color="textPrimary"
            >
              {'Nuevo agregar'}
            </Typography>
          </Box>
          <Divider />
          <Box p={3}>   
            <Formik 
              initialValues={{
                id: '-1',
                unit: '',
                flag: false
              }}
              validationSchema={Yup.object().shape({
                  unit: Yup.string().max(5000).required('Se requiere una unidad de medida.')
              })}
              onSubmit={values => {
                saveSettings({saving: true});
                window.setTimeout(() => {
                  saveUnit(values).then(res => {
                    saveSettings({saving: false});
                    _getInitialData();
                    enqueueSnackbar('Tus datos se han guardado exitosamente.', {
                      variant: 'success'
                    });
                  }).catch(err => {
                    console.log('err',err)
                    _getInitialData();
                    enqueueSnackbar('No se pudo guardar.', {
                      variant: 'error'
                    });
                    saveSettings({saving: false});
                  });
                }, 1000);                
              }}
            >
              {({ errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    setFieldTouched,
                    setFieldValue,
                    touched,
                    values }) => (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item lg={6} sm={6} xs={12}>
                        <TextField
                            size="small"
                            label="Unidad de Medida"
                            name="id"
                            fullWidth
                            SelectProps={{ native: true }}
                            select
                            variant="outlined"  
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.id}      
                            >
                            <option selected key="-1" value="-1">{'-- Seleccionar --'}</option>
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
                    <Grid item lg={6} sm={6} xs={12}>
                      <TextField
                          size="small"
                          fullWidth
                          label="Agregar Unidad de Medida"
                          name="unit"
                          onBlur={handleBlur}
                          onChange={handleChange} 
                          error={Boolean(touched.unit && errors.unit)}
                          helperText={touched.unit && errors.unit}
                          value={values.unit}
                          variant="outlined"
                      />                       
                    </Grid>
                    <Grid item lg={6} sm={6} xs={12} style={{display: 'flex'}}>  
                      <></>         
                    </Grid>
                    <Grid item lg={6} sm={6} xs={12} style={{display: 'flex'}}>  
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={handleChange}
                            name="flag"
                            value={values.flag}
                            color="primary"
                          />
                        }
                        label="Enable"
                      />  
                      <Button type="submit" size="small" color="secondary" startIcon={<SaveIcon3 />} variant="contained">
                        Save
                      </Button>   
                    </Grid>
                  </Grid>
                </form>   
              )}
            </Formik>
          </Box>
          <Divider />
          <Box p={3}>
            <Formik 
              initialValues={{
                segId: -1,
                id: '-1',
                family: '',
                flag: false
              }}
              validationSchema={Yup.object().shape({
                segId: Yup.number().min(0).required(),
                family: Yup.string().max(5000).required('Se requiere una unidad de medida.')
              })}
              onSubmit={values => {
                saveSettings({saving: true});
                window.setTimeout(() => {
                  saveFamily(values).then(res => {
                    saveSettings({saving: false});
                    _getInitialData();
                    _getFamilies(values.segId);
                    enqueueSnackbar('Tus datos se han guardado exitosamente.', {
                      variant: 'success'
                    });
                  }).catch(err => {
                    console.log('err',err)
                    _getInitialData();
                    enqueueSnackbar('No se pudo guardar.', {
                      variant: 'error'
                    });
                    saveSettings({saving: false});
                  });
                }, 1000);
              }}
            >
              {({ errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    setFieldTouched,
                    setFieldValue,
                    touched,
                    values }) => (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item lg={6} sm={6} xs={12}>
                      <TextField
                          size="small"
                          label="Segmento"
                          name="segId"
                          fullWidth
                          SelectProps={{ native: true }}
                          select
                          variant="outlined"
                          value={values.segId}
                          onChange={(e) => {
                            _getFamilies(e.target.value);
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          error={Boolean(touched.segId && errors.segId)}
                          helperText={touched.segId && errors.segId && 'Se requiere el segmento'}
                        >
                          <option selected key="-1" value="-1">{'-- Seleccionar --'}</option>
                          {segments.map((segment) => (
                              <option
                                key={segment.segmento_c_yid}
                                value={segment.segmento_c_yid}
                              >
                                {segment.segmento_c_vdescripcion}
                              </option>
                          ))}
                      </TextField>
                    </Grid>
                    <Grid item lg={6} sm={6} xs={12}>
                        <TextField
                            size="small"
                            label="Familias"
                            name="id"
                            fullWidth
                            SelectProps={{ native: true }}
                            select
                            variant="outlined"
                            value={values.id}
                            onChange={handleChange}
                          >
                            <option selected key="-1" value="-1">{'-- Seleccionar --'}</option>
                            {families1.map((family) => (
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
                          name="family"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.family}
                          variant="outlined"
                          error={Boolean(touched.family && errors.family)}
                          helperText={touched.family && errors.family}
                      />         
                    </Grid>
                    <Grid item lg={6} sm={6} xs={12} style={{display: 'flex'}}>  
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={handleChange}
                            name="flag"
                            value={values.flag}
                            color="primary"
                          />
                        }
                        label="Enable"
                      />  
                      <Button type="submit" size="small" color="secondary" startIcon={<SaveIcon3 />} variant="contained">
                        Save
                      </Button>   
                    </Grid>
                  </Grid>                  
                </form>
              )}
            
            </Formik>
          </Box>
          <Divider />
          <Box p={3}> 
            <Formik 
              initialValues={{
                fid: '-1',
                id: '-1',
                subfamily: '',
                flag: false
              }}
              validationSchema={Yup.object().shape({
                fid: Yup.number().min(0).required(),
                subfamily: Yup.string().max(5000).required('Se requiere una unidad de medida.')
              })}
              onSubmit={values => {
                saveSettings({saving: true});
                window.setTimeout(() => {
                  saveSubFamily(values).then(res => {
                    saveSettings({saving: false});
                    _getInitialData();
                    _getSubFamilies(values.fid);
                    enqueueSnackbar('Tus datos se han guardado exitosamente.', {
                      variant: 'success'
                    });
                  }).catch(err => {
                    console.log('err',err)
                    _getInitialData();
                    enqueueSnackbar('No se pudo guardar.', {
                      variant: 'error'
                    });
                    saveSettings({saving: false});
                  });
                }, 1000);
              }}
            >
              {({ errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    setFieldTouched,
                    setFieldValue,
                    touched,
                    values }) => (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item lg={6} sm={6} xs={12}>
                        <TextField
                            size="small"
                            label="Familias"
                            name="fid"
                            fullWidth
                            SelectProps={{ native: true }}
                            select
                            variant="outlined"
                            value={values.fid}
                            onBlur={handleBlur}
                            onChange={(e) =>{ 
                              _getSubFamilies(e.target.value);
                              handleChange(e);
                            }}
                            error={Boolean(touched.fid && errors.fid)}
                            helperText={touched.fid && errors.fid && 'Se requiere el familias'}
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
                    <Grid item lg={6} sm={6} xs={12}>
                        <TextField
                          size="small"
                          label="SubFamilia"
                          name="id"
                          fullWidth
                          SelectProps={{ native: true }}
                          select
                          variant="outlined"
                          value={values.id}
                          onBlur={handleBlur}
                          onChange={(e) =>{ 
                            handleChange(e);
                          }}
                        >
                            <option selected key="-1" value="-1">{'-- Seleccionar --'}</option>
                            {subFamilies1.map((subFamily) => (
                                <option
                                  key={subFamily.isf_c_iid}
                                  value={subFamily.isf_c_iid}
                                  >
                                  {subFamily.isf_c_vdesc}
                                </option>
                            ))}
                        </TextField>
                    </Grid>                    
                    <Grid item lg={6} sm={6} xs={12}>  
                      <TextField
                          size="small"
                          fullWidth
                          label="	Agregar SubFamilia"
                          name="subfamily"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.subfamily}
                          variant="outlined"
                          error={Boolean(touched.subfamily && errors.subfamily)}
                          helperText={touched.subfamily && errors.subfamily && 'Se requiere el subFamilia'}
                      />              
                    </Grid>
                    <Grid item lg={6} sm={6} xs={12} style={{display: 'flex'}}>  
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={handleChange}
                            name="flag"
                            value={values.flag}
                            color="primary"
                          />
                        }
                        label="Enable"
                      />  
                      <Button type="submit" size="small" color="secondary" startIcon={<SaveIcon3 />} variant="contained">
                        Save
                      </Button>   
                    </Grid>
                  </Grid>                
                </form>
              )}
            
            </Formik>
             
          </Box>
         
          <Divider />
          <Box
            p={2}
            display="flex"
            alignItems="center"
          >
            <Box flexGrow={1} />
            <Button onClick={onCancel}>
              {'Cancelar'}
            </Button>
          </Box>
        </>
  );
};

export default NewCategory;
