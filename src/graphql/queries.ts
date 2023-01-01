/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserPicture = /* GraphQL */ `
  query GetUserPicture($picture: String) {
    getUserPicture(picture: $picture)
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      family_name
      email
      owner
      avatarUrl
      avatarKey
      wallpaperUrl
      wallpaperKey
      posts {
        items {
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
            avatarUrl
            avatarKey
            wallpaperUrl
            wallpaperKey
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
              userCommentsId
              owner
            }
            nextToken
          }
          createdAt
          updatedAt
          userPostsId
          owner
        }
        nextToken
      }
      comments {
        items {
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
              avatarUrl
              avatarKey
              wallpaperUrl
              wallpaperKey
              createdAt
              updatedAt
            }
            comments {
              nextToken
            }
            createdAt
            updatedAt
            userPostsId
            owner
          }
          userID
          user {
            id
            name
            family_name
            email
            owner
            avatarUrl
            avatarKey
            wallpaperUrl
            wallpaperKey
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
          userCommentsId
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        family_name
        email
        owner
        avatarUrl
        avatarKey
        wallpaperUrl
        wallpaperKey
        posts {
          items {
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
              avatarUrl
              avatarKey
              wallpaperUrl
              wallpaperKey
              createdAt
              updatedAt
            }
            comments {
              nextToken
            }
            createdAt
            updatedAt
            userPostsId
            owner
          }
          nextToken
        }
        comments {
          items {
            id
            content
            postID
            post {
              id
              type
              content
              userID
              createdAt
              updatedAt
              userPostsId
              owner
            }
            userID
            user {
              id
              name
              family_name
              email
              owner
              avatarUrl
              avatarKey
              wallpaperUrl
              wallpaperKey
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            userCommentsId
            owner
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const userByEmail = /* GraphQL */ `
  query UserByEmail(
    $email: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userByEmail(
      email: $email
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        family_name
        email
        owner
        avatarUrl
        avatarKey
        wallpaperUrl
        wallpaperKey
        posts {
          items {
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
              avatarUrl
              avatarKey
              wallpaperUrl
              wallpaperKey
              createdAt
              updatedAt
            }
            comments {
              nextToken
            }
            createdAt
            updatedAt
            userPostsId
            owner
          }
          nextToken
        }
        comments {
          items {
            id
            content
            postID
            post {
              id
              type
              content
              userID
              createdAt
              updatedAt
              userPostsId
              owner
            }
            userID
            user {
              id
              name
              family_name
              email
              owner
              avatarUrl
              avatarKey
              wallpaperUrl
              wallpaperKey
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            userCommentsId
            owner
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPerson = /* GraphQL */ `
  query GetPerson($id: ID!) {
    getPerson(id: $id) {
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
export const listPeople = /* GraphQL */ `
  query ListPeople(
    $filter: ModelPersonFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPeople(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
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
        avatarUrl
        avatarKey
        wallpaperUrl
        wallpaperKey
        posts {
          items {
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
              avatarUrl
              avatarKey
              wallpaperUrl
              wallpaperKey
              createdAt
              updatedAt
            }
            comments {
              nextToken
            }
            createdAt
            updatedAt
            userPostsId
            owner
          }
          nextToken
        }
        comments {
          items {
            id
            content
            postID
            post {
              id
              type
              content
              userID
              createdAt
              updatedAt
              userPostsId
              owner
            }
            userID
            user {
              id
              name
              family_name
              email
              owner
              avatarUrl
              avatarKey
              wallpaperUrl
              wallpaperKey
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            userCommentsId
            owner
          }
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
              avatarUrl
              avatarKey
              wallpaperUrl
              wallpaperKey
              createdAt
              updatedAt
            }
            comments {
              nextToken
            }
            createdAt
            updatedAt
            userPostsId
            owner
          }
          userID
          user {
            id
            name
            family_name
            email
            owner
            avatarUrl
            avatarKey
            wallpaperUrl
            wallpaperKey
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
          userCommentsId
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      userPostsId
      owner
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          avatarUrl
          avatarKey
          wallpaperUrl
          wallpaperKey
          posts {
            items {
              id
              type
              content
              userID
              createdAt
              updatedAt
              userPostsId
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
              userCommentsId
              owner
            }
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
            post {
              id
              type
              content
              userID
              createdAt
              updatedAt
              userPostsId
              owner
            }
            userID
            user {
              id
              name
              family_name
              email
              owner
              avatarUrl
              avatarKey
              wallpaperUrl
              wallpaperKey
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            userCommentsId
            owner
          }
          nextToken
        }
        createdAt
        updatedAt
        userPostsId
        owner
      }
      nextToken
    }
  }
`;
export const postsByDate = /* GraphQL */ `
  query PostsByDate(
    $type: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    postsByDate(
      type: $type
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
          avatarUrl
          avatarKey
          wallpaperUrl
          wallpaperKey
          posts {
            items {
              id
              type
              content
              userID
              createdAt
              updatedAt
              userPostsId
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
              userCommentsId
              owner
            }
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
            post {
              id
              type
              content
              userID
              createdAt
              updatedAt
              userPostsId
              owner
            }
            userID
            user {
              id
              name
              family_name
              email
              owner
              avatarUrl
              avatarKey
              wallpaperUrl
              wallpaperKey
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            userCommentsId
            owner
          }
          nextToken
        }
        createdAt
        updatedAt
        userPostsId
        owner
      }
      nextToken
    }
  }
`;
export const postsByUserIDAndCreatedAt = /* GraphQL */ `
  query PostsByUserIDAndCreatedAt(
    $userID: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    postsByUserIDAndCreatedAt(
      userID: $userID
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
          avatarUrl
          avatarKey
          wallpaperUrl
          wallpaperKey
          posts {
            items {
              id
              type
              content
              userID
              createdAt
              updatedAt
              userPostsId
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
              userCommentsId
              owner
            }
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
            post {
              id
              type
              content
              userID
              createdAt
              updatedAt
              userPostsId
              owner
            }
            userID
            user {
              id
              name
              family_name
              email
              owner
              avatarUrl
              avatarKey
              wallpaperUrl
              wallpaperKey
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            userCommentsId
            owner
          }
          nextToken
        }
        createdAt
        updatedAt
        userPostsId
        owner
      }
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
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
          avatarUrl
          avatarKey
          wallpaperUrl
          wallpaperKey
          posts {
            items {
              id
              type
              content
              userID
              createdAt
              updatedAt
              userPostsId
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
              userCommentsId
              owner
            }
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
            post {
              id
              type
              content
              userID
              createdAt
              updatedAt
              userPostsId
              owner
            }
            userID
            user {
              id
              name
              family_name
              email
              owner
              avatarUrl
              avatarKey
              wallpaperUrl
              wallpaperKey
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            userCommentsId
            owner
          }
          nextToken
        }
        createdAt
        updatedAt
        userPostsId
        owner
      }
      userID
      user {
        id
        name
        family_name
        email
        owner
        avatarUrl
        avatarKey
        wallpaperUrl
        wallpaperKey
        posts {
          items {
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
              avatarUrl
              avatarKey
              wallpaperUrl
              wallpaperKey
              createdAt
              updatedAt
            }
            comments {
              nextToken
            }
            createdAt
            updatedAt
            userPostsId
            owner
          }
          nextToken
        }
        comments {
          items {
            id
            content
            postID
            post {
              id
              type
              content
              userID
              createdAt
              updatedAt
              userPostsId
              owner
            }
            userID
            user {
              id
              name
              family_name
              email
              owner
              avatarUrl
              avatarKey
              wallpaperUrl
              wallpaperKey
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            userCommentsId
            owner
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      userCommentsId
      owner
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
            avatarUrl
            avatarKey
            wallpaperUrl
            wallpaperKey
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
              userCommentsId
              owner
            }
            nextToken
          }
          createdAt
          updatedAt
          userPostsId
          owner
        }
        userID
        user {
          id
          name
          family_name
          email
          owner
          avatarUrl
          avatarKey
          wallpaperUrl
          wallpaperKey
          posts {
            items {
              id
              type
              content
              userID
              createdAt
              updatedAt
              userPostsId
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
              userCommentsId
              owner
            }
            nextToken
          }
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        userCommentsId
        owner
      }
      nextToken
    }
  }
