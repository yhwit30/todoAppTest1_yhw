'use client';

import * as React from 'react';
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import { ThemeProvider } from '@mui/material/styles';
import classNames from 'classnames';
import {
  Button,
  AppBar,
  Toolbar,
  CssBaseline,
  TextField,
  Chip,
  Box,
  Drawer,
  SwipeableDrawer,
  MenuList,
  List,
  ListItem,
  Divider,
  ListItemButton,
  Modal,
  Snackbar,
  Alert,
} from '@mui/material';
import { FaBars, FaCheck, FaEllipsisH, FaTrash } from 'react-icons/fa';
import { FaPenToSquare } from 'react-icons/fa6';
import RootTheme from './theme';
import dateToStr from './dateUtil';

const todosAtom = atom({
  key: 'app/todosAtom',
  default: [],
});

const lastTodoIdAtom = atom({
  key: 'app/lastTodoIdAtom',
  default: 0,
});

function useTodosStatus() {
  const [todos, setTodos] = useRecoilState(todosAtom);
  // const [todos, setTodos] = React.useState([]);
  const [lastTodoId, setLastTodoId] = useRecoilState(lastTodoIdAtom);
  const lastTodoIdRef = React.useRef(lastTodoId);

  lastTodoIdRef.current = lastTodoId;

  const addTodo = (newContent) => {
    const id = ++lastTodoIdRef.current;
    setLastTodoId(id);

    const newTodo = {
      id,
      content: newContent,
      regDate: dateToStr(new Date()),
    };
    setTodos((todos) => [newTodo, ...todos]);

    return id;
  };

 

  const findTodoIndexById = (id) => {
    return todos.findIndex((todo) => todo.id == id);
  };

  const findTodoById = (id) => {
    const index = findTodoIndexById(id);

    if (index == -1) {
      return null;
    }

    return todos[index];
  };

  return {
    todos,
    addTodo,
    findTodoById
  };
}

const NewTodoForm = ({ noticeSnackbarStatus }) => {
  const todosStatus = useTodosStatus();

  const onSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    form.content.value = form.content.value.trim();

    if (form.content.value.length == 0) {
      alert('할 일 써');
      form.content.focus();
      return;
    }

    const newTodoId = todosStatus.addTodo(form.content.value);
    form.content.value = '';
    form.content.focus();
    noticeSnackbarStatus.open(`${newTodoId}번 todo 추가됨`);
  };

  return (
    <>
      <form onSubmit={(e) => onSubmit(e)} className="tw-flex tw-flex-col tw-p-4 tw-gap-2">
        <TextField
          minRows={3}
          maxRows={10}
          multiline
          name="content"
          autoComplete="off"
          label="할 일 써"
        />
        <Button variant="contained" className="tw-font-bold" type="submit">
          추가
        </Button>
      </form>
    </>
  );
};



const TodoListItem = ({ todo, index, openDrawer }) => {
  
  const [isClicked, setIsClicked] = React.useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked); // 클릭할 때마다 상태를 토글합니다.
  };

  return (
    <>
      <li key={todo.id}>
        <div className="tw-flex tw-flex-col tw-gap-2 tw-mt-3">
          <div className="tw-flex tw-gap-x-2 tw-font-bold">
            <Chip className="tw-pt-[3px]" label={`번호 : ${todo.id}`} variant="outlined" />
            <Chip
              className="tw-pt-[3px]"
              label={`날짜 : ${todo.regDate}`}
              variant="outlined"
              color="primary"
            />
          </div>
          <div className="tw-rounded-[10px] tw-shadow tw-flex tw-text-[14px] tw-min-h-[80px]">
            <Button className="tw-flex-shrink-0 tw-rounded-[10px_0_0_10px]" color="inherit">
            <FaCheck
      className={classNames(
        'tw-text-3xl',
        {
          'tw-text-[--mui-color-primary-main]': isClicked,
        },
        { 'tw-text-[#dcdcdc]': !isClicked },
      )}
      onClick={handleClick} // 클릭 이벤트를 처리할 함수를 전달합니다.
    />
            </Button>
            <div className="tw-bg-[#dcdcdc] tw-w-[2px] tw-h-[60px] tw-self-center"></div>
            <div className="tw-bg-blue-300 tw-flex tw-items-center tw-p-3 tw-flex-grow hover:tw-text-[--mui-color-primary-main] tw-whitespace-pre-wrap tw-leading-relaxed tw-break-words">
              {todo.content}
            </div>
         
          </div>
        </div>
      </li>
    </>
  );
};



const TodoList = ({ noticeSnackbarStatus }) => {
  const todosStatus = useTodosStatus();


  return (
    <>
      
      <nav>
        할 일 갯수 : {todosStatus.todos.length}
        <ul>
          {todosStatus.todos.map((todo, index) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              index={index}
            />
          ))}
        </ul>
      </nav>
    </>
  );
};

function NoticeSnackbar({ status }) {
  return (
    <>
      <Snackbar
        open={status.opened}
        autoHideDuration={status.autoHideDuration}
        onClose={status.close}>
        <Alert variant={status.variant} severity={status.severity}>
          {status.msg}
        </Alert>
      </Snackbar>
    </>
  );
}

function useNoticeSnackbarStatus() {
  const [opened, setOpened] = React.useState(false);
  const [autoHideDuration, setAutoHideDuration] = React.useState(null);
  const [variant, setVariant] = React.useState(null);
  const [severity, setSeverity] = React.useState(null);
  const [msg, setMsg] = React.useState(null);

  const open = (msg, severity = 'success', autoHideDuration = 3000, variant = 'filled') => {
    setOpened(true);
    setMsg(msg);
    setSeverity(severity);
    setAutoHideDuration(autoHideDuration);
    setVariant(variant);
  };

  const close = () => {
    setOpened(false);
  };

  return {
    opened,
    open,
    close,
    autoHideDuration,
    variant,
    severity,
    msg,
  };
}

function App() {
  const todosStatus = useTodosStatus();
  const noticeSnackbarStatus = useNoticeSnackbarStatus();


  return (
    <>
      <AppBar position="fixed">
        <Toolbar className="tw-flex tw-justify-center">
             <div className="logo-box tw-flex tw-justify-center">
            <a href="/" className="tw-font-bold">
              TODO!
            </a>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <NoticeSnackbar status={noticeSnackbarStatus} />
      <NewTodoForm noticeSnackbarStatus={noticeSnackbarStatus} />
      <TodoList noticeSnackbarStatus={noticeSnackbarStatus} />
    </>
  );
}

export default function themeApp() {
  const theme = RootTheme();

  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </RecoilRoot>
  );
}
