import React from 'react'

import { CommentForm } from './CommentForm';
import { CommentBox } from './CommentBox';

export default class CommentSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allComments: this.props.comments.slice(),
      shouldUpdate: false
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const updateNow = this.state.shouldUpdate;
    if (updateNow) {
      this.setState({shouldUpdate: false})
    }
    return updateNow;
  }


  updateComments = (comments) => {
    this.setState({
      allComments: comments,
      shouldUpdate: true
    });
  }

  buildCommentTree = (comments, parentId) => {
    var output = [];
    for (let i = 0; i < comments.length; i++) {
      var comment = comments[i];

      if (comment.reply_to === parentId) {
        comment.children = this.buildCommentTree(comments, comment.comment_id);
        output.push(comment);
      }

    }
    return output;
  }

  buildFirstLayerComment = (comment) => {
    return (
      <div key={comment.comment_id}>
        <CommentBox comment={comment} parentUser={null} puzzle_id={this.props.puzzle_id} updateComments={i => this.updateComments(i)} />
      </div>
    )
  }

  buildOtherLayerComment = (comment, parentUser) => {

    if (comment.children.length === 0) {
      return ([
        <div key={comment.comment_id}>
          <CommentBox comment={comment} parentUser={parentUser} puzzle_id={this.props.puzzle_id} updateComments={i => this.updateComments(i)} />
        </div>
      ])
    }
    var output = []
    if (parentUser !== null) {
      output.push(
        <div key={comment.comment_id}>
          <CommentBox comment={comment} parentUser={parentUser} puzzle_id={this.props.puzzle_id} updateComments={i => this.updateComments(i)} />
        </div>
      )
    }

    for (let i = 0; i < comment.children.length; i++) {
      output = output.concat(this.buildOtherLayerComment(comment.children[i], comment.username));
    }
    return output;
  }

  buildCommentsInJsx = (commentTree) => {
    var output = [];
    for (let i = 0; i < commentTree.length; i++) {
      output.push(this.buildFirstLayerComment(commentTree[i]));
      if (commentTree[i].children.length !== 0) {
        output = output.concat(this.buildOtherLayerComment(commentTree[i], null));
      }
    }
    return output.reverse();
  }

  render() {
    const commentsInTreeForm = this.buildCommentTree(this.state.allComments.slice(), null);
    const commentArrayInJsx = this.buildCommentsInJsx(commentsInTreeForm);

    return (
      <div className="m-5">
        <h2 className="my-5">Comments</h2>
        <CommentForm puzzle_id={this.props.puzzle_id} updateComments={i => this.updateComments(i)} />
        {commentArrayInJsx}
      </div>
    )
  }
}
