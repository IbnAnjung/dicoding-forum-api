/* eslint-disable no-param-reassign */
class GetThreadDetailUseCase {
  constructor({
    threadRepository,
    threadCommentRepository,
    threadCommentReplyRepository,
    userCommentLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._threadCommentReplyRepository = threadCommentReplyRepository;
    this._userCommentLikeRepository = userCommentLikeRepository;
  }

  async execute({ threadId }) {
    const thread = await this._threadRepository.getDetailThreadById(threadId);
    if (!thread) {
      throw new Error('THREAD_DETAIL.THREAD_NOT_FOUND');
    }

    const comments = await this._threadCommentRepository.getCommentByThreadId(threadId);
    const commentIds = comments.map((comment) => comment.id);
    const commentByIds = [];
    await comments.forEach((comment) => {
      const newComment = comment;
      newComment.replies = [];
      commentByIds[comment.id] = newComment;
    });
    const replies = await this._threadCommentReplyRepository
      .getCommentRepliesByCommentIds(commentIds);
    replies.forEach((reply) => {
      const newReply = reply;
      if (newReply.deleted) {
        newReply.content = '**balasan telah dihapus**';
      }
      delete newReply.deleted;
      newReply.date = newReply.created_at;
      delete newReply.created_at;
      commentByIds[newReply.comment_id].replies.push(newReply);
    });

    const commentLikeById = [];
    const commentLikes = await this._userCommentLikeRepository.countLikeByCommentIds(commentIds);
    await commentLikes.forEach((commentLike) => {
      commentLikeById[commentLike.comment_id] = commentLike.total_like;
    });

    thread.comments = [];
    comments.forEach((comment) => {
      const newComment = commentByIds[comment.id];
      if (commentLikeById[comment.id] !== undefined) {
        newComment.likeCount = Number(commentLikeById[comment.id]);
      } else {
        newComment.likeCount = 0;
      }

      if (newComment.deleted) {
        newComment.content = '**komentar telah dihapus**';
      }

      delete newComment.deleted;
      thread.comments.push(newComment);
    });

    return thread;
  }
}

module.exports = GetThreadDetailUseCase;
