import React from 'react'
import { Components, registerComponent } from '../../lib/vulcan-lib'
import { useCurrentUser } from '../common/withUser'

const HomePersonalBlogSite = () => {
  const currentUser = useCurrentUser();
  const { RecentDiscussionFeed, HomeLatestPosts, StickiedPosts } = Components

  const recentDiscussionCommentsPerPost = (currentUser && currentUser.isAdmin) ? 4 : 3;

  return (
    <React.Fragment>
      <StickiedPosts />
      
      <HomeLatestPosts />
      
      <RecentDiscussionFeed
        af={false}
        commentsLimit={recentDiscussionCommentsPerPost}
        maxAgeHours={18}
      />
    </React.Fragment>
  )
}

const HomePersonalBlogSiteComponent = registerComponent('HomePersonalBlogSite', HomePersonalBlogSite)

declare global {
  interface ComponentTypes {
    HomePersonalBlogSite: typeof HomePersonalBlogSiteComponent
  }
}
