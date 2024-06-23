export interface User {
  id: string;
  username: string;
  role: string;
  homeIds: Array<string>;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Address {
  addressLine: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface Home {
  id: number;
  address: Address;
  description: string;
  image: string;
  location: Location;
  state: string;
}

export interface AppState {
  isLoggedIn: boolean;
  user: User | null;
  homes: Home[];
  error: string | null;
}

export interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

export type Action =
  | {type: 'LOGIN'; payload: User}
  | {type: 'LOGOUT'}
  | {type: 'SET_HOMES'; payload: Home[]}
  | {type: 'SET_ERROR'; payload: string};
