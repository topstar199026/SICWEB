import { useEffect, useState } from 'react';
import type {
  FC,
  ChangeEvent
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  Checkbox,
  IconButton,
  Link,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  makeStyles,
  Dialog
} from '@material-ui/core';
import {
  Image as ImageIcon,
  Edit as EditIcon,
  ArrowRight as ArrowRightIcon} from 'react-feather';

import SearchIcon2 from '@material-ui/icons/Search';
import AddIcon2 from '@material-ui/icons/Add';

import type { Theme } from 'src/theme';
import Label from 'src/components/Label';
import type { Product, InventoryType } from 'src/types/product';
import NewItem from './NewItem';
import LoadingModal from 'src/components/LoadingModal';
import {getFamilies, getSubFamilies, getUnits} from 'src/apis/itemApi'
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

const categoryOptions = [
  {
    id: 'all',
    name: 'All'
  },
  {
    id: 'dress',
    name: 'Dress'
  },
  {
    id: 'jewelry',
    name: 'Jewelry'
  },
  {
    id: 'blouse',
    name: 'Blouse'
  },
  {
    id: 'beauty',
    name: 'Beauty'
  }
];

const avalabilityOptions = [
  {
    id: 'all',
    name: 'All'
  },
  {
    id: 'available',
    name: 'Available'
  },
  {
    id: 'unavailable',
    name: 'Unavailable'
  }
];

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

const getInventoryLabel = (inventoryType: InventoryType): JSX.Element => {
  const map = {
    in_stock: {
      text: 'In Stock',
      color: 'success'
    },
    limited: {
      text: 'Limited',
      color: 'warning'
    },
    out_of_stock: {
      text: 'Out of Stock',
      color: 'error'
    }
  };

  const { text, color }: any = map[inventoryType];

  return (
    <Label color={color}>
      {text}
    </Label>
  );
};

