import React, { useState, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import TextEditor from "./TextEditor";
import GroupTextInput from "./GroupTextInput";
import { IUserInfo, contextState } from "../atoms";
import { socketGroup, socketPrivate } from "../socket";
import dayjs from "dayjs";
import styled from "styled-components";
import logo from "../images/logo.png";

interface IMsg {
  msg: string;
  userId: string;
  time: string;
}

interface IMsgFrom {
  msg: string;
  fromUserId: string;
  time: string;
}

const ChatRoomWrapper = styled.article`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const SubTitle = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  font-size: 20px;
  height: 50px;
  font-weight: bold;
  padding: 0 20px;
  border-bottom: 1px solid #cecece;

  .active {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #29ac76;
  }
  .deactive {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    border: 1px solid #cecece;
  }
`;

const ChatBox = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 20px;
  flex: 1 1 auto;
  overflow: scroll;
  height: 400px;
  gap: 10px;
`;

const Chat = styled.li`
  display: flex;
  flex-direction: column;
  padding-left: 10px;

  .userBox {
    align-items: center;
    display: flex;
    flex-direction: row;
    gap: 5px;

    .user {
      font-weight: bold;
      font-size: 14px;
    }
    .date {
      color: grey;
      font-size: 10px;
    }
  }
  .textBox {
  }
`;

const ChatBoxGuide = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  justify-content: center;
  align-items: center;
  height: 500px;
  gap: 20px;

  .guide {
    font-weight: bold;
    font-size: 2rem;
  }
`;

export default function ChatRoom() {
  const [state, setState] = useRecoilState(contextState);
  const reactQuillRef = useRef<any>(null);
  const [text, setText] = useState("");
  const [groupUser, setGroupUser] = useState("");
  const [msgList, setMsgList] = useState<IMsg[]>([]);
  const [groupChatUsers, setGroupChatUsers] = useState<string[]>([]);

  const { currentChat, loginInfo, groupChat, userList } = state;

  useEffect(() => {
    function setPrivateMsgListHandler(data: any) {
      const { msg, fromUserId, toUserId, time } = data;
      if (
        currentChat.roomNumber === `${fromUserId}-${toUserId}` ||
        currentChat.roomNumber === `${toUserId}-${fromUserId}`
      ) {
        setMsgList((prev) => [
          ...prev,
          {
            msg: msg,
            userId: fromUserId,
            time,
          },
        ]);
      }
    }
    socketPrivate.on("private-msg", setPrivateMsgListHandler);
    return () => {
      socketPrivate.off("private-msg", setPrivateMsgListHandler);
    };
  }, [currentChat.roomNumber]);

  useEffect(() => {
    function setGroupMsgListHandler(data: any) {
      const { msg, toUserSocketId, fromUserId, time } = data;
      if (currentChat.roomNumber === toUserSocketId) {
        setMsgList((prev) => [
          ...prev,
          {
            msg: msg,
            userId: fromUserId,
            time,
          },
        ]);
      }
    }
    socketGroup.on("group-msg", setGroupMsgListHandler);
    return () => {
      socketGroup.off("group-msg", setGroupMsgListHandler);
    };
  }, [currentChat.roomNumber]);

  useEffect(() => {
    function setMsgListInit(data: any) {
      setMsgList(
        data.msg.map((m: IMsgFrom) => ({
          msg: m.msg,
          userId: m.fromUserId,
          time: m.time,
        }))
      );
    }
    socketPrivate.on("private-msg-init", setMsgListInit);
    return () => {
      socketPrivate.off("private-msg-init", setMsgListInit);
    };
  }, []);

  useEffect(() => {
    function setGroupMsgListInit(data: any) {
      setMsgList(
        data.msg.map((m: IMsgFrom) => ({
          msg: m.msg,
          userId: m.fromUserId,
          time: m.time,
        }))
      );
    }
    socketGroup.on("group-msg-init", setGroupMsgListInit);
    return () => {
      socketGroup.off("group-msg-init", setGroupMsgListInit);
    };
  }, []);
  useEffect(() => {
    return () => {
      setMsgList([]);
    };
  }, [currentChat.roomNumber]);

  const onPrivateMsgSendHandler = () => {
    const msg = reactQuillRef.current?.unprivilegedEditor.getText();
    const currentTime = dayjs().format("HH:mm a");
    setMsgList((prev) => [
      ...prev,
      {
        msg: msg,
        userId: loginInfo.userId,
        time: currentTime,
      },
    ]);
    socketPrivate.emit("privateMsg", {
      msg: msg,
      toUserId: currentChat.targetId[0],
      toUserSocketId: currentChat.targetSocketId,
      fromUserId: loginInfo.userId,
      time: currentTime,
    });
    setText("");
  };

  const onGroupSendHandler = (e: any) => {
    e.preventDefault();
    if (userList.filter((v) => v.userId === groupUser).length > 0) {
      alert("The user does not exist.");
      setGroupUser("");
      return;
    }
    if (groupUser === loginInfo.userId) {
      alert("Please, Choose someone else.");
      setGroupUser("");
      return;
    }
    setGroupChatUsers([...groupChatUsers, groupUser]);
    setGroupUser("");
  };

  const onChangeGroupTextHandler = (e: any) => {
    setGroupUser(e.target.value);
  };

  const groupChatUserCloseClick = (e: any) => {
    const { id } = e.target.dataset;
    setGroupChatUsers(groupChatUsers.filter((v) => v !== id));
  };

  const onJoinClick = () => {
    if (groupChatUsers.length <= 0) return;
    const socketId = [...groupChatUsers, loginInfo.userId].join(",");
    const user = {
      socketId: socketId,
      status: true,
      userId: socketId,
      type: "group",
    };
    socketGroup.emit("reqGroupJoinRoom", user);
    setGroupChatUsers([]);
  };

  const onGroupMsgSendHandler = () => {
    const msg = reactQuillRef.current?.unprivilegedEditor.getText();
    const currentTime = dayjs().format("HH:mm a");
    setMsgList((prev) => [
      ...prev,
      {
        msg: msg,
        userId: loginInfo.userId,
        time: currentTime,
      },
    ]);
    socketGroup.emit("groupMsg", {
      toUserId: currentChat.targetSocketId,
      toUserSocketId: currentChat.targetSocketId,
      fromUserId: loginInfo.userId,
      msg: msg,
      time: currentTime,
    });
    setText("");
  };

  return (
    <ChatRoomWrapper>
      <SubTitle>
        {groupChat.textBarStatus ? (
          <GroupTextInput
            groupText={groupUser}
            onChangeGroupTextHandler={onChangeGroupTextHandler}
            groupChatUserList={groupChatUsers}
            onGroupSendHandler={onGroupSendHandler}
            groupChatUserCloseClick={groupChatUserCloseClick}
            onJoinClick={onJoinClick}
          />
        ) : (
          currentChat.targetId.map((v) => <span className="user">{v}</span>)
        )}
      </SubTitle>
      {currentChat.roomNumber ? (
        <ChatBox>
          {msgList.map((v, i) => (
            <Chat key={`${i}-chat`}>
              <div className="userBox">
                <span className="user">{v.userId}</span>
                <span className="date">{v.time}</span>
              </div>
              <div className="texetBox">{v.msg}</div>
            </Chat>
          ))}
        </ChatBox>
      ) : (
        <ChatBoxGuide>
          <img src={logo} width="100px" height="auto" alt="logo" />
          <div className="guide">Please, Choose a conversation.</div>
        </ChatBoxGuide>
      )}
      {currentChat.roomNumber && (
        <TextEditor
          onSendHandler={
            currentChat.targetId.length > 1
              ? onGroupMsgSendHandler
              : onPrivateMsgSendHandler
          }
          text={text}
          reactQuillRef={reactQuillRef}
          onChangeTextHandler={setText}
        />
      )}
    </ChatRoomWrapper>
  );
}
