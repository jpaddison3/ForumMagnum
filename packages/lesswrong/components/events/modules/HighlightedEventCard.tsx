import React from 'react';
import { registerComponent } from '../../../lib/vulcan-lib';
import { Link } from '../../../lib/reactRouterWrapper';
import { createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import { prettyEventDateTimes } from '../../../lib/collections/posts/helpers';
import { useTimezone } from '../../common/withTimezone';
import { cloudinaryCloudNameSetting } from '../../../lib/publicSettings';
import { useTracking } from '../../../lib/analyticsEvents';

// space pic for events with no img
export const DEFAULT_EVENT_IMG = 'Banner/yeldubyolqpl3vqqy0m6'

const styles = createStyles((theme: ThemeType): JssStyles => ({
  root: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 800,
    height: 350,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    background: theme.palette.primary.main,
    textAlign: 'center',
    color: 'white',
    borderRadius: 0,
    overflow: 'visible',
    margin: 'auto',
    [theme.breakpoints.down('xs')]: {
      marginLeft: -4,
      marginRight: -4,
    }
  },
  content: {
    overflow: 'visible'
  },
  spinnerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  spinner: {
    color: 'white'
  },
  row: {
    marginTop: 8
  },
  title: {
    ...theme.typography.headline,
    display: 'inline',
    background: 'black',
    '-webkit-box-decoration-break': 'clone',
    boxDecorationBreak: 'clone',
    fontSize: 36,
    lineHeight: '1.4em',
    color: 'white',
    padding: '0.5rem',
    marginBottom: 5,
    [theme.breakpoints.down('sm')]: {
      fontSize: 32,
    }
  },
  group: {
    ...theme.typography.commentStyle,
    display: 'inline',
    background: 'black',
    '-webkit-box-decoration-break': 'clone',
    boxDecorationBreak: 'clone',
    fontSize: 14,
    fontStyle: 'italic',
    padding: '0.5rem',
    marginBottom: 30,
  },
  detail: {
    ...theme.typography.commentStyle,
    display: 'inline',
    background: 'black',
    '-webkit-box-decoration-break': 'clone',
    boxDecorationBreak: 'clone',
    fontSize: 18,
    lineHeight: '1.4em',
    color: "#d4d4d4",
    padding: '0.5rem',
    marginBottom: 10
  },
  addToCal: {
    ...theme.typography.commentStyle,
    position: 'absolute',
    top: 20,
    right: 20,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },

}))


const HighlightedEventCard = ({event, loading, classes}: {
  event?: PostsList,
  loading: boolean,
  classes: ClassesType,
}) => {
  const { timezone } = useTimezone()
  const { captureEvent } = useTracking()
  
  const getEventLocation = (event: PostsList): string => {
    if (event.onlineEvent) return 'Online'
    return event.location ? event.location.slice(0, event.location.lastIndexOf(',')) : ''
  }
  
  const cloudinaryCloudName = cloudinaryCloudNameSetting.get()
  // the default img and color here should probably be forum-dependent
  const eventImg = event?.eventImageId || DEFAULT_EVENT_IMG
  const cardBackground = {
    backgroundImage: `linear-gradient(rgba(0, 87, 102, 0.6), rgba(0, 87, 102, 0.6)), url(https://res.cloudinary.com/${cloudinaryCloudName}/image/upload/c_fill,g_custom,h_350,w_800/${eventImg})`
  }
  
  if (loading) {
    return <Card className={classes.root}>
      <div className={classes.spinnerContainer}>
        <CircularProgress className={classes.spinner}/>
      </div>
    </Card>
  }
  
  // if there's no event to show, default to showing EA Global
  if (!event) {
    return (
      <Card className={classes.root} style={cardBackground}>
        <CardContent className={classes.content}>
          <div>
            <h1 className={classes.title}>
              <a href="https://www.eaglobal.org/" onClick={() => captureEvent('highlightedEventClicked')}>
                Effective Altruism Global
              </a>
            </h1>
          </div>
          <div className={classes.row}>
            <span className={classes.detail}>
              Conferences in various locations
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
      <Card className={classes.root} style={cardBackground}>
        <CardContent className={classes.content}>
          <div>
            <span className={classes.detail}>
              {prettyEventDateTimes(event, timezone, true)}
            </span>
          </div>
          <div className={classes.row}>
            <h1 className={classes.title}>
              <Link to={`/events/${event._id}/${event.slug}`} onClick={() => captureEvent('highlightedEventClicked')}>
                {event.title}
              </Link>
            </h1>
          </div>
          <div className={classes.row}>
            <span className={classes.detail}>
              {getEventLocation(event)}
            </span>
          </div>
        </CardContent>
      </Card>
  )
}

const HighlightedEventCardComponent = registerComponent('HighlightedEventCard', HighlightedEventCard, {styles});

declare global {
  interface ComponentTypes {
    HighlightedEventCard: typeof HighlightedEventCardComponent
  }
}
