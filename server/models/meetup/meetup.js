// meetup document/record

/* eslint-disable */
class MeetupRecord {
  constructor(topic, location, happeningOn) {
    this.topic = topic;
    this.location = location;
    this.happeningOn = happeningOn;

    this.createdOn = new Date();
    this.images = [];
    this.tags = []
  }
}


// meetup model
class Meetup {
  constructor() {
    this.meetups = [];
  }

  create(meetupData) {

    const { topic, location, happeningOn } = meetupData;
    const meetup = new MeetupRecord(topic, location, happeningOn);

    this.meetups.push(meetup);
  }

  destroy(id) {
    const newMeetups = this.meetups.filter(meetup => meetup.id !== id);
    this.meetups = newMeetups;
  }

  update(id, data) {

  }
}

export default Meetup;