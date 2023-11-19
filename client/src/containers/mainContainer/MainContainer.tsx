import React, { useEffect } from "react";
import SideBar from "../../components/SideBar";
import ChatRoom from "../../components/ChatRoom";
import { useRecoilState } from "recoil";
import { IGroupInfo, IUserInfo, contextState } from "../../atoms";
import styled from "styled-components";
import { socket, socketPrivate, socketGroup } from "../../socket";

const RootMainContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SlackMain = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  border: 1px solid #4a154b;
  border-radius: 5px;
`;

const SlackHeader = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  width: calc(100%-40px);
  background-color: #340e36;
  &.user {
    color: #ffff;
    font-weight: bold;
  }
`;

const SlackWindow = styled.ul`
  display: flex;
  flex-direction: row;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;

  li.green {
    cursor: pointer;
    background-color: #26c840;
    border-radius: 50%;
    width: 10px;
    height: 10px;
  }
  li.red {
    cursor: pointer;
    background-color: #fe5f58;
    border-radius: 50%;
    width: 10px;
    height: 10px;
  }
  li.orange {
    cursor: pointer;
    background-color: #febc2e;
    border-radius: 50%;
    width: 10px;
    height: 10px;
  }
`;

const MainContent = styled.article`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

export default function MainContainer() {
  const [state, setState] = useRecoilState(contextState);
  const { loginInfo } = state;
  useEffect(() => {
    socket.on("connect", () => {
      const data: { [key: string]: any } = socket.auth;
      setState((prev) => {
        return {
          ...prev,
          loginInfo: {
            userId: data.userId,
            socketId: socket.id,
          },
        };
      });
    });
    return () => {
      socket.disconnect();
      socketPrivate.disconnect();
      socketGroup.disconnect();
    };
  }, [setState]);

  useEffect(() => {
    function setUserListHandler(data: IUserInfo[]) {
      setState((prev) => {
        return { ...prev, userList: data || [] };
      });
    }
    socket.on("user-list", setUserListHandler);
    return () => {
      socket.off("user-list", setUserListHandler);
    };
  }, [setState]);

  useEffect(() => {
    function setGroupListHandler(data: IGroupInfo[]) {
      setState((prev) => {
        return { ...prev, groupList: data || [] };
      });
    }
    socketGroup.on("group-list", setGroupListHandler);
    return () => {
      socketGroup.off("group-list", setGroupListHandler);
    };
  }, [setState]);

  return (
    <RootMainContainer className="rootMainContainer">
      <SlackMain className="slackMain">
        <SlackHeader className="slackHeader">
          <SlackWindow className="slackWindow">
            <li className="red"></li>
            <li className="orange"></li>
            <li className="green"></li>
          </SlackWindow>
          <div className="user">{loginInfo.userId}</div>
        </SlackHeader>
        <MainContent>
          <SideBar />
          <ChatRoom />
        </MainContent>
      </SlackMain>
    </RootMainContainer>
  );
}
