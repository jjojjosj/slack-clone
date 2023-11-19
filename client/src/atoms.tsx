import { atom } from "recoil";

export interface IUserInfo {
  userId: string;
  socketId: string;
  status?: boolean;
  type: string;
}

export interface IGroupInfo {
  userId: string;
  socketId: string;
  status?: boolean;
  type: string;
}
export interface IContext {
  loginInfo: {
    userId: string;
    socketId: string;
  };
  userList: IUserInfo[];
  groupList: IGroupInfo[];
  currentChat: {
    targetId: string[];
    roomNumber: string;
    targetSocketId: string;
  };
  groupChat: {
    textBarStatus: boolean;
    groupChatNames: string[];
  };
}

export const contextState = atom<IContext>({
  key: "context",
  default: {
    loginInfo: {
      userId: "",
      socketId: "",
    },
    userList: [],
    groupList: [],
    currentChat: {
      targetId: [],
      roomNumber: "",
      targetSocketId: "",
    },
    groupChat: {
      textBarStatus: false,
      groupChatNames: [],
    },
  },
});