const applyFilters = (products: Product[], query: string, filters: Filters): Product[] => {
  return products.filter((product) => {
    let matches = true;

    if (query && !product.name.toLowerCase().includes(query.toLowerCase())) {
      matches = false;
    }

    if (filters.category && product.category !== filters.category) {
      matches = false;
    }

    if (filters.availability) {
      if (filters.availability === 'available' && !product.isAvailable) {
        matches = false;
      }

      if (filters.availability === 'unavailable' && product.isAvailable) {
        matches = false;
      }
    }

    if (filters.inStock && !['in_stock', 'limited'].includes(product.inventoryType)) {
      matches = false;
    }

    if (filters.isShippable && !product.isShippable) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (products: Product[], page: number, limit: number): Product[] => {
  return products.slice(page * limit, page * limit + limit);
};

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

const Tables: FC<TablesProps> = ({ className, products, ...rest }) => {
  const classes = useStyles();
  const [families, setFamilies] = useState<any>([]);
  const [subFamilies, setSubFamilies] = useState<any>([]);
  const [units, setUnits] = useState<any>([]);

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [query, setQuery] = useState<string>('');
  const [sort, setSort] = useState<string>(sortOptions[0].value);
  const [filters, setFilters] = useState<Filters>({
    category: null,
    availability: null,
    inStock: null,
    isShippable: null
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  useEffect(() => {
    _getInitialData();
  }, [])

  const _getInitialData = () => {
    _getFamilies();
    _getSubFamilies();   
    _getUnits();
  }
  const _getFamilies = () => {
    getFamilies().then(res => {
      setFamilies(res);
    });
  }

  const _getSubFamilies = () => {
    getSubFamilies().then(res => {
      setSubFamilies(res);
    });
  }

  const _getUnits = () => {
    getUnits().then(res => {
      setUnits(res);
    });
  }

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();

    let value = null;

    if (event.target.value !== 'all') {
      value = event.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      category: value
    }));
  };

  const handleAvailabilityChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();

    let value = null;

    if (event.target.value !== 'all') {
      value = event.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      availability: value
    }));
  };

  const handleStockChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();

    let value = null;

    if (event.target.checked) {
      value = true;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      inStock: value
    }));
  };

  const handleShippableChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();

    let value = null;

    if (event.target.checked) {
      value = true;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      isShippable: value
    }));
  };

  const handleSortChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setSort(event.target.value);
  };

  const handleSelectAllProducts = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedProducts(event.target.checked
      ? products.map((product) => product.id)
      : []);
  };

  const handleSelectOneProduct = (event: ChangeEvent<HTMLInputElement>, productId: string): void => {
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts((prevSelected) => [...prevSelected, productId]);
    } else {
      setSelectedProducts((prevSelected) => prevSelected.filter((id) => id !== productId));
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
  };

  const handleModalClose2 = (): void => {
    setIsModalOpen2(false);
  };

  // Usually query is done on backend with indexing solutions
  const filteredProducts = applyFilters(products, query, filters);
  const paginatedProducts = applyPagination(filteredProducts, page, limit);
  const enableBulkOperations = selectedProducts.length > 0;
  const selectedSomeProducts = selectedProducts.length > 0 && selectedProducts.length < products.length;
  const selectedAllProducts = selectedProducts.length === products.length;

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        p={2}
        display="flex"
        alignItems="center"
      >
        <Box
        >
          <Box
            p={1}
          >
            <TextField
              className={classes.queryField}
              // InputProps={{
              //   style: {
              //     height: 40
              //   }
              // }}
              size="small"
              onChange={handleQueryChange}
              label="Código"
              placeholder=""
              value={query}
              variant="outlined"
            />
            <TextField
              className={clsx(classes.queryField, classes.queryFieldMargin)}
              size="small"
              onChange={handleQueryChange}
              label="Descripción"
              placeholder=""
              value={query}
              variant="outlined"
            />
          </Box>
          <Box flexGrow={1} />
          <Box
           p={1}
          >
            <TextField
              className={classes.categoryField}
              size="small"
              label="Familia"
              name="category"
              onChange={handleCategoryChange}
              select
              SelectProps={{ native: true }}
              value={filters.category || 'all'}
              variant="outlined"
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
            <TextField
              className={classes.availabilityField}
              size="small"
              label="SubFamilia"
              name="availability"
              onChange={handleAvailabilityChange}
              select
              SelectProps={{ native: true }}
              value={filters.availability || 'all'}
              variant="outlined"
            >
              <option selected key="-1" value="-1">{'-- Seleccionar --'}</option>
              {subFamilies.map((subFamily) => (
                <option
                  key={subFamily.isf_c_iid}
                  value={subFamily.isf_c_iid}
                >
                  {subFamily.isf_c_vdesc}
                </option>
              ))}
            </TextField>
            
          </Box>
        </Box>
        <Box flexGrow={1} />
        <Box
        >
          <Box
           className={classes.buttonBox}
          >
            <Button variant="contained" color="primary" startIcon={<SearchIcon2 />}>{'Buscar'}</Button>
            <Button variant="contained" color="secondary" startIcon={<AddIcon2 />} onClick={() => setIsModalOpen(true)}>{'Nuevo'}</Button>
          </Box>
          <Box
          >
            
          </Box>

        </Box>
      </Box>
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllProducts}
              indeterminate={selectedSomeProducts}
              onChange={handleSelectAllProducts}
            />
            <Button
              variant="outlined"
              className={classes.bulkAction}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              className={classes.bulkAction}
            >
              Edit
            </Button>
          </div>
        </div>
      )}
      <PerfectScrollbar>
        <Box minWidth={1200}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAllProducts}
                    indeterminate={selectedSomeProducts}
                    onChange={handleSelectAllProducts}
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
              {paginatedProducts.map((product) => {
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
              })}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredProducts.length}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
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
      <LoadingModal 
        isModalOpen={isModalOpen2}
        handleModalClose={handleModalClose2}
      />
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
