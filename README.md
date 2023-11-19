# Slack clone 프로젝트

## React CRA + Socket.io를 활용한 Slack clone

"리액트로 배우는 소켓 프로그래밍" 책의 Part.02 4장 Slack 클론 프로젝트를 따라해보자.

### 준비사항

- mongodb 서버가 필요

### 몇 가지 책과 다르게 구현한 점

1. Typescript로 작성
2. useReducer대신에 Recoil 사용
3. emotionjs 대신에 styled-components 사용
4. Cloud mongodb 서버 대신에 자체 mongodb 서버 사용

### .env에 필요한 사항(서버 사이드)

- MONGODB_HOST, MONGODB_PORT, MONGODB_USER, MONGODB_PASSWORD
