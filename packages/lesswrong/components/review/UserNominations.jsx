import { Components, registerComponent, useMulti } from 'meteor/vulcan:core';
import React from 'react';
import { useLocation } from '../../lib/routeUtil';
import Users from 'meteor/vulcan:users';

const UserNominations = () => {
  const { params: { slug } } = useLocation();
  const { results, loading, error } = useMulti({
    collection: Users,
    queryName: 'usersSingleQuery',
    fragmentName: 'UsersProfile',
    enableTotal: false,
    ssr: true,
    terms: {view: 'usersProfile', slug}
  });

  const user = results?.length ? results[0] : null
  const { SingleColumnSection, RecentComments, SectionTitle, Loading, Error404 } = Components

  if (loading) return <Loading />
  if (error) return <Error404 />

  const nominationTerms = { 
    view: "nominations2018",
    userId: user._id,
    limit: 50
  }

  const reviewTerms = { 
    view: "reviews2018",
    userId: user._id,
    limit: 50
  }

  return (
    <SingleColumnSection>
      <SectionTitle title={`${user.displayName}'s 2018 Reviews`}/>
      <RecentComments terms={reviewTerms} noResultsMessage="No Reviews Found"/>
      <SectionTitle title={`${user.displayName}'s 2018 Nominations`}/>
      <RecentComments terms={nominationTerms} noResultsMessage="No Nominations Found"/>
    </SingleColumnSection>
  )

};

registerComponent('UserNominations', UserNominations);
