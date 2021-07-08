export default {
  async meetups(_, args, { meetupService }) {
    const allMeetups = await meetupService.getMeetups(args);
    return allMeetups;
  },

  async questions(_, _args, { questionService }) {
    const allQuestions = await questionService.getQuestions();
    return allQuestions;
  }
};
