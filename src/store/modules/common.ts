/**
 * @name 公共
 * @namespace common
 * @description 公共 state
 */

import { createStateAtom } from '../utils';

export interface ICommonState {
  userInfo?: {};
  userInfoLoading: boolean;
}

export const { userInfoAtom, userInfoLoadingAtom } = createStateAtom<ICommonState>({
  namespace: 'common',
  initialState: {
    userInfo: undefined,
    userInfoLoading: false,
  },
});
