import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import withStyles from '@material-ui/core/styles/withStyles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid'

import ArticleList from './ArticleList'
import ArticleCard from '../components/ArticleCard'

const styles = theme => ({
  gridContainer: {
    padding: "20px 10px",
  },

  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  tabsIndicator: {
    backgroundColor: theme.palette.secondary.main,
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing.unit * 4,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: theme.palette.primary.main,
      opacity: 1,
    },
    '&$tabSelected': {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: theme.palette.primary.main,
    },
  },
  tabSelected: {},
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      featuredPosts: [],
      value: 0,
      dpsus: ['hal', 'bel', 'bdl', 'beml', 'midhani', 'mdl', 'grse', 'gsl', 'hsl'],
    }
  }

  componentDidMount() {
    var index = this.state.dpsus.findIndex(d => d === window.location.pathname.replace('/trending/', ''))
    this.setState({
      value: index + 1,
      featuredPosts: [
        {
          id: '1234-5678-1234-5678',
          title: 'How to make a quality steel bend',
          description: 'In bibendum nisi ut molestie cursus. Maecenas in justo lectus. Nunc aliquam, odio non aliquam eleifend, ante magna venenatis erat, sit amet pellentesque purus magna rhoncus arcu. Fusce id vehicula nunc. In id est vitae justo consectetur imperdiet. Vestibulum volutpat eros a dolor pellentesque pretium. Pellentesque tincidunt viverra malesuada. Nullam eu magna sed enim sollicitudin porttitor gravida quis lacus.',
          author: {
            name: 'Mark Allen',
            dpsu: 'Goa Shipyard Limited'
          },
          date: 1551241280629,
        },
        {
          id: '5678-1234-5678-1234',
          title: 'Thing I wish I knew before starting my first gear development',
          description: 'Aenean semper a sem quis semper. Cras sit amet elit vestibulum, lacinia nibh eu, pretium augue. Curabitur lacinia aliquet justo, et mattis tellus. Nam cursus id libero ac pretium. Suspendisse at aliquam nunc. Sed suscipit sem at sapien consectetur, a rhoncus metus laoreet. Fusce vitae tortor auctor, lobortis lorem in, efficitur dolor. Maecenas in ligula eu risus facilisis dictum et quis odio. Etiam dapibus, massa eu accumsan venenatis, turpis dolor laoreet enim, nec tempus tortor urna ac ante. Nam sed metus ut augue gravida ultricies.',
          author: {
            name: 'Steven McGrath',
            dpsu: 'Hindustan Aeronautics Limited'
          },
          date: 1551241280629,
        },
        {
          id: '1234-5678-1234-5678',
          title: 'How to make a quality steel bend',
          description: 'In bibendum nisi ut molestie cursus. Maecenas in justo lectus. Nunc aliquam, odio non aliquam eleifend, ante magna venenatis erat, sit amet pellentesque purus magna rhoncus arcu. Fusce id vehicula nunc. In id est vitae justo consectetur imperdiet. Vestibulum volutpat eros a dolor pellentesque pretium. Pellentesque tincidunt viverra malesuada. Nullam eu magna sed enim sollicitudin porttitor gravida quis lacus.',
          author: {
            name: 'Mark Allen',
            dpsu: 'Goa Shipyard Limited'
          },
          date: 1551241280629,
        },
        {
          id: '5678-1234-5678-1234',
          title: 'Thing I wish I knew before starting my first gear development',
          description: 'Aenean semper a sem quis semper. Cras sit amet elit vestibulum, lacinia nibh eu, pretium augue. Curabitur lacinia aliquet justo, et mattis tellus. Nam cursus id libero ac pretium. Suspendisse at aliquam nunc. Sed suscipit sem at sapien consectetur, a rhoncus metus laoreet. Fusce vitae tortor auctor, lobortis lorem in, efficitur dolor. Maecenas in ligula eu risus facilisis dictum et quis odio. Etiam dapibus, massa eu accumsan venenatis, turpis dolor laoreet enim, nec tempus tortor urna ac ante. Nam sed metus ut augue gravida ultricies.',
          author: {
            name: 'Steven McGrath',
            dpsu: 'Hindustan Aeronautics Limited'
          },
          date: 1551241280629,
        },
        {
          id: '1234-5678-1234-5678',
          title: 'How to make a quality steel bend',
          description: 'In bibendum nisi ut molestie cursus. Maecenas in justo lectus. Nunc aliquam, odio non aliquam eleifend, ante magna venenatis erat, sit amet pellentesque purus magna rhoncus arcu. Fusce id vehicula nunc. In id est vitae justo consectetur imperdiet. Vestibulum volutpat eros a dolor pellentesque pretium. Pellentesque tincidunt viverra malesuada. Nullam eu magna sed enim sollicitudin porttitor gravida quis lacus.',
          author: {
            name: 'Mark Allen',
            dpsu: 'Goa Shipyard Limited'
          },
          date: 1551241280629,
        },
        {
          id: '5678-1234-5678-1234',
          title: 'Thing I wish I knew before starting my first gear development',
          description: 'Aenean semper a sem quis semper. Cras sit amet elit vestibulum, lacinia nibh eu, pretium augue. Curabitur lacinia aliquet justo, et mattis tellus. Nam cursus id libero ac pretium. Suspendisse at aliquam nunc. Sed suscipit sem at sapien consectetur, a rhoncus metus laoreet. Fusce vitae tortor auctor, lobortis lorem in, efficitur dolor. Maecenas in ligula eu risus facilisis dictum et quis odio. Etiam dapibus, massa eu accumsan venenatis, turpis dolor laoreet enim, nec tempus tortor urna ac ante. Nam sed metus ut augue gravida ultricies.',
          author: {
            name: 'Steven McGrath',
            dpsu: 'Hindustan Aeronautics Limited'
          },
          date: 1551241280629,
        },

      ],
    })
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props
    const { value, featuredPosts } = this.state

    return (
      <div>
        <Tabs
          variant='scrollable'
          scrollButtons='auto'
          value={value}
          onChange={this.handleChange}
          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
        >
          <Tab
            component={Link}
            to={`/trending`}
            disableRipple
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
            label="HOME"
          />
          {this.state.dpsus.map(dpsu => {
            return <Tab
              key={dpsu}
              component={Link}
              to={`${this.props.match.path}/${dpsu}`}
              disableRipple
              classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
              label={`${dpsu}`.toUpperCase()}
            />
          })}
        </Tabs>
        <main>
          <Route path={`${this.props.match.path}/:dpsu`} component={ArticleList} />
          <Route exact path={`${this.props.match.path}`} render={() => {
            return <Grid container direction='column' spacing={24} className={classes.gridContainer}>
              {featuredPosts.map((post, i) => (
                <ArticleCard key={i} post={post} />
              ))}
            </Grid>
          }} />
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(App);
