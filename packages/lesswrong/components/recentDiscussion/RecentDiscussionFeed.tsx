import React, { useState, useCallback, useRef } from 'react';
import { Components, registerComponent } from '../../lib/vulcan-lib';
import { useCurrentUser } from '../common/withUser';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { useGlobalKeydown } from '../common/withGlobalKeydown';
import { forumTypeSetting } from '../../lib/instanceSettings';
import { AnalyticsContext } from '../../lib/analyticsEvents';

const isEAForum = forumTypeSetting.get() === "EAForum"
const isPersonalBlogSite = forumTypeSetting.get() === "Personal"

const RecentDiscussionFeed = ({
  commentsLimit, maxAgeHours, af,
  title="Recent Discussion", shortformButton=true
}: {
  commentsLimit?: number,
  maxAgeHours?: number,
  af?: boolean,
  title?: string,
  shortformButton?: boolean,
}) => {
  const [expandAllThreads, setExpandAllThreads] = useState(false);
  const [showShortformFeed, setShowShortformFeed] = useState(false);
  const refetchRef = useRef<null|(()=>void)>(null);
  const currentUser = useCurrentUser();
  const expandAll = currentUser?.noCollapseCommentsFrontpage || expandAllThreads
  
  useGlobalKeydown(event => {
    const F_Key = 70
    if ((event.metaKey || event.ctrlKey) && event.keyCode == F_Key) {
      setExpandAllThreads(true);
    }
  });
  
  const toggleShortformFeed = useCallback(
    () => {
      setShowShortformFeed(!showShortformFeed);
    },
    [setShowShortformFeed, showShortformFeed]
  );
  
  const {
    SingleColumnSection,
    SectionTitle,
    SectionButton,
    ShortformSubmitForm,
    MixedTypeFeed,
    RecentDiscussionThread,
    RecentDiscussionTagRevisionItem,
    RecentDiscussionTag,
    RecentDiscussionSubscribeReminder,
    RecentDiscussionMeetupsPoke,
    AnalyticsInViewTracker,
  } = Components;
  
  const refetch = useCallback(() => {
    if (refetchRef.current)
      refetchRef.current();
  }, [refetchRef]);

  return (
    <AnalyticsContext pageSectionContext="recentDiscussion">
      <AnalyticsInViewTracker eventProps={{inViewType: "recentDiscussion"}}>
        <SingleColumnSection>
          <SectionTitle title={title}>
            {currentUser?.isReviewed && shortformButton && !currentUser.allCommentingDisabled && <div onClick={toggleShortformFeed}>
              <SectionButton>
                <AddBoxIcon />
                New Shortform Post
              </SectionButton>
            </div>}
          </SectionTitle>
          {showShortformFeed && <ShortformSubmitForm successCallback={refetch}/>}
          <MixedTypeFeed
            firstPageSize={10}
            pageSize={20}
            refetchRef={refetchRef}
            resolverName="RecentDiscussionFeed"
            sortKeyType="Date"
            resolverArgs={{ af: 'Boolean' }}
            resolverArgsValues={{ af }}
            fragmentArgs={{
              commentsLimit: 'Int',
              maxAgeHours: 'Int',
              tagCommentsLimit: 'Int',
            }}
            fragmentArgsValues={{
              commentsLimit, maxAgeHours,
              tagCommentsLimit: commentsLimit,
            }}
            renderers={{
              postCommented: {
                fragmentName: "PostsRecentDiscussion",
                render: (post: PostsRecentDiscussion) => (
                  <RecentDiscussionThread
                    post={post}
                    refetch={refetch}
                    comments={post.recentComments}
                    expandAllThreads={expandAll}
                  />
                )
              },
              tagDiscussed: {
                fragmentName: "TagRecentDiscussion",
                render: (tag: TagRecentDiscussion) => (
                  <RecentDiscussionTag
                    tag={tag}
                    refetch={refetch}
                    comments={tag.recentComments}
                    expandAllThreads={expandAll}
                  />
                )
              },
              tagSubforumCommented: {
                fragmentName: "TagRecentSubforumComments",
                render: (tag: TagRecentSubforumComments) => (
                  <RecentDiscussionTag
                    tag={tag}
                    refetch={refetch}
                    comments={tag.recentComments}
                    expandAllThreads={expandAll}
                    tagCommentType={"SUBFORUM"}
                  />
                )
              },
              tagRevised: {
                fragmentName: "RevisionTagFragment",
                render: (revision: RevisionTagFragment) => <div>
                  {revision.tag && <RecentDiscussionTagRevisionItem
                    tag={revision.tag}
                    revision={revision}
                    headingStyle="full"
                    documentId={revision.documentId}
                  />}
                </div>,
              },
              subscribeReminder: {
                fragmentName: null,
                render: () => <RecentDiscussionSubscribeReminder/>
              },
              meetupsPoke: {
                fragmentName: null,
                render: () => isEAForum || isPersonalBlogSite ? null : <RecentDiscussionMeetupsPoke/>
              },
            }}
          />
        </SingleColumnSection>
      </AnalyticsInViewTracker>
    </AnalyticsContext>
  )
}

const RecentDiscussionFeedComponent = registerComponent('RecentDiscussionFeed', RecentDiscussionFeed, {
  areEqual: "auto",
});

declare global {
  interface ComponentTypes {
    RecentDiscussionFeed: typeof RecentDiscussionFeedComponent,
  }
}
