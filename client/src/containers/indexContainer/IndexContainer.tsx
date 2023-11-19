import { socket, socketPrivate, socketGroup } from "../../socket";
import { useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";
import { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";

const RootIndexContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const LoginWrapper = styled.div`
  width: 300px;
  height: 300px;
  display: flex;
  flex-direction: column;
`;
const Header = styled.h1`
  text-align: center;
`;

const LoginForm = styled.form`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  width: 100%;
`;
const Input = styled.input`
  width: calc() (100%-22px);
  border: 1px solid #cecece;
  padding: 10px;
  border-radius: 5px;
`;
const Button = styled.button`
  width: 100%;
  border: 0;
  padding: 10px;
  border-radius: 5px;
  background-color: #4a154b;
  color: white;
  font-weight: bold;
  cursor: pointer;
`;

const IndexContainer = () => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        console.log("err");
      }
    });
  }, []);
  const onLoginHandler = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user) return;
    socket.auth = { userId: user };
    socket.connect();
    socketPrivate.auth = { userId: user };
    socketPrivate.connect();
    socketGroup.auth = { userId: user };
    socketGroup.connect();
    navigate("/main");
  };

  const onUserNameHandler = (e: FormEvent<HTMLInputElement>) => {
    setUser(e.currentTarget.value);
  };

  return (
    <RootIndexContainer>
      <LoginWrapper>
        <Header>
          <img src={logo} width="100px" height="auto" alt="logo" />
        </Header>
        <LoginForm>
          <Input
            type="text"
            value={user}
            placeholder="Enter your ID"
            onChange={onUserNameHandler}
          />
          <Button onClick={onLoginHandler}>Sign in</Button>
        </LoginForm>
      </LoginWrapper>
    </RootIndexContainer>
  );
};

export default IndexContainer;
