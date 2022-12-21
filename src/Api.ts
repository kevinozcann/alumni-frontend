/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserInput = {
  id?: string | null,
  name: string,
  family_name: string,
  email: string,
  picture?: string | null,
};

export type ModelUserConditionInput = {
  name?: ModelStringInput | null,
  family_name?: ModelStringInput | null,
  email?: ModelStringInput | null,
  picture?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type User = {
  __typename: "User",
  id: string,
  name: string,
  family_name: string,
  email: string,
  picture?: string | null,
  posts?: ModelPostConnection | null,
  comments?: ModelCommentConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelPostConnection = {
  __typename: "ModelPostConnection",
  items:  Array<Post | null >,
  nextToken?: string | null,
};

export type Post = {
  __typename: "Post",
  id: string,
  title?: string | null,
  content: string,
  user?: User | null,
  comments?: ModelCommentConnection | null,
  type: string,
  createdAt: string,
  updatedAt: string,
  userPostsId?: string | null,
  owner?: string | null,
};

export type ModelCommentConnection = {
  __typename: "ModelCommentConnection",
  items:  Array<Comment | null >,
  nextToken?: string | null,
};

export type Comment = {
  __typename: "Comment",
  id: string,
  post: Post,
  user: User,
  content: string,
  createdAt: string,
  updatedAt: string,
  userCommentsId?: string | null,
  postCommentsId?: string | null,
  owner?: string | null,
};

export type UpdateUserInput = {
  id: string,
  name?: string | null,
  family_name?: string | null,
  email?: string | null,
  picture?: string | null,
};

export type DeleteUserInput = {
  id: string,
};

export type CreatePersonInput = {
  id?: string | null,
  ssn_number?: string | null,
  school_number?: string | null,
  name: string,
  second_name?: string | null,
  last_name: string,
  birth_date?: string | null,
  gender?: Gender | null,
  student_picture?: string | null,
  occupation?: string | null,
  graduation_period?: string | null,
  graduation_status?: string | null,
  education_status?: string | null,
  marital_status?: MaritalStatus | null,
  phone_number?: string | null,
  email?: string | null,
  linkedin_url?: string | null,
  twitter_url?: string | null,
  facebook_url?: string | null,
};

export enum Gender {
  MALE = "MALE",
  FEMAIL = "FEMAIL",
  OTHER = "OTHER",
}


export enum MaritalStatus {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
  SEPARATED = "SEPARATED",
}


export type ModelPersonConditionInput = {
  ssn_number?: ModelStringInput | null,
  school_number?: ModelStringInput | null,
  name?: ModelStringInput | null,
  second_name?: ModelStringInput | null,
  last_name?: ModelStringInput | null,
  birth_date?: ModelStringInput | null,
  gender?: ModelGenderInput | null,
  student_picture?: ModelStringInput | null,
  occupation?: ModelStringInput | null,
  graduation_period?: ModelStringInput | null,
  graduation_status?: ModelStringInput | null,
  education_status?: ModelStringInput | null,
  marital_status?: ModelMaritalStatusInput | null,
  phone_number?: ModelStringInput | null,
  email?: ModelStringInput | null,
  linkedin_url?: ModelStringInput | null,
  twitter_url?: ModelStringInput | null,
  facebook_url?: ModelStringInput | null,
  and?: Array< ModelPersonConditionInput | null > | null,
  or?: Array< ModelPersonConditionInput | null > | null,
  not?: ModelPersonConditionInput | null,
};

export type ModelGenderInput = {
  eq?: Gender | null,
  ne?: Gender | null,
};

export type ModelMaritalStatusInput = {
  eq?: MaritalStatus | null,
  ne?: MaritalStatus | null,
};

export type Person = {
  __typename: "Person",
  id: string,
  ssn_number?: string | null,
  school_number?: string | null,
  name: string,
  second_name?: string | null,
  last_name: string,
  birth_date?: string | null,
  gender?: Gender | null,
  student_picture?: string | null,
  occupation?: string | null,
  graduation_period?: string | null,
  graduation_status?: string | null,
  education_status?: string | null,
  marital_status?: MaritalStatus | null,
  phone_number?: string | null,
  email?: string | null,
  linkedin_url?: string | null,
  twitter_url?: string | null,
  facebook_url?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdatePersonInput = {
  id: string,
  ssn_number?: string | null,
  school_number?: string | null,
  name?: string | null,
  second_name?: string | null,
  last_name?: string | null,
  birth_date?: string | null,
  gender?: Gender | null,
  student_picture?: string | null,
  occupation?: string | null,
  graduation_period?: string | null,
  graduation_status?: string | null,
  education_status?: string | null,
  marital_status?: MaritalStatus | null,
  phone_number?: string | null,
  email?: string | null,
  linkedin_url?: string | null,
  twitter_url?: string | null,
  facebook_url?: string | null,
};

export type DeletePersonInput = {
  id: string,
};

export type CreatePostInput = {
  id?: string | null,
  title?: string | null,
  content: string,
  type: string,
  createdAt?: string | null,
  userPostsId?: string | null,
};

export type ModelPostConditionInput = {
  title?: ModelStringInput | null,
  content?: ModelStringInput | null,
  type?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelPostConditionInput | null > | null,
  or?: Array< ModelPostConditionInput | null > | null,
  not?: ModelPostConditionInput | null,
  userPostsId?: ModelIDInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type UpdatePostInput = {
  id: string,
  title?: string | null,
  content?: string | null,
  type?: string | null,
  createdAt?: string | null,
  userPostsId?: string | null,
};

export type DeletePostInput = {
  id: string,
};

export type CreateCommentInput = {
  id?: string | null,
  content: string,
  userCommentsId?: string | null,
  postCommentsId?: string | null,
};

export type ModelCommentConditionInput = {
  content?: ModelStringInput | null,
  and?: Array< ModelCommentConditionInput | null > | null,
  or?: Array< ModelCommentConditionInput | null > | null,
  not?: ModelCommentConditionInput | null,
  userCommentsId?: ModelIDInput | null,
  postCommentsId?: ModelIDInput | null,
};

export type UpdateCommentInput = {
  id: string,
  content?: string | null,
  userCommentsId?: string | null,
  postCommentsId?: string | null,
};

export type DeleteCommentInput = {
  id: string,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  family_name?: ModelStringInput | null,
  email?: ModelStringInput | null,
  picture?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type ModelPersonFilterInput = {
  id?: ModelIDInput | null,
  ssn_number?: ModelStringInput | null,
  school_number?: ModelStringInput | null,
  name?: ModelStringInput | null,
  second_name?: ModelStringInput | null,
  last_name?: ModelStringInput | null,
  birth_date?: ModelStringInput | null,
  gender?: ModelGenderInput | null,
  student_picture?: ModelStringInput | null,
  occupation?: ModelStringInput | null,
  graduation_period?: ModelStringInput | null,
  graduation_status?: ModelStringInput | null,
  education_status?: ModelStringInput | null,
  marital_status?: ModelMaritalStatusInput | null,
  phone_number?: ModelStringInput | null,
  email?: ModelStringInput | null,
  linkedin_url?: ModelStringInput | null,
  twitter_url?: ModelStringInput | null,
  facebook_url?: ModelStringInput | null,
  and?: Array< ModelPersonFilterInput | null > | null,
  or?: Array< ModelPersonFilterInput | null > | null,
  not?: ModelPersonFilterInput | null,
};

export type ModelPersonConnection = {
  __typename: "ModelPersonConnection",
  items:  Array<Person | null >,
  nextToken?: string | null,
};

export type ModelPostFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  content?: ModelStringInput | null,
  type?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelPostFilterInput | null > | null,
  or?: Array< ModelPostFilterInput | null > | null,
  not?: ModelPostFilterInput | null,
  userPostsId?: ModelIDInput | null,
};

export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelCommentFilterInput = {
  id?: ModelIDInput | null,
  content?: ModelStringInput | null,
  and?: Array< ModelCommentFilterInput | null > | null,
  or?: Array< ModelCommentFilterInput | null > | null,
  not?: ModelCommentFilterInput | null,
  userCommentsId?: ModelIDInput | null,
  postCommentsId?: ModelIDInput | null,
};

export type ModelSubscriptionUserFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  family_name?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  picture?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionPersonFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  ssn_number?: ModelSubscriptionStringInput | null,
  school_number?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  second_name?: ModelSubscriptionStringInput | null,
  last_name?: ModelSubscriptionStringInput | null,
  birth_date?: ModelSubscriptionStringInput | null,
  gender?: ModelSubscriptionStringInput | null,
  student_picture?: ModelSubscriptionStringInput | null,
  occupation?: ModelSubscriptionStringInput | null,
  graduation_period?: ModelSubscriptionStringInput | null,
  graduation_status?: ModelSubscriptionStringInput | null,
  education_status?: ModelSubscriptionStringInput | null,
  marital_status?: ModelSubscriptionStringInput | null,
  phone_number?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  linkedin_url?: ModelSubscriptionStringInput | null,
  twitter_url?: ModelSubscriptionStringInput | null,
  facebook_url?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPersonFilterInput | null > | null,
  or?: Array< ModelSubscriptionPersonFilterInput | null > | null,
};

export type ModelSubscriptionPostFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  content?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPostFilterInput | null > | null,
  or?: Array< ModelSubscriptionPostFilterInput | null > | null,
};

export type ModelSubscriptionCommentFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  content?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionCommentFilterInput | null > | null,
  or?: Array< ModelSubscriptionCommentFilterInput | null > | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    name: string,
    family_name: string,
    email: string,
    picture?: string | null,
    posts?:  {
      __typename: "ModelPostConnection",
      items:  Array< {
        __typename: "Post",
        id: string,
        title?: string | null,
        content: string,
        type: string,
        createdAt: string,
        updatedAt: string,
        userPostsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    comments?:  {
      __typename: "ModelCommentConnection",
      items:  Array< {
        __typename: "Comment",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
        userCommentsId?: string | null,
        postCommentsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    family_name: string,
    email: string,
    picture?: string | null,
    posts?:  {
      __typename: "ModelPostConnection",
      items:  Array< {
        __typename: "Post",
        id: string,
        title?: string | null,
        content: string,
        type: string,
        createdAt: string,
        updatedAt: string,
        userPostsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    comments?:  {
      __typename: "ModelCommentConnection",
      items:  Array< {
        __typename: "Comment",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
        userCommentsId?: string | null,
        postCommentsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    name: string,
    family_name: string,
    email: string,
    picture?: string | null,
    posts?:  {
      __typename: "ModelPostConnection",
      items:  Array< {
        __typename: "Post",
        id: string,
        title?: string | null,
        content: string,
        type: string,
        createdAt: string,
        updatedAt: string,
        userPostsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    comments?:  {
      __typename: "ModelCommentConnection",
      items:  Array< {
        __typename: "Comment",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
        userCommentsId?: string | null,
        postCommentsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreatePersonMutationVariables = {
  input: CreatePersonInput,
  condition?: ModelPersonConditionInput | null,
};

export type CreatePersonMutation = {
  createPerson?:  {
    __typename: "Person",
    id: string,
    ssn_number?: string | null,
    school_number?: string | null,
    name: string,
    second_name?: string | null,
    last_name: string,
    birth_date?: string | null,
    gender?: Gender | null,
    student_picture?: string | null,
    occupation?: string | null,
    graduation_period?: string | null,
    graduation_status?: string | null,
    education_status?: string | null,
    marital_status?: MaritalStatus | null,
    phone_number?: string | null,
    email?: string | null,
    linkedin_url?: string | null,
    twitter_url?: string | null,
    facebook_url?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePersonMutationVariables = {
  input: UpdatePersonInput,
  condition?: ModelPersonConditionInput | null,
};

export type UpdatePersonMutation = {
  updatePerson?:  {
    __typename: "Person",
    id: string,
    ssn_number?: string | null,
    school_number?: string | null,
    name: string,
    second_name?: string | null,
    last_name: string,
    birth_date?: string | null,
    gender?: Gender | null,
    student_picture?: string | null,
    occupation?: string | null,
    graduation_period?: string | null,
    graduation_status?: string | null,
    education_status?: string | null,
    marital_status?: MaritalStatus | null,
    phone_number?: string | null,
    email?: string | null,
    linkedin_url?: string | null,
    twitter_url?: string | null,
    facebook_url?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeletePersonMutationVariables = {
  input: DeletePersonInput,
  condition?: ModelPersonConditionInput | null,
};

export type DeletePersonMutation = {
  deletePerson?:  {
    __typename: "Person",
    id: string,
    ssn_number?: string | null,
    school_number?: string | null,
    name: string,
    second_name?: string | null,
    last_name: string,
    birth_date?: string | null,
    gender?: Gender | null,
    student_picture?: string | null,
    occupation?: string | null,
    graduation_period?: string | null,
    graduation_status?: string | null,
    education_status?: string | null,
    marital_status?: MaritalStatus | null,
    phone_number?: string | null,
    email?: string | null,
    linkedin_url?: string | null,
    twitter_url?: string | null,
    facebook_url?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreatePostMutationVariables = {
  input: CreatePostInput,
  condition?: ModelPostConditionInput | null,
};

export type CreatePostMutation = {
  createPost?:  {
    __typename: "Post",
    id: string,
    title?: string | null,
    content: string,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      family_name: string,
      email: string,
      picture?: string | null,
      posts?:  {
        __typename: "ModelPostConnection",
        nextToken?: string | null,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    comments?:  {
      __typename: "ModelCommentConnection",
      items:  Array< {
        __typename: "Comment",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
        userCommentsId?: string | null,
        postCommentsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    type: string,
    createdAt: string,
    updatedAt: string,
    userPostsId?: string | null,
    owner?: string | null,
  } | null,
};

export type UpdatePostMutationVariables = {
  input: UpdatePostInput,
  condition?: ModelPostConditionInput | null,
};

export type UpdatePostMutation = {
  updatePost?:  {
    __typename: "Post",
    id: string,
    title?: string | null,
    content: string,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      family_name: string,
      email: string,
      picture?: string | null,
      posts?:  {
        __typename: "ModelPostConnection",
        nextToken?: string | null,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    comments?:  {
      __typename: "ModelCommentConnection",
      items:  Array< {
        __typename: "Comment",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
        userCommentsId?: string | null,
        postCommentsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    type: string,
    createdAt: string,
    updatedAt: string,
    userPostsId?: string | null,
    owner?: string | null,
  } | null,
};

export type DeletePostMutationVariables = {
  input: DeletePostInput,
  condition?: ModelPostConditionInput | null,
};

export type DeletePostMutation = {
  deletePost?:  {
    __typename: "Post",
    id: string,
    title?: string | null,
    content: string,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      family_name: string,
      email: string,
      picture?: string | null,
      posts?:  {
        __typename: "ModelPostConnection",
        nextToken?: string | null,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    comments?:  {
      __typename: "ModelCommentConnection",
      items:  Array< {
        __typename: "Comment",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
        userCommentsId?: string | null,
        postCommentsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    type: string,
    createdAt: string,
    updatedAt: string,
    userPostsId?: string | null,
    owner?: string | null,
  } | null,
};

export type CreateCommentMutationVariables = {
  input: CreateCommentInput,
  condition?: ModelCommentConditionInput | null,
};

export type CreateCommentMutation = {
  createComment?:  {
    __typename: "Comment",
    id: string,
    post:  {
      __typename: "Post",
      id: string,
      title?: string | null,
      content: string,
      user?:  {
        __typename: "User",
        id: string,
        name: string,
        family_name: string,
        email: string,
        picture?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      type: string,
      createdAt: string,
      updatedAt: string,
      userPostsId?: string | null,
      owner?: string | null,
    },
    user:  {
      __typename: "User",
      id: string,
      name: string,
      family_name: string,
      email: string,
      picture?: string | null,
      posts?:  {
        __typename: "ModelPostConnection",
        nextToken?: string | null,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    content: string,
    createdAt: string,
    updatedAt: string,
    userCommentsId?: string | null,
    postCommentsId?: string | null,
    owner?: string | null,
  } | null,
};

export type UpdateCommentMutationVariables = {
  input: UpdateCommentInput,
  condition?: ModelCommentConditionInput | null,
};

export type UpdateCommentMutation = {
  updateComment?:  {
    __typename: "Comment",
    id: string,
    post:  {
      __typename: "Post",
      id: string,
      title?: string | null,
      content: string,
      user?:  {
        __typename: "User",
        id: string,
        name: string,
        family_name: string,
        email: string,
        picture?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      type: string,
      createdAt: string,
      updatedAt: string,
      userPostsId?: string | null,
      owner?: string | null,
    },
    user:  {
      __typename: "User",
      id: string,
      name: string,
      family_name: string,
      email: string,
      picture?: string | null,
      posts?:  {
        __typename: "ModelPostConnection",
        nextToken?: string | null,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    content: string,
    createdAt: string,
    updatedAt: string,
    userCommentsId?: string | null,
    postCommentsId?: string | null,
    owner?: string | null,
  } | null,
};

export type DeleteCommentMutationVariables = {
  input: DeleteCommentInput,
  condition?: ModelCommentConditionInput | null,
};

export type DeleteCommentMutation = {
  deleteComment?:  {
    __typename: "Comment",
    id: string,
    post:  {
      __typename: "Post",
      id: string,
      title?: string | null,
      content: string,
      user?:  {
        __typename: "User",
        id: string,
        name: string,
        family_name: string,
        email: string,
        picture?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      type: string,
      createdAt: string,
      updatedAt: string,
      userPostsId?: string | null,
      owner?: string | null,
    },
    user:  {
      __typename: "User",
      id: string,
      name: string,
      family_name: string,
      email: string,
      picture?: string | null,
      posts?:  {
        __typename: "ModelPostConnection",
        nextToken?: string | null,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    content: string,
    createdAt: string,
    updatedAt: string,
    userCommentsId?: string | null,
    postCommentsId?: string | null,
    owner?: string | null,
  } | null,
};

export type GetUserPictureQueryVariables = {
  picture?: string | null,
};

export type GetUserPictureQuery = {
  getUserPicture?: string | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    name: string,
    family_name: string,
    email: string,
    picture?: string | null,
    posts?:  {
      __typename: "ModelPostConnection",
      items:  Array< {
        __typename: "Post",
        id: string,
        title?: string | null,
        content: string,
        type: string,
        createdAt: string,
        updatedAt: string,
        userPostsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    comments?:  {
      __typename: "ModelCommentConnection",
      items:  Array< {
        __typename: "Comment",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
        userCommentsId?: string | null,
        postCommentsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      name: string,
      family_name: string,
      email: string,
      picture?: string | null,
      posts?:  {
        __typename: "ModelPostConnection",
        nextToken?: string | null,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPersonQueryVariables = {
  id: string,
};

export type GetPersonQuery = {
  getPerson?:  {
    __typename: "Person",
    id: string,
    ssn_number?: string | null,
    school_number?: string | null,
    name: string,
    second_name?: string | null,
    last_name: string,
    birth_date?: string | null,
    gender?: Gender | null,
    student_picture?: string | null,
    occupation?: string | null,
    graduation_period?: string | null,
    graduation_status?: string | null,
    education_status?: string | null,
    marital_status?: MaritalStatus | null,
    phone_number?: string | null,
    email?: string | null,
    linkedin_url?: string | null,
    twitter_url?: string | null,
    facebook_url?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListPeopleQueryVariables = {
  filter?: ModelPersonFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPeopleQuery = {
  listPeople?:  {
    __typename: "ModelPersonConnection",
    items:  Array< {
      __typename: "Person",
      id: string,
      ssn_number?: string | null,
      school_number?: string | null,
      name: string,
      second_name?: string | null,
      last_name: string,
      birth_date?: string | null,
      gender?: Gender | null,
      student_picture?: string | null,
      occupation?: string | null,
      graduation_period?: string | null,
      graduation_status?: string | null,
      education_status?: string | null,
      marital_status?: MaritalStatus | null,
      phone_number?: string | null,
      email?: string | null,
      linkedin_url?: string | null,
      twitter_url?: string | null,
      facebook_url?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPostQueryVariables = {
  id: string,
};

export type GetPostQuery = {
  getPost?:  {
    __typename: "Post",
    id: string,
    title?: string | null,
    content: string,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      family_name: string,
      email: string,
      picture?: string | null,
      posts?:  {
        __typename: "ModelPostConnection",
        nextToken?: string | null,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    comments?:  {
      __typename: "ModelCommentConnection",
      items:  Array< {
        __typename: "Comment",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
        userCommentsId?: string | null,
        postCommentsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    type: string,
    createdAt: string,
    updatedAt: string,
    userPostsId?: string | null,
    owner?: string | null,
  } | null,
};

export type ListPostsQueryVariables = {
  filter?: ModelPostFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPostsQuery = {
  listPosts?:  {
    __typename: "ModelPostConnection",
    items:  Array< {
      __typename: "Post",
      id: string,
      title?: string | null,
      content: string,
      user?:  {
        __typename: "User",
        id: string,
        name: string,
        family_name: string,
        email: string,
        picture?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      type: string,
      createdAt: string,
      updatedAt: string,
      userPostsId?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PostsByDateQueryVariables = {
  type: string,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPostFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PostsByDateQuery = {
  postsByDate?:  {
    __typename: "ModelPostConnection",
    items:  Array< {
      __typename: "Post",
      id: string,
      title?: string | null,
      content: string,
      user?:  {
        __typename: "User",
        id: string,
        name: string,
        family_name: string,
        email: string,
        picture?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      type: string,
      createdAt: string,
      updatedAt: string,
      userPostsId?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetCommentQueryVariables = {
  id: string,
};

export type GetCommentQuery = {
  getComment?:  {
    __typename: "Comment",
    id: string,
    post:  {
      __typename: "Post",
      id: string,
      title?: string | null,
      content: string,
      user?:  {
        __typename: "User",
        id: string,
        name: string,
        family_name: string,
        email: string,
        picture?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      type: string,
      createdAt: string,
      updatedAt: string,
      userPostsId?: string | null,
      owner?: string | null,
    },
    user:  {
      __typename: "User",
      id: string,
      name: string,
      family_name: string,
      email: string,
      picture?: string | null,
      posts?:  {
        __typename: "ModelPostConnection",
        nextToken?: string | null,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    content: string,
    createdAt: string,
    updatedAt: string,
    userCommentsId?: string | null,
    postCommentsId?: string | null,
    owner?: string | null,
  } | null,
};

export type ListCommentsQueryVariables = {
  filter?: ModelCommentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCommentsQuery = {
  listComments?:  {
    __typename: "ModelCommentConnection",
    items:  Array< {
      __typename: "Comment",
      id: string,
      post:  {
        __typename: "Post",
        id: string,
        title?: string | null,
        content: string,
        type: string,
        createdAt: string,
        updatedAt: string,
        userPostsId?: string | null,
        owner?: string | null,
      },
      user:  {
        __typename: "User",
        id: string,
        name: string,
        family_name: string,
        email: string,
        picture?: string | null,
        createdAt: string,
        updatedAt: string,
      },
      content: string,
      createdAt: string,
      updatedAt: string,
      userCommentsId?: string | null,
      postCommentsId?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    family_name: string,
    email: string,
    picture?: string | null,
    posts?:  {
      __typename: "ModelPostConnection",
      items:  Array< {
        __typename: "Post",
        id: string,
        title?: string | null,
        content: string,
        type: string,
        createdAt: string,
        updatedAt: string,
        userPostsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    comments?:  {
      __typename: "ModelCommentConnection",
      items:  Array< {
        __typename: "Comment",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
        userCommentsId?: string | null,
        postCommentsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    family_name: string,
    email: string,
    picture?: string | null,
    posts?:  {
      __typename: "ModelPostConnection",
      items:  Array< {
        __typename: "Post",
        id: string,
        title?: string | null,
        content: string,
        type: string,
        createdAt: string,
        updatedAt: string,
        userPostsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    comments?:  {
      __typename: "ModelCommentConnection",
      items:  Array< {
        __typename: "Comment",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
        userCommentsId?: string | null,
        postCommentsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    name: string,
    family_name: string,
    email: string,
    picture?: string | null,
    posts?:  {
      __typename: "ModelPostConnection",
      items:  Array< {
        __typename: "Post",
        id: string,
        title?: string | null,
        content: string,
        type: string,
        createdAt: string,
        updatedAt: string,
        userPostsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    comments?:  {
      __typename: "ModelCommentConnection",
      items:  Array< {
        __typename: "Comment",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
        userCommentsId?: string | null,
        postCommentsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreatePersonSubscriptionVariables = {
  filter?: ModelSubscriptionPersonFilterInput | null,
};

export type OnCreatePersonSubscription = {
  onCreatePerson?:  {
    __typename: "Person",
    id: string,
    ssn_number?: string | null,
    school_number?: string | null,
    name: string,
    second_name?: string | null,
    last_name: string,
    birth_date?: string | null,
    gender?: Gender | null,
    student_picture?: string | null,
    occupation?: string | null,
    graduation_period?: string | null,
    graduation_status?: string | null,
    education_status?: string | null,
    marital_status?: MaritalStatus | null,
    phone_number?: string | null,
    email?: string | null,
    linkedin_url?: string | null,
    twitter_url?: string | null,
    facebook_url?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePersonSubscriptionVariables = {
  filter?: ModelSubscriptionPersonFilterInput | null,
};

export type OnUpdatePersonSubscription = {
  onUpdatePerson?:  {
    __typename: "Person",
    id: string,
    ssn_number?: string | null,
    school_number?: string | null,
    name: string,
    second_name?: string | null,
    last_name: string,
    birth_date?: string | null,
    gender?: Gender | null,
    student_picture?: string | null,
    occupation?: string | null,
    graduation_period?: string | null,
    graduation_status?: string | null,
    education_status?: string | null,
    marital_status?: MaritalStatus | null,
    phone_number?: string | null,
    email?: string | null,
    linkedin_url?: string | null,
    twitter_url?: string | null,
    facebook_url?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePersonSubscriptionVariables = {
  filter?: ModelSubscriptionPersonFilterInput | null,
};

export type OnDeletePersonSubscription = {
  onDeletePerson?:  {
    __typename: "Person",
    id: string,
    ssn_number?: string | null,
    school_number?: string | null,
    name: string,
    second_name?: string | null,
    last_name: string,
    birth_date?: string | null,
    gender?: Gender | null,
    student_picture?: string | null,
    occupation?: string | null,
    graduation_period?: string | null,
    graduation_status?: string | null,
    education_status?: string | null,
    marital_status?: MaritalStatus | null,
    phone_number?: string | null,
    email?: string | null,
    linkedin_url?: string | null,
    twitter_url?: string | null,
    facebook_url?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreatePostSubscriptionVariables = {
  filter?: ModelSubscriptionPostFilterInput | null,
  owner?: string | null,
};

export type OnCreatePostSubscription = {
  onCreatePost?:  {
    __typename: "Post",
    id: string,
    title?: string | null,
    content: string,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      family_name: string,
      email: string,
      picture?: string | null,
      posts?:  {
        __typename: "ModelPostConnection",
        nextToken?: string | null,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    comments?:  {
      __typename: "ModelCommentConnection",
      items:  Array< {
        __typename: "Comment",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
        userCommentsId?: string | null,
        postCommentsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    type: string,
    createdAt: string,
    updatedAt: string,
    userPostsId?: string | null,
    owner?: string | null,
  } | null,
};

export type OnUpdatePostSubscriptionVariables = {
  filter?: ModelSubscriptionPostFilterInput | null,
  owner?: string | null,
};

export type OnUpdatePostSubscription = {
  onUpdatePost?:  {
    __typename: "Post",
    id: string,
    title?: string | null,
    content: string,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      family_name: string,
      email: string,
      picture?: string | null,
      posts?:  {
        __typename: "ModelPostConnection",
        nextToken?: string | null,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    comments?:  {
      __typename: "ModelCommentConnection",
      items:  Array< {
        __typename: "Comment",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
        userCommentsId?: string | null,
        postCommentsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    type: string,
    createdAt: string,
    updatedAt: string,
    userPostsId?: string | null,
    owner?: string | null,
  } | null,
};

export type OnDeletePostSubscriptionVariables = {
  filter?: ModelSubscriptionPostFilterInput | null,
  owner?: string | null,
};

export type OnDeletePostSubscription = {
  onDeletePost?:  {
    __typename: "Post",
    id: string,
    title?: string | null,
    content: string,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      family_name: string,
      email: string,
      picture?: string | null,
      posts?:  {
        __typename: "ModelPostConnection",
        nextToken?: string | null,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    comments?:  {
      __typename: "ModelCommentConnection",
      items:  Array< {
        __typename: "Comment",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
        userCommentsId?: string | null,
        postCommentsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    type: string,
    createdAt: string,
    updatedAt: string,
    userPostsId?: string | null,
    owner?: string | null,
  } | null,
};

export type OnCreateCommentSubscriptionVariables = {
  filter?: ModelSubscriptionCommentFilterInput | null,
  owner?: string | null,
};

export type OnCreateCommentSubscription = {
  onCreateComment?:  {
    __typename: "Comment",
    id: string,
    post:  {
      __typename: "Post",
      id: string,
      title?: string | null,
      content: string,
      user?:  {
        __typename: "User",
        id: string,
        name: string,
        family_name: string,
        email: string,
        picture?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      type: string,
      createdAt: string,
      updatedAt: string,
      userPostsId?: string | null,
      owner?: string | null,
    },
    user:  {
      __typename: "User",
      id: string,
      name: string,
      family_name: string,
      email: string,
      picture?: string | null,
      posts?:  {
        __typename: "ModelPostConnection",
        nextToken?: string | null,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    content: string,
    createdAt: string,
    updatedAt: string,
    userCommentsId?: string | null,
    postCommentsId?: string | null,
    owner?: string | null,
  } | null,
};

export type OnUpdateCommentSubscriptionVariables = {
  filter?: ModelSubscriptionCommentFilterInput | null,
  owner?: string | null,
};

export type OnUpdateCommentSubscription = {
  onUpdateComment?:  {
    __typename: "Comment",
    id: string,
    post:  {
      __typename: "Post",
      id: string,
      title?: string | null,
      content: string,
      user?:  {
        __typename: "User",
        id: string,
        name: string,
        family_name: string,
        email: string,
        picture?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      type: string,
      createdAt: string,
      updatedAt: string,
      userPostsId?: string | null,
      owner?: string | null,
    },
    user:  {
      __typename: "User",
      id: string,
      name: string,
      family_name: string,
      email: string,
      picture?: string | null,
      posts?:  {
        __typename: "ModelPostConnection",
        nextToken?: string | null,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    content: string,
    createdAt: string,
    updatedAt: string,
    userCommentsId?: string | null,
    postCommentsId?: string | null,
    owner?: string | null,
  } | null,
};

export type OnDeleteCommentSubscriptionVariables = {
  filter?: ModelSubscriptionCommentFilterInput | null,
  owner?: string | null,
};

export type OnDeleteCommentSubscription = {
  onDeleteComment?:  {
    __typename: "Comment",
    id: string,
    post:  {
      __typename: "Post",
      id: string,
      title?: string | null,
      content: string,
      user?:  {
        __typename: "User",
        id: string,
        name: string,
        family_name: string,
        email: string,
        picture?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      type: string,
      createdAt: string,
      updatedAt: string,
      userPostsId?: string | null,
      owner?: string | null,
    },
    user:  {
      __typename: "User",
      id: string,
      name: string,
      family_name: string,
      email: string,
      picture?: string | null,
      posts?:  {
        __typename: "ModelPostConnection",
        nextToken?: string | null,
      } | null,
      comments?:  {
        __typename: "ModelCommentConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    content: string,
    createdAt: string,
    updatedAt: string,
    userCommentsId?: string | null,
    postCommentsId?: string | null,
    owner?: string | null,
  } | null,
};
