import React, { PureComponent } from 'react';
import { registerComponent, withMessages, withUpdate, Components } from 'meteor/vulcan:core';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo'
import { Comments } from "../../../lib/collections/comments";
import withUser from '../../common/withUser';
import Users from 'meteor/vulcan:users';
import ListItemIcon from '@material-ui/core/ListItemIcon';

class MoveToAlignmentMenuItem extends PureComponent {

  handleMoveToAlignmentForum = async () => {
    const { comment, updateComment, client, flash, currentUser, } = this.props
    await updateComment({
      selector: { _id: comment._id},
      data: {
        af: true,
        afDate: new Date(),
        moveToAlignmentUserId: currentUser._id
      },
    })
    client.resetStore()
    flash({id:"alignment.move_comment"})
  }

  handleRemoveFromAlignmentForum = async () => {
    const { comment, updateComment, client, flash } = this.props

    await updateComment({
      selector: { _id: comment._id},
      data: {
        af: false,
        afDate: null,
        moveToAlignmentUserId: null
      },
    })

    client.resetStore()
    flash({id:"alignment.remove_comment"})
  }

  render() {
    const { comment, post, currentUser } = this.props
    const { OmegaIcon } = Components
    if (post.af && Users.canDo(currentUser, 'comments.alignment.move.all')) {
      if (!comment.af) {
        return (
          <MenuItem onClick={ this.handleMoveToAlignmentForum}>
            <ListItemIcon>
              <OmegaIcon />
            </ListItemIcon>
            Move to Alignment
          </MenuItem>
        )
      } else if (comment.af) {
        return (
          <MenuItem onClick={ this.handleRemoveFromAlignmentForum }>
            <ListItemIcon>
              <OmegaIcon />
            </ListItemIcon>
            Remove from Alignment
          </MenuItem>
        )
      }
    } else  {
      return null
    }
  }
}

const withUpdateOptions = {
  collection: Comments,
  fragmentName: 'CommentsList',
}

registerComponent(
  'MoveToAlignmentMenuItem',
   MoveToAlignmentMenuItem,
   [withUpdate, withUpdateOptions],
   withMessages,
   withApollo,
   withUser
);
export default MoveToAlignmentMenuItem;
