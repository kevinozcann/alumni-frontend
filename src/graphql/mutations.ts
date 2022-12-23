/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      name
      family_name
      email
      owner
      picture
      posts {
        items {
          id
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      name
      family_name
      email
      owner
      picture
      posts {
        items {
          id
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      name
      family_name
      email
      owner
      picture
      posts {
        items {
          id
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
export const createPerson = /* GraphQL */ `
  mutation CreatePerson(
    $input: CreatePersonInput!
    $condition: ModelPersonConditionInput
  ) {
    createPerson(input: $input, condition: $condition) {
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
export const updatePerson = /* GraphQL */ `
  mutation UpdatePerson(
    $input: UpdatePersonInput!
    $condition: ModelPersonConditionInput
  ) {
    updatePerson(input: $input, condition: $condition) {
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
export const deletePerson = /* GraphQL */ `
  mutation DeletePerson(
    $input: DeletePersonInput!
    $condition: ModelPersonConditionInput
  ) {
    deletePerson(input: $input, condition: $condition) {
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
export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
      id
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
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
      id
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
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
      id
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
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
      id
      content
      postID
      post {
        id
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
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
      id
      content
      postID
      post {
        id
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
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
      id
      content
      postID
      post {
        id
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
