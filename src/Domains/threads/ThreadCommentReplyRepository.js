class ThreadCommentReplyRepository {
  async addNewReplyComment(addNewThreadCommentReply) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getCommentRepliesByCommentIds(commentIds) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyThreadCommentReplyAndCommentReplyOwner({ threadCommentId, userId }) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteCommentReplyById(threadCommentId) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadCommentReplyRepository;
