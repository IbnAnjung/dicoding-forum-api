/* eslint-disable no-param-reassign */
class GetThreadDetailUseCase {
  constructor({ threadRepository, threadCommentRepository, threadCommentReplyRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._threadCommentReplyRepository = threadCommentReplyRepository;
  }

  async execute({ threadId }) {
    const thread = await this._threadRepository.getDetailThreadById(threadId);
    if (!thread) {
      throw new Error('THREAD_DETAIL.THREAD_NOT_FOUND');
    }

    const comments = await this._threadCommentRepository.getCommentByThreadId(threadId);
    const commentByIds = [];
    await comments.forEach((comment) => {
      const newComment = comment;
      newComment.replies = [];
      commentByIds[comment.id] = newComment;
    });
    const replies = await this._threadCommentReplyRepository
      .getCommentRepliesByCommentIds(comments.map((comment) => comment.id));
    replies.forEach((reply) => {
      const newReply = reply;
      if (newReply.deleted) {
        newReply.content = '**balasan telah dihapus**';
      }
      delete newReply.deleted;
      commentByIds[newReply.comment].replies.push(newReply);
    });
    thread.comments = [];
    comments.forEach((comment) => {
      const newComment = commentByIds[comment.id];
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
