import { authConstants } from './constants';

export const resetStore = () => {
  return {
    type: authConstants.FLUSH,
  };
};
