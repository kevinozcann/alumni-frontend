import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IFileManagerState } from '../types/redux.types';

// export const useSFMStore = (sFMInstanceId: string) => {
//   const store = useStaticValue(() => {
//     const preloadedState: IFileManagerState = {
//       ...initialFileManagerState,
//       instanceId: sFMInstanceId
//     };

//     return configureStore({
//       preloadedState: preloadedState as any,
//       reducer: rootReducer,
//       middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//           serializableCheck: false
//         }),
//       devTools: { name: `sFM_${sFMInstanceId}` }
//     });
//   });
//   useStoreWatchers(store);
//   return store;
// };

/**
 * Hook that can be used with parametrized selectors.
 */
export const useParamSelector = <Args extends Array<any>, Value>(
  parametrizedSelector: (...args: Args) => (state: IFileManagerState) => Value,
  ...selectorParams: Args
) => {
  const selector = useCallback(
    (state: IFileManagerState) => parametrizedSelector(...selectorParams)(state),
    // eslint-disable-next-line
    [parametrizedSelector, ...selectorParams]
  );
  return useSelector(selector);
};

/**
 * DTE - DispatchThunkEffect. This method is used to decrease code duplication in
 * main SFM method.
 */
export const useDTE = <Args extends Array<any>>(
  actionCreator: (...args: Args) => any,
  ...selectorParams: Args
) => {
  const dispatch = useDispatch();
  useEffect(
    () => {
      dispatch(actionCreator(...selectorParams));
    },
    // eslint-disable-next-line
    [dispatch, actionCreator, ...selectorParams]
  );
};

export const usePropReduxUpdate = <Payload extends any>(
  actionCreator: (payload: Payload) => any,
  payload: Payload
) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actionCreator(payload));
  }, [dispatch, actionCreator, payload]);
};
