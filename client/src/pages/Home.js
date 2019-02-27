import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import ArticleCard from '../components/ArticleCard'

const styles = theme => ({
  gridContainer: {
    padding: "20px 10px",
  },
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      featuredPosts: [],
    }
  }

  componentDidMount() {
    this.setState({
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

  render() {
    const { classes } = this.props
    const { featuredPosts } = this.state

    return (
      <Grid container direction='column' spacing={24} className={classes.gridContainer}>
        {featuredPosts.map((post, i) => (
          <ArticleCard key={i} post={post} />
        ))}
      </Grid>
    );
  }
}

export default withStyles(styles)(App);
