import meetupRaw from '../data/meetup';
import { omitProps } from '../utils';

let meetups = JSON.parse(meetupRaw);

export default {

  getAllMeetups(req, res) {
    return res.status(200).send({
      status: 200,
      data: meetups
    });
  },

  createNewMeetup(req, res) {
    const {
      location, images, topic, happeningOn, tags
    } = req.body;

    const lastMeetupId = meetups[meetups.length - 1].id;

    /* These validations aren't necessary
       as a schema validation middleware
       has been added
       only kept for reference
    */
    if (!topic || !location || !happeningOn) {
      return res.status(400)
        .send({
          status: 400,
          error: 'The topic, location and happeningOn fields are required fields'
        });
    }

    if (Number.isNaN(new Date(happeningOn).getTime())) {
      return res.status(422)
        .send({
          status: 422,
          error: 'You provided an invalid meetup date'
        });
    }

    if (new Date(happeningOn).getTime() < new Date().getTime()) {
      return res.status(422).send({
        status: 422,
        error: 'Meetup Date provided is in the past, provide a future date'
      });
    }

    const newMeetup = {
      topic,
      location,
      happeningOn,
      id: lastMeetupId + 1,
      createdOn: new Date(),
      images: images || [],
      tags: tags || []
    };

    meetups.push(newMeetup);

    const mRecord = omitProps(newMeetup, ['createdOn', 'images', 'id']);

    return res.status(201).send({
      status: 201,
      data: [mRecord]
    });
  },

  getSingleMeetup(req, res) {
    const meetupRecord = meetups.filter(
      meetup => String(meetup.id) === req.params.id
    )[0];

    if (meetupRecord) {
      const mRecord = omitProps(meetupRecord, ['createdOn', 'images']);

      res.status(200)
        .send({
          status: 200,
          data: [mRecord],
        });
    } else {
      res.status(404)
        .send({
          status: 404,
          error: 'The requested meetup does not exist'
        });
    }
  },

  deleteMeetup(req, res) {
    const mRecords = meetups.filter(meetup => String(meetup.id) === req.params.id);

    if (mRecords.length === 0) {
      return res.status(404).send({
        status: 404,
        error: 'The requested meetup with the cannot be deleted because it does not exist'
      });
    }

    const newMeetupRecords = meetups.filter(meetup => String(meetup.id) !== req.params.id);
    meetups = newMeetupRecords;

    return res.status(200)
      .send({
        status: 200,
        data: []
      });
  },

  getUpcomingMeetups(req, res) {
    const now = new Date().getTime();

    const upComingMeetups = meetups.filter(
      meetup => new Date(meetup.happeningOn).getTime() >= now
    );

    if (!upComingMeetups.length) {
      res.status(404).send({
        status: 404,
        error: 'There are no upcoming meetups'
      });
    } else {
      const mRecords = upComingMeetups.map(
        meetup => omitProps(meetup, ['createdOn', 'images'])
      );

      res.status(200).send({
        status: 200,
        data: mRecords
      });
    }
  },

  searchMeetups(req, res) {
    const searchValue = req.query.searchTerm.toLowerCase();

    // every match is by a lowercase version of the search term value
    // search by topic
    const meetupsByTopic = meetups.filter(meetup => meetup.topic.toLowerCase().match(searchValue));

    // search by location
    const meetupsByLocation = meetups.filter(
      meetup => meetup.location.toLowerCase().match(searchValue)
    );

    // search by tag
    const meetupsByTags = meetups.filter(meetup => meetup.tags.includes(searchValue));

    const allMeetups = [...meetupsByTopic, ...meetupsByLocation, ...meetupsByTags];

    // remove duplicates
    const hash = {};
    allMeetups.forEach((meetup) => {
      hash[meetup.id] = meetup;
    });

    const filteredMeetups = Object.values(hash);

    if (allMeetups.length) {
      res.status(200).send({
        status: 200,
        data: filteredMeetups
      });
    } else {
      res.status(404).send({
        status: 404,
        error: `No meetups match with this search: ${searchValue}`
      });
    }
  }
};
