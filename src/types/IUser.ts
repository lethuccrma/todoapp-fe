import IBase from './IBase';

type IUser = IBase & {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
};

export default IUser;
