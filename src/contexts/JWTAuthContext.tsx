import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'store/store';
import { verify, JWT_SECRET } from 'utils/jwt';
import { IUser } from 'pages/account/account-types';

interface IAuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: IUser | null;
}

interface IAuthContextValue extends IAuthState {
  platform: 'JWT';
  login: (accessToken: string, user: IUser) => void;
  logout: () => void;
  register: (accessToken: string, user: IUser) => void;
}

interface IAuthProviderProps {
  children: React.ReactNode;
}

type TInitializeAction = {
  type: 'INITIALIZE';
  payload: {
    isAuthenticated: boolean;
    user: IUser | null;
  };
};

type TLoginAction = {
  type: 'LOGIN';
  payload: {
    user: IUser;
  };
};

type TLogoutAction = {
  type: 'LOGOUT';
};

type TRegisterAction = {
  type: 'REGISTER';
  payload: {
    user: IUser;
  };
};

type TAction = TInitializeAction | TLoginAction | TLogoutAction | TRegisterAction;

const initialState: IAuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const setSession = (accessToken: string | null): void => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  } else {
    localStorage.removeItem('accessToken');
  }
};

const handlers: Record<string, (state: IAuthState, action: TAction) => IAuthState> = {
  INITIALIZE: (state: IAuthState, action: TInitializeAction): IAuthState => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state: IAuthState, action: TLoginAction): IAuthState => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state: IAuthState): IAuthState => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state: IAuthState, action: TRegisterAction): IAuthState => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state: IAuthState, action: TAction): IAuthState =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = React.createContext<IAuthContextValue>({
  ...initialState,
  platform: 'JWT',
  login: () => {},
  logout: () => {},
  register: () => {}
});

export const AuthProvider: React.FC<IAuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { user } = useSelector((state: RootState) => state.auth);

  React.useEffect(() => {
    const initialize = () => {
      const accessToken = window.localStorage.getItem('accessToken');
      if (accessToken && verify(accessToken, JWT_SECRET)) {
        setSession(accessToken);

        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: true,
            user
          }
        });
      } else {
        setSession(null);

        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, [user]);

  const login = (accessToken: string, user: IUser) => {
    setSession(accessToken);
    dispatch({
      type: 'LOGIN',
      payload: {
        user
      }
    });
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  const register = (accessToken: string, user: IUser) => {
    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'JWT',
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
