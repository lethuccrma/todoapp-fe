import IBase from './IBase';

type IUser = IBase & {
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  avatarURL?: string;
};

export default IUser;
