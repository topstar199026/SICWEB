import { useEffect, useState } from 'react';
import type {
  FC} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  makeStyles,
  Dialog,
  Grid
} from '@material-ui/core';

import SearchIcon2 from '@material-ui/icons/Search';
import AddIcon2 from '@material-ui/icons/Add';

import type { Theme } from 'src/theme';
import type { Product } from 'src/types/product';
import NewItem from './NewItem';
import {getSegments, getFamilies, getUnits, getProducts, getSubFamilies, getItem} from 'src/apis/itemApi';
import useSettings from 'src/hooks/useSettings';


interface TablesProps {
  className?: string;
  products: Product[];
}

interface Filters {
  availability?: 'available' | 'unavailable';
  category?: string;
  inStock?: boolean;
  isShippable?: boolean;
}

const sortOptions = [
  {
    value: 'updatedAt|desc',
    label: 'Last update (newest first)'
  },
  {
    value: 'updatedAt|asc',
    label: 'Last update (oldest first)'
  },
  {
    value: 'createdAt|desc',
    label: 'Creation date (newest first)'
  },
  {
    value: 'createdAt|asc',
    label: 'Creation date (oldest first)'
  }
];


const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  bulkOperations: {
    position: 'relative'
  },
  bulkActions: {
    paddingLeft: 4,
    paddingRight: 4,
    marginTop: 6,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    backgroundColor: theme.palette.background.default
  },
  bulkAction: {
    marginLeft: theme.spacing(2)
  },
  queryField: {
    width: 200
  },
  queryFieldMargin: {
    marginLeft: theme.spacing(2),
  },
  categoryField: {
    width: 200,
    flexBasis: 200
  },
  availabilityField: {
    width: 200,
    marginLeft: theme.spacing(2),
    flexBasis: 200
  },
  buttonBox: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  stockField: {
    marginLeft: theme.spacing(2)
  },
  shippableField: {
    marginLeft: theme.spacing(2)
  },
  imageCell: {
    fontSize: 0,
    width: 68,
    flexBasis: 68,
    flexGrow: 0,
    flexShrink: 0
  },
  image: {
    height: 68,
    width: 68
  }
}));

