import React from 'react';
// import { useSelector } from 'react-redux';
import Amplify, { Auth } from 'aws-amplify';
import { awsAmplifyConfig } from '../config';
// import { RootState } from 'store/store';
import { IUser } from 'pages/account/account-types';

Amplify.configure(awsAmplifyConfig);

interface IAuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: Partial<IUser> | null;
}

interface IAuthContextValue extends IAuthState {
  platform: 'Amplify';
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  verifyCode: (username: string, code: string) => Promise<void>;
  resendCode: (username: string) => Promise<void>;
  passwordRecovery: (username: string) => Promise<void>;
  passwordReset: (username: string, code: string, newPassword: string) => Promise<void>;
}

interface IAuthProviderProps {
  children: React.ReactNode;
}

type TInitializeAction = {
  type: 'INITIALIZE';
  payload: {
    isAuthenticated: boolean;
    user: Partial<IUser> | null;
  };
};

type TLoginAction = {
  type: 'LOGIN';
  payload: {
    user: Partial<IUser>;
  };
};

type TLogoutAction = {
  type: 'LOGOUT';
};

type TRegisterAction = {
  type: 'REGISTER';
};

type TVerifyCodeAction = {
  type: 'VERIFY_CODE';
};

type TResendCodeAction = {
  type: 'RESEND_CODE';
};
type TPasswordRecoveryAction = {
  type: 'PASSWORD_RECOVERY';
};

type TPasswordResetAction = {
  type: 'PASSWORD_RESET';
};

type TAction =
  | TInitializeAction
  | TLoginAction
  | TLogoutAction
  | TRegisterAction
  | TVerifyCodeAction
  | TResendCodeAction
  | TPasswordRecoveryAction
  | TPasswordResetAction;

const initialState: IAuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
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
  REGISTER: (state: IAuthState): IAuthState => ({ ...state }),
  VERIFY_CODE: (state: IAuthState): IAuthState => ({ ...state }),
  RESEND_CODE: (state: IAuthState): IAuthState => ({ ...state }),
  PASSWORD_RECOVERY: (state: IAuthState): IAuthState => ({ ...state }),
  PASSWORD_RESET: (state: IAuthState): IAuthState => ({ ...state })
};

const reducer = (state: IAuthState, action: TAction): IAuthState =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = React.createContext<IAuthContextValue>({
  ...initialState,
  platform: 'Amplify',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  verifyCode: () => Promise.resolve(),
  resendCode: () => Promise.resolve(),
  passwordRecovery: () => Promise.resolve(),
  passwordReset: () => Promise.resolve()
});

export const AuthProvider: React.FC<IAuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = React.useReducer(reducer, initialState);
  // const { user } = useSelector((state: RootState) => state.auth);

  React.useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        const user = await Auth.currentAuthenticatedUser();

        // Here you should extract the complete user profile to make it
        // available in your entire app.
        // The auth state only provides basic information.

        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: true,
            user: {
              id: user.sub,
              email: user.attributes.email,
              name: 'Jane Rotanson'
            }
          }
        });
      } catch (error) {
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
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const user = await Auth.signIn(email, password);

    if (user.challengeName) {
      console.error(
        `Unable to login, because challenge "${user.challengeName}" is mandated and we did not handle this case.`
      );
      return;
    }

    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          id: user.attributes.sub,
          email: user.attributes.email,
          name: 'Jane Rotanson'
        }
      }
    });
  };

  const logout = async (): Promise<void> => {
    await Auth.signOut();
    dispatch({
      type: 'LOGOUT'
    });
  };

  const register = async (email: string, password: string): Promise<void> => {
    await Auth.signUp({
      username: email,
      password,
      attributes: { email }
    });
    dispatch({
      type: 'REGISTER'
    });
  };

  const verifyCode = async (username: string, code: string): Promise<void> => {
    await Auth.confirmSignUp(username, code);
    dispatch({
      type: 'VERIFY_CODE'
    });
  };

  const resendCode = async (username: string): Promise<void> => {
    await Auth.resendSignUp(username);
    dispatch({
      type: 'RESEND_CODE'
    });
  };

  const passwordRecovery = async (username: string): Promise<void> => {
    await Auth.forgotPassword(username);
    dispatch({
      type: 'PASSWORD_RECOVERY'
    });
  };

  const passwordReset = async (
    username: string,
    code: string,
    newPassword: string
  ): Promise<void> => {
    await Auth.forgotPasswordSubmit(username, code, newPassword);

    dispatch({
      type: 'PASSWORD_RESET'
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'Amplify',
        login,
        logout,
        register,
        verifyCode,
        resendCode,
        passwordRecovery,
        passwordReset
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
