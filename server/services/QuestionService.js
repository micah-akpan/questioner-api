class QuestionService {
  #db = null

  constructor(database) {
    this.db = database;
  }

  async getQuestions() {
    const { rows } = await this.db.queryDb({
      text: 'SELECT id, title, body, meetup, votes, createdby as user, createdon as "createdOn" FROM Question ORDER BY votes DESC'
    });
    return rows;
  }
}

export default QuestionService;
