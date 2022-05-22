import React from 'react'
import PropTypes from 'prop-types'
// import generateKey from '../utils/generateKey'
import returnFeedMessage from '../utils/returnFeedMessage'
import returnFeedData from '../utils/returnFeedData'
import EmptyFeed from './EmptyFeed'

export default function AlbumFeed ({ feedName, feedData }) {
  return (
    <section>
      {returnFeedData(feedData).length === 0 ? <EmptyFeed message={returnFeedMessage(feedName)} /> : null}
    </section>
  )
}

AlbumFeed.propTypes = {
  feedName: PropTypes.string,
  feedData: PropTypes.array
}
