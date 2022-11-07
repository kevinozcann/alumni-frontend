import { combineReducers } from 'redux';
import * as studentTags from 'pages/students/tags/_store/tags';
import * as parentStudents from 'pages/students/parent/_store/students';
import * as students from 'pages/students/student-list/_store/students';

export const studentsSagas = [parentStudents.saga(), studentTags.saga(), students.saga()];
export const studentsReducer = combineReducers({
  parent: parentStudents.reducer,
  tags: studentTags.reducer,
  student: students.reducer
});
