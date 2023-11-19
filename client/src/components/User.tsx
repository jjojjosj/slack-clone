import styled from "styled-components";

const UserRoot = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  color: #cecece;
  font-size: 14px;
  padding: 7px 20px;
  cursor: pointer;

  &:hover {
    background-color: rgba(234, 234, 234, 0.2);
  }
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
    background-color: #cecece;
  }
`;
export default function User({ id, status, onClick, socket, type }: any) {
  return (
    <UserRoot
      className="userRoot"
      data-id={id}
      data-type={type}
      data-socket={socket}
      data-status={status}
      onClick={onClick}
    >
      <span className={status ? "active" : "deactive"} />
      <span
        data-type={type}
        className="user"
        data-id={id}
        data-socket={socket}
        data-status={status}
      >
        {id}
      </span>
    </UserRoot>
  );
}