const Tables: FC<TablesProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  
  const { settings } = useSettings();
  const [values, setValues] = useState({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    theme: settings.theme
  });
  
  const [segments, setSegments] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [families, setFamilies] = useState<any>([]);
  const [subFamilies, setSubFamilies] = useState<any>([]);
  const [units, setUnits] = useState<any>([]);

  const [filters, setFilters] = useState({
    code: '',
    description: '',
    family: null,
    subFamily: null,
  });

   const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  useEffect(() => {
    _getInitialData();
  }, [])

  const _getInitialData = () => {
    _getSegments();
    _getProducts();
    _getFamilies(); 
    _getUnits();
  }

  const _getSegments = () => {
    getSegments().then(res => {
      setSegments(res);
    });
  }

  const _getProducts = () => {
    getProducts().then(res => {
      setProducts(res);
    });
  }

  const _getFamilies = () => {
    getFamilies().then(res => {
      setFamilies(res);
    });
  }

  const _getSubFamilies = (fid) => {
    getSubFamilies(fid).then(res => {
      setSubFamilies(res);
    }).catch(err => {
      setSubFamilies([]);
    });
  }

  const _getUnits = () => {
    getUnits().then(res => {
      setUnits(res);
    });
  }

  const handleModalClose = (): void => {
    setIsModalOpen(false);
  };

  const handleSearch =() => {
    console.log(filters)
    getItem(filters).then(res => {
      console.log(res)
    })
  }

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box p={3} alignItems="center">
        <Grid container spacing={3}>
          <Grid item lg={4} sm={6} xs={12}>
            <Grid container spacing={3}>
              <Grid item lg={6} sm={6} xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Código"
                  placeholder=""
                  variant="outlined"
                  value={filters.code}
                  onChange={(e) => setFilters({...filters, code: e.target.value})}
                />
              </Grid>
              <Grid item lg={6} sm={6} xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Descripción"
                  placeholder=""
                  variant="outlined"
                  value={filters.description}
                  onChange={(e) => setFilters({...filters, description: e.target.value})}
                />
              </Grid>
              <Grid item lg={6} sm={6} xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Familia"
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  value={filters.family || -1}
                  onChange={(e) => {
                    setFilters({...filters, 
                      family: e.target.value,
                      subFamily: -1
                    })
                    _getSubFamilies(e.target.value);
                  }}
                >
                  <option key="-1" value="-1">{'-- Seleccionar --'}</option>
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
                  fullWidth
                  size="small"
                  label="SubFamilia"
                  name="availability"
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  value={filters.subFamily || -1}
                  onChange={(e) => setFilters({...filters, subFamily: e.target.value})}
                >
                  <option key="-1" value="-1">{'-- Seleccionar --'}</option>
                    
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
            </Grid>
          </Grid>
          <Grid item lg={4} sm={3} xs={12} ><></></Grid>
          <Grid item lg={4} sm={3} xs={12}>
            <Grid container spacing={3}>
              <Grid item>
                <Button onClick={handleSearch} variant="contained" color="primary" startIcon={<SearchIcon2 />}>{'Buscar'}</Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="secondary" startIcon={<AddIcon2 />} onClick={() => setIsModalOpen(true)}>{'Nuevo'}</Button>
              </Grid>
            </Grid>
          </Grid>      
        </Grid>
      </Box>  
      <PerfectScrollbar>
        <Box minWidth={1200}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={false}
                  />
                </TableCell>
                <TableCell />
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Inventory
                </TableCell>
                <TableCell>
                  Details
                </TableCell>
                <TableCell>
                  Attributes
                </TableCell>
                <TableCell>
                  Price
                </TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {paginatedProducts.map((product) => {
                const isProductSelected = selectedProducts.includes(product.id);

                return (
                  <TableRow
                    hover
                    key={product.id}
                    selected={isProductSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isProductSelected}
                        onChange={(event) => handleSelectOneProduct(event, product.id)}
                        value={isProductSelected}
                      />
                    </TableCell>
                    <TableCell className={classes.imageCell}>
                      {product.image ? (
                        <img
                          alt="Product"
                          src={product.image}
                          className={classes.image}
                        />
                      ) : (
                        <Box
                          p={2}
                          bgcolor="background.dark"
                        >
                          <SvgIcon>
                            <ImageIcon />
                          </SvgIcon>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        variant="subtitle2"
                        color="textPrimary"
                        component={RouterLink}
                        underline="none"
                        to="#"
                      >
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {getInventoryLabel(product.inventoryType)}
                    </TableCell>
                    <TableCell>
                      {product.quantity}
                      {' '}
                      in stock
                      {product.variants > 1 && ` in ${product.variants} variants`}
                    </TableCell>
                    <TableCell>
                      {product.attributes.map((attr) => attr)}
                    </TableCell>
                    <TableCell>
                      {numeral(product.price).format(`${product.currency}0,0.00`)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton>
                        <SvgIcon fontSize="small">
                          <EditIcon />
                        </SvgIcon>
                      </IconButton>
                      <IconButton>
                        <SvgIcon fontSize="small">
                          <ArrowRightIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })} */}
            </TableBody>
          </Table>
          {/* <TablePagination
            component="div"
            count={filteredProducts.length}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          /> */}
        </Box>
      </PerfectScrollbar>
      <Dialog
        maxWidth="sm"
        fullWidth
        onClose={handleModalClose}
        open={isModalOpen}
      >
        {/* Dialog renders its body even if not open */}
        {isModalOpen && (
          <NewItem
            segments={segments}
            products={products}
            families={families}
            subFamilies={subFamilies}
            units={units}
            _getInitialData={_getInitialData}
            onAddComplete={handleModalClose}
            onCancel={handleModalClose}
            onDeleteComplete={handleModalClose}
            onEditComplete={handleModalClose}
          />
        )}
      </Dialog>
    </Card>
  );
};

Tables.propTypes = {
  className: PropTypes.string,
  products: PropTypes.array.isRequired
};

Tables.defaultProps = {
  products: []
};

export default Tables;
