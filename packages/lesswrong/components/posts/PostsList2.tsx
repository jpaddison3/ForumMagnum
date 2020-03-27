import { Components, registerComponent, Utils } from '../../lib/vulcan-lib';
import { useMulti } from '../../lib/crud/withMulti';
import React, { useState } from 'react';
import { Posts } from '../../lib/collections/posts';
import { FormattedMessage } from '../../lib/vulcan-i18n';
import classNames from 'classnames';
import { useTracking } from "../../lib/analyticsEvents";
import * as _ from 'underscore';

const Error = ({error}) => <div>
  <FormattedMessage id={error.id} values={{value: error.value}}/>{error.message}
</div>;

const styles = theme => ({
  itemIsLoading: {
    opacity: .4,
  },
  loading: {
    '&&:after': {
      content: "''",
      marginLeft: 0,
      marginRight: 0,
    }
  },
  loadMore: {
    flexGrow: 1,
    textAlign: "left",
    '&&:after': {
      content: "''",
      marginLeft: 0,
      marginRight: 0,
    }
  }
})

// A list of posts, defined by a query that returns them.
//
// Props:
//  * children: Child elements will be put in a footer section
//  * terms: The search terms used to select the posts that will be shown.
//  * dimWhenLoading: Apply a style that grays out the list while it's in a
//    loading state (default false)
//  * topLoading: show the loading state at the top of the list in addition to the bottom
//  * showLoading: Display a loading spinner while loading (default true)
//  * showLoadMore: Show a Load More link in the footer if there are potentially
//    more posts (default true)
//  * showNoResults: Show a placeholder if there are no results (otherwise
//    render only whiteness) (default true)
//  * hideLastUnread: If the initial set of posts ends with N consecutive
//    already-read posts, hide the last N-1 of them. Used for abbreviating
//    read posts from the Recently Curated section on the front page.
const PostsList2 = ({
  children, terms,
  dimWhenLoading = false,
  topLoading = false,
  showLoading = true,
  showLoadMore = true,
  showNoResults = true,
  hideLastUnread = false,
  showPostedAt = true,
  enableTotal=false,
  showNominationCount,
  showReviewCount,
  tagId,
  classes,
  dense,
  defaultToShowUnreadComments
}: {
  children?: React.ReactNode,
  terms?: any,
  dimWhenLoading?: boolean,
  topLoading?: boolean,
  showLoading?: boolean,
  showLoadMore?: boolean,
  showNoResults?: boolean,
  hideLastUnread?: boolean,
  showPostedAt?: boolean,
  enableTotal?: boolean,
  showNominationCount?: boolean,
  showReviewCount?: boolean,
  tagId?: string,
  classes: ClassesType,
  dense?: boolean,
  defaultToShowUnreadComments?: boolean,
}) => {
  const [haveLoadedMore, setHaveLoadedMore] = useState(false);
  const { results, loading, error, count, totalCount, loadMore, limit } = useMulti({
    terms: terms,
    collection: Posts,
    fragmentName: !!tagId ? 'PostsListTag' : 'PostsList',
    enableTotal: enableTotal,
    fetchPolicy: 'cache-and-network',
    ssr: true,
    itemsPerPage: 50,
    extraVariables: {
      tagId: "String"
    },
    extraVariablesValues: { tagId }
  });

  let hidePosts: Array<boolean>|null = null;
  if (hideLastUnread && results?.length && !haveLoadedMore) {
    // If the list ends with N sequential read posts, hide N-1 of them.
    let numUnreadAtEnd = 0;
    for (let i=results.length-1; i>=0; i--) {
      // FIXME: This uses the initial-load version of the read-status, and won't
      // update based on the client-side read status cache.
      if (results[i].isRead) numUnreadAtEnd++;
      else break;
    }
    if (numUnreadAtEnd > 1) {
      const numHiddenAtEnd = numUnreadAtEnd - 1;
      hidePosts = [..._.times(results.length-numHiddenAtEnd, i=>false), ..._.times(numHiddenAtEnd, i=>true)];
    }
  }


  // TODO-Q: Is there a composable way to check whether this is the second
  //         time that networkStatus === 1, in order to prevent the loading
  //         indicator showing up on initial pageload?
  //
  //         Alternatively, is there a better way of checking that this is
  //         in fact the best way of checking loading status?

  // TODO-A (2019-2-20): For now, solving this with a flag that determines whether
  //                     to dim the list during loading, so that the pages where that
  //                     behavior was more important can work fine. Will probably
  //                     fix this for real when Apollo 2 comes out
  

  const { Loading, PostsItem2, LoadMore, PostsNoResults, SectionFooter } = Components


  // We don't actually know if there are more posts here,
  // but if this condition fails to meet we know that there definitely are no more posts
  const maybeMorePosts = !!(results && results.length && (results.length >= limit))

  let orderedResults = results
  if (defaultToShowUnreadComments) {
    orderedResults = _.sortBy(results, (post) => {
      return !post.lastVisitedAt || (post.lastVisitedAt >=  Posts.getLastCommentedAt(post));
    })
  }

  //Analytics Tracking
  const postIds = (orderedResults||[]).map((post) => post._id)
  useTracking({eventType: "postList", eventProps: {postIds, hidePosts}, captureOnMount: eventProps => eventProps.postIds.length, skip: !postIds.length||loading})

  if (!orderedResults && loading) return <Loading />

  return (
    <div className={classNames({[classes.itemIsLoading]: loading && dimWhenLoading})}>
      {error && <Error error={Utils.decodeIntlError(error)} />}
      {loading && showLoading && (topLoading || dimWhenLoading) && <Loading />}
      {results && !results.length && showNoResults && <PostsNoResults />}


      {orderedResults && orderedResults.map((post, i) => {
        const props = { post, index: i, terms, showNominationCount, showReviewCount, dense, tagRel: post.tagRel, defaultToShowUnreadComments, showPostedAt, showQuestionTag: terms.filter!=="questions" }

        if (!(hidePosts && hidePosts[i])) return <PostsItem2 key={post._id} index={i} {...props} />
      })}
      {showLoadMore && <SectionFooter>
        {(showLoadMore) &&
          <div className={classes.loadMore}>
            <LoadMore
              loadMore={() => {
                loadMore();
                setHaveLoadedMore(true);
              }}
              disabled={!maybeMorePosts}
              count={count}
              totalCount={totalCount}
            />
            { !dimWhenLoading && showLoading && loading && <Loading />}
          </div>
        }
        { children }
      </SectionFooter>}
    </div>
  )
}

const PostsList2Component = registerComponent('PostsList2', PostsList2, {styles});

declare global {
  interface ComponentTypes {
    PostsList2: typeof PostsList2Component
  }
}

