import gql from 'graphql-tag';

export default gql(
  `    
    type Meetup {
      id: Int!
      topic: String!
      location: String!

      happeningOn: Date
      createdOn: Date
      images: [String]
      tags: [String]

      maxNumberOfAttendees: Int
    }

    type Question {
      id: Int!
      title: String!
      body: String!

      createdBy: Int! # id of the user that created this question
      meetup: Int! # id of the meetup this question is associated with
      votes: Int!

      createdOn: Date
    }

    type User {
      id: Int!
      firstname: String!
      lastname: String!
      othername: String
      
      email: String!
      password: String!
      phoneNumber: Int!

      username: String
      birthday: Date
      registered: Date
      isAdmin: Boolean

      bio: String
      avatar: String
    }

    type Comment {
      id: Int!
      body: String!
      question: Int!
      createdBy: Int!
      createdOn: Date
    }

    type Query {
      meetups (searchTerm: String): [Meetup]
      meetup(id: Int!): Meetup!
      upcomingMeetups: [Meetup]!

      meetupTags(id: Int!): [String!]
      meetupImages(meetupId: Int!): [String!]

      meetupImage(meetupId: Int!, imageId: Int!): String

      questions: [Question!]
    }

    scalar Date
    scalar Upload

    input MeetupData {
      topic: String!
      location: String!
    }

    type FileData {
      id: String!
      filename: String!
      mimetype: String!
      path: String
    }
    type Mutation {
      createMeetup(topic: String!, location: String!, happeningOn: Float, imageUrl: String!): Meetup!

      uploadMeetupImage(avatar: Upload!, topic: String): FileData

      createQuestion(title: String!, body: String!, meetupId: Int!): Question
    }
  `
);
