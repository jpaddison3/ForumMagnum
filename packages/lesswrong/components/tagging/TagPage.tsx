import React from 'react';
import { Components, registerComponent } from '../../lib/vulcan-lib';
import { useMulti } from '../../lib/crud/withMulti';
import { useLocation } from '../../lib/routeUtil';
import { TagRels } from '../../lib/collections/tagRels/collection';
import { useTagBySlug } from './useTag';
import Users from '../../lib/collections/users/collection';
import { Link } from '../../lib/reactRouterWrapper';
import { useCurrentUser } from '../common/withUser';
import { postBodyStyles } from '../../themes/stylePiping'
import {AnalyticsContext} from "../../lib/analyticsEvents";
import * as _ from 'underscore';

const styles = theme => ({
  description: {
    ...postBodyStyles(theme),
    marginBottom: 16,
  },
  loadMore: {
    flexGrow: 1,
    textAlign: "left"
  }
});

const TagPage = ({classes}: {
  classes: ClassesType
}) => {
  const { SingleColumnSection, SectionTitle, PostsList2, SectionButton, ContentItemBody, Loading, Error404, LoadMore } = Components;
  const currentUser = useCurrentUser();
  const { query, params } = useLocation();
  const { slug } = params;
  const { tag, loading: loadingTag } = useTagBySlug(slug);

  if (loadingTag)
    return <Loading/>
  if (!tag)
    return <Error404/>

  const terms = {
    ...query,
    filterSettings: {tags:[{tagId: "tNsqhzTibgGJKPEWB", tagName: "Coronavirus", filterMode: "Required"}]},
    view: "tagRelevance",
    limit: 15,
    itemsPerPage: 200,
    extraVariables: {
      tagId: 'String'
    },
    extraVariablesValues: {
      tagId: tag._id
    }
  }

  return <AnalyticsContext pageContext='tagPage' tagContext={tag.name}>
    <SingleColumnSection>
      <SectionTitle title={`${tag.name} Tag`}>
        {Users.isAdmin(currentUser) && <SectionButton>
          <Link to={`/tag/${tag.slug}/edit`}>Edit</Link>
        </SectionButton>}
      </SectionTitle>
      <ContentItemBody
        dangerouslySetInnerHTML={{__html: tag.description?.html}}
        description={`tag ${tag.name}`}
        className={classes.description}
      />
      <PostsList2 
        terms={terms} 
        enableTotal 
        tagId={tag._id}
      />
    </SingleColumnSection>
  </AnalyticsContext>
}

const TagPageComponent = registerComponent("TagPage", TagPage, {styles});

declare global {
  interface ComponentTypes {
    TagPage: typeof TagPageComponent
  }
}