`;
export const commentsByPostID = /* GraphQL */ `
  query CommentsByPostID(
    $postID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    commentsByPostID(
      postID: $postID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
            avatarUrl
            avatarKey
            wallpaperUrl
            wallpaperKey
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
              userCommentsId
              owner
            }
            nextToken
          }
          createdAt
          updatedAt
          userPostsId
          owner
        }
        userID
        user {
          id
          name
          family_name
          email
          owner
          avatarUrl
          avatarKey
          wallpaperUrl
          wallpaperKey
          posts {
            items {
              id
              type
              content
              userID
              createdAt
              updatedAt
              userPostsId
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
              userCommentsId
              owner
            }
            nextToken
          }
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        userCommentsId
        owner
      }
      nextToken
    }
  }
`;
export const commentsByUserID = /* GraphQL */ `
  query CommentsByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    commentsByUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
            avatarUrl
            avatarKey
            wallpaperUrl
            wallpaperKey
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
              userCommentsId
              owner
            }
            nextToken
          }
          createdAt
          updatedAt
          userPostsId
          owner
        }
        userID
        user {
          id
          name
          family_name
          email
          owner
          avatarUrl
          avatarKey
          wallpaperUrl
          wallpaperKey
          posts {
            items {
              id
              type
              content
              userID
              createdAt
              updatedAt
              userPostsId
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
              userCommentsId
              owner
            }
            nextToken
          }
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        userCommentsId
        owner
      }
      nextToken
    }
  }
`;
