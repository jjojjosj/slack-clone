import React, { useEffect } from "react";
import User from "./User";
import { BiChevronDown } from "react-icons/bi";
import { socketGroup, socketPrivate } from "../socket";
import { useRecoilState } from "recoil";
import { contextState } from "../atoms";
import styled from "styled-components";

const NavBarWrapper = styled.nav`
  height: 100%;
  width: 250px;
  display: flex;
  flex-direction: column;
  background-color: #4a154b;
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #fff;
  font-weight: bold;
  padding: 0 20px;
  height: 50px;
  border-bottom: 1px solid rgba(234, 234, 234, 0.2);
`;

const UserList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const DirectMsg = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #cecece;
  font-size: 14px;
  padding: 7px 20px 7px 14px;
  cursor: pointer;
  &:hover {
    background-color: rgba(234, 234, 234, 0.2);
  }
`;

export default function SideBar() {
  const [state, setState] = useRecoilState(contextState);
  const { userList, loginInfo, currentChat, groupList } = state;

  useEffect(() => {
    if (currentChat.targetId.length > 1) {
      socketGroup.emit("msgInit", {
        targetId: currentChat.targetId,
      });
    } else {
      socketPrivate.emit("msgInit", {
        targetId: currentChat.targetId,
      });
    }
  }, [currentChat.targetId]);
  useEffect(() => {
    function setMsgAlert(data: any) {
      socketPrivate.emit("resJoinRoom", data.roomNumber);
    }
    socketPrivate.on("msg-alert", setMsgAlert);
    return () => {
      socketPrivate.off("msg-alert", setMsgAlert);
    };
  }, []);
  useEffect(() => {
    function setGroupChat(data: any) {
      socketGroup.emit("resGroupJoinRoom", {
        roomNumber: data.roomNumber,
        socketId: data.socketId,
      });
    }
    socketGroup.on("group-chat-req", setGroupChat);
    return () => {
      socketGroup.off("group-chat-req", setGroupChat);
    };
  }, []);

  const onUserClickHandler = (e: any) => {
    const { id } = e.target.dataset;
    setState((prev) => {
      return {
        ...prev,
        currentChat: {
          targetId: [id],
          roomNumber: `${loginInfo.userId}-${id}`,
          targetSocketId: e.target.dataset.socket,
        },
      };
    });
    socketPrivate.emit("reqJoinRoom", {
      targetId: id,
      targetSocketId: e.target.dataset.socket,
    });
    setState((prev) => {
      return {
        ...prev,
        groupChat: {
          textBarStatus: false,
          groupChatNames: [],
        },
      };
    });
  };
  const onMakeGroupChat = () => {
    setState((prev) => {
      return {
        ...prev,
        groupChat: {
          textBarStatus: true,
          groupChatNames: [],
        },
      };
    });
  };
  const onGroupUserClickHandler = (e: any) => {
    const { id } = e.target.dataset;
    setState((prev) => {
      return {
        ...prev,
        currentChat: {
          targetId: [...id.split(",")],
          roomNumber: id,
          targetSocketId: e.target.dataset.socket,
        },
      };
    });
    socketGroup.emit("joinGroupRoom", {
      roomNumber: id,
      socketId: e.target.dataset.socket,
    });
    setState((prev) => {
      return {
        ...prev,
        groupChat: {
          textBarStatus: false,
          groupChatNames: [],
        },
      };
    });
  };

  return (
    <NavBarWrapper>
      <Title> Slack</Title>
      <UserList>
        <DirectMsg onClick={onMakeGroupChat}>
          <BiChevronDown size="20" /> Direct Messages +
        </DirectMsg>
      </UserList>
      {userList.map((v, i) => (
        <li key={`${i}-user`}>
          <User
            id={v.userId}
            status={v.status}
            socket={v.socketId}
            type={v.type}
            onClick={
              v.type === "group" ? onGroupUserClickHandler : onUserClickHandler
            }
          />
        </li>
      ))}
      {groupList.map((v, i) => (
        <li key={`${i}-user`}>
          <User
            id={v.userId}
            status={v.status}
            socket={v.socketId}
            type={v.type}
            onClick={
              v.type === "group" ? onGroupUserClickHandler : onUserClickHandler
            }
          />
        </li>
      ))}
    </NavBarWrapper>
  );
}
