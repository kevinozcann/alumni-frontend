/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onCreateUser(filter: $filter, owner: $owner) {
      id
      name
      family_name
      email
      owner
      picture
      posts {
        items {
          id
          type
          content
          userID
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      comments {
        items {
          id
          content
          postID
          userID
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onUpdateUser(filter: $filter, owner: $owner) {
      id
      name
      family_name
      email
      owner
      picture
      posts {
        items {
          id
          type
          content
          userID
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      comments {
        items {
          id
          content
          postID
          userID
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onDeleteUser(filter: $filter, owner: $owner) {
      id
      name
      family_name
      email
      owner
      picture
      posts {
        items {
          id
          type
          content
          userID
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      comments {
        items {
          id
          content
          postID
          userID
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreatePerson = /* GraphQL */ `
  subscription OnCreatePerson(
    $filter: ModelSubscriptionPersonFilterInput
    $owner: String
  ) {
    onCreatePerson(filter: $filter, owner: $owner) {
      id
      ssn_number
      school_number
      name
      second_name
      last_name
      birth_date
      gender
      student_picture
      occupation
      graduation_period
      graduation_status
      education_status
      marital_status
      phone_number
      email
      linkedin_url
      twitter_url
      facebook_url
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdatePerson = /* GraphQL */ `
  subscription OnUpdatePerson(
    $filter: ModelSubscriptionPersonFilterInput
    $owner: String
  ) {
    onUpdatePerson(filter: $filter, owner: $owner) {
      id
      ssn_number
      school_number
      name
      second_name
      last_name
      birth_date
      gender
      student_picture
      occupation
      graduation_period
      graduation_status
      education_status
      marital_status
      phone_number
      email
      linkedin_url
      twitter_url
      facebook_url
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeletePerson = /* GraphQL */ `
  subscription OnDeletePerson(
    $filter: ModelSubscriptionPersonFilterInput
    $owner: String
  ) {
    onDeletePerson(filter: $filter, owner: $owner) {
      id
      ssn_number
      school_number
      name
      second_name
      last_name
      birth_date
      gender
      student_picture
      occupation
      graduation_period
      graduation_status
      education_status
      marital_status
      phone_number
      email
      linkedin_url
      twitter_url
      facebook_url
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onCreatePost(filter: $filter, owner: $owner) {
      id
      type
      content
      userID
      user {
        id
        name
        family_name
        email
        owner
        picture
        posts {
          nextToken
        }
        comments {
          nextToken
        }
        createdAt
        updatedAt
      }
      comments {
        items {
          id
          content
          postID
          userID
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onUpdatePost(filter: $filter, owner: $owner) {
      id
      type
      content
      userID
      user {
        id
        name
        family_name
        email
        owner
        picture
        posts {
          nextToken
        }
        comments {
          nextToken
        }
        createdAt
        updatedAt
      }
      comments {
        items {
          id
          content
          postID
          userID
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onDeletePost(filter: $filter, owner: $owner) {
      id
      type
      content
      userID
      user {
        id
        name
        family_name
        email
        owner
        picture
        posts {
          nextToken
        }
        comments {
          nextToken
        }
        createdAt
        updatedAt
      }
      comments {
        items {
          id
          content
          postID
          userID
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment(
    $filter: ModelSubscriptionCommentFilterInput
    $owner: String
  ) {
    onCreateComment(filter: $filter, owner: $owner) {
      id
      content
      postID
      post {
        id
        type
        content
        userID
        user {
          id
          name
          family_name
          email
          owner
          picture
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      userID
      user {
        id
        name
        family_name
        email
        owner
        picture
        posts {
          nextToken
        }
        comments {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment(
    $filter: ModelSubscriptionCommentFilterInput
    $owner: String
  ) {
    onUpdateComment(filter: $filter, owner: $owner) {
      id
      content
      postID
      post {
        id
        type
        content
        userID
        user {
          id
          name
          family_name
          email
          owner
          picture
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      userID
      user {
        id
        name
        family_name
        email
        owner
        picture
        posts {
          nextToken
        }
        comments {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment(
    $filter: ModelSubscriptionCommentFilterInput
    $owner: String
  ) {
    onDeleteComment(filter: $filter, owner: $owner) {
      id
      content
      postID
      post {
        id
        type
        content
        userID
        user {
          id
          name
          family_name
          email
          owner
          picture
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      userID
      user {
        id
        name
        family_name
        email
        owner
        picture
        posts {
          nextToken
        }
        comments {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
