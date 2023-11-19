import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { HiPaperAirplane } from "react-icons/hi2";
import styled from "styled-components";

const modules = {
  toolbar: {
    containers: [
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
    ],
  },
};

const RootTextEditor = styled.div`
  position: relative;
  width: 800px;
  .quill {
    margin: 20px;
    background-color: #fff;
    border: 1px solid #cecece;
    border-radius: 15px;
  }
  .ql-container.ql-snow {
    border: none;
    display: flex;
  }
  .ql-container .ql-editor {
    width: 100%;
  }
  .ql-toolbar.ql-snow {
    width: calc(100% - 30px);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    display: flex;
    position: sticky;
    top: 0;
    z-index: 1;
    border: none;
  }
`;

const SendButton = styled(HiPaperAirplane)`
  position: absolute;
  right: 30px;
  top: 30px;
  height: 25px;
  width: 25px;
  color: #29ac76;
  cursor: pointer;
`;

export default function TextEditor({
  text,
  onChangeTextHandler,
  reactQuillRef,
  onSendHandler,
}: any) {
  return (
    <RootTextEditor className="rootTextEditer">
      <SendButton onClick={onSendHandler} />
      <ReactQuill
        theme="snow"
        modules={modules}
        value={text}
        onChange={onChangeTextHandler}
        ref={(el) => {
          reactQuillRef.current = el;
        }}
      ></ReactQuill>
    </RootTextEditor>
  );
}
