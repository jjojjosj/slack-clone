import styled from "styled-components";

const GroupTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  width: 100%;
`;

const Title = styled.span`
  color: grey;
  font-size: 14px;
`;

const NameBox = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-content: center;
`;

const Tag = styled.li`
  display: flex;
  flex-direction: row;
  gap: 5px;
  background-color: #cecece;
  padding: 5px 8px;
  font-size: 12px;
  border-radius: 5px;

  .close {
    cursor: pointer;
  }
`;

const GroupForm = styled.form`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const Input = styled.input`
  padding: 5px 10px;
  width: 100%;
  border: 1px solid #cecece;
  border-radius: 10px;
`;

const JoinButton = styled.button`
  border: 0;
  background-color: #4a154b;
  color: #fff;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
`;

export default function GroupTextInput({
  groupText,
  onChangeGroupTextHandler,
  onGroupSendHandler,
  groupChatUserList,
  groupChatUserCloseClick,
  onJoinClick,
}: any) {
  return (
    <GroupTextContainer>
      <Title>to:</Title>
      <NameBox>
        {groupChatUserList.map((v: any, i: number) => (
          <Tag key={`${i}-${v}`}>
            {v}
            <span
              className="close"
              data-id={v}
              onClick={groupChatUserCloseClick}
            >
              X
            </span>
          </Tag>
        ))}
      </NameBox>
      <GroupForm onSubmit={onGroupSendHandler}>
        <Input
          type="text"
          value={groupText}
          onChange={onChangeGroupTextHandler}
        />
      </GroupForm>
      <JoinButton onClick={onJoinClick}>Join</JoinButton>
    </GroupTextContainer>
  );
}
