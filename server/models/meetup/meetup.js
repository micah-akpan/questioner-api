// meetup document/record

/* eslint-disable */
class MeetupRecord {
  constructor(id, topic, location, happeningOn) {
    this.id = id;
    this.topic = topic;
    this.location = location;
    this.happeningOn = happeningOn;

    this.createdOn = new Date();
    this.images = [];
    this.tags = []
  }

  static generateMeetupId() {

  }
}


// meetup model
class Meetup {
  constructor() {
    this.meetups = [];

    this.create = this.create.bind(this);
  }

  create(meetupData) {

    const lastMeetupId = this.meetups[this.meetups.length - 1];
    const currentMeetupId = lastMeetupId + 1;

    const { topic, location, happeningOn } = meetupData;

    const meetup = new MeetupRecord(currentMeetupId, topic, location, happeningOn);
    this.meetups.push(meetup);

    return meetup;
  }

  destroy(id) {
    const newMeetups = this.meetups.filter(meetup => meetup.id !== id);
    this.meetups = newMeetups;
  }

  update(id, data) {

  }

  findAll() {
    return this.meetups;
  }

  clean() {
    this.meetups = [];
  }

  getAllMeetups() {
    return this.meetups;
  }
}

export default new Meetup();