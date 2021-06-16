import type { FC } from 'react';
import {
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import type { Theme } from 'src/theme';
import Header from './Header';
import Tables from './Tables';


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    // minHeight: '100%',
    // paddingTop: theme.spacing(3),
    // paddingBottom: theme.spacing(3)
  }
}));

const DashboardView: FC = () => {
  
  const classes = useStyles();

  const products = [];
  return (
    <Page
      className={classes.root}
      title="Settings"
    >
      <Container maxWidth={false}>
        <Header />
        <Tables products={products}/>
      </Container>
    </Page>
  );
};
export default DashboardView;