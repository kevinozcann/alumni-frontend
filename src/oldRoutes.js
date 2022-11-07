// import React, { Suspense, lazy } from 'react';
// import { Navigate, Switch, Route } from 'react-router-dom';
// import { connect } from 'react-redux';
// import { injectIntl } from 'react-intl';
// import { Layout, LayoutSplashScreen } from './layout';
// import { authMenusSelector, authSelector } from './redux/auth';
// import { Logout, AuthPage } from './pages/Auth';
// import ErrorsPage from './pages/Error/ErrorsPage';

// const mapStateToProps = (state) => ({
//   auth: authSelector(state),
//   menus: authMenusSelector(state)
// });

// const connector = connect(mapStateToProps, null);

// const Routes = ({ auth, menus }) => {
//   const isAuthorized = auth.user !== null && auth.authToken !== null;
//   // const { isAuthorized } = useSelector(
//   //   ({ auth }) => ({
//   //     isAuthorized: auth.user != null && auth.authToken != null
//   //   }),
//   //   shallowEqual
//   // );

//   return (
//     <Switch>
//       {!isAuthorized ? (
//         <Route>
//           <AuthPage />
//         </Route>
//       ) : (
//         <Navigate from='/auth' to='/' />
//       )}

//       <Route path='/error' component={ErrorsPage} />
//       <Route path='/logout' component={Logout} />

//       {!isAuthorized ? (
//         <Navigate to='/auth/login' />
//       ) : (
//         <Layout menus={menus}>
//           <Suspense fallback={<LayoutSplashScreen />}>
//             <Switch>
//               <Navigate exact from='/' to='/account' />

//               <Route path='/dashboard' component={Dashboard} />
//               <Route path='/mail' component={Mail} />
//               <Route path='/menus' component={Menus} />
//               <Route path='/organization' component={Organization} />
//               <Route path='/smartclass/:op' component={SmartClass} />
//               <Navigate to='error/error-v2' />
//             </Switch>
//           </Suspense>
//         </Layout>
//       )}
//     </Switch>
//   );
// };

// export default injectIntl(connector(Routes));
