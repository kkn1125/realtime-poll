import { VERSION } from '@common/variables';
import {
  default as ProtectedRoute,
  default as ProtectedRouted,
} from '@components/organisms/ProtectedRoute';
import AuthSignLayout from '@components/templates/AuthSignLayout';
import Layout from '@components/templates/Layout';
import PanelLayout from '@components/templates/PanelLayout';
import ShareLayout from '@components/templates/ShareLayout';
import useLoading from '@hooks/useLoading';
import useLogger from '@hooks/useLogger';
import useModal from '@hooks/useModal';
import useToken from '@hooks/useToken';
import AboutPage from '@pages/AboutPage';
import AccountPage from '@pages/auth/AccountPage';
import AuthPage from '@pages/auth/AuthPage';
import LoginPage from '@pages/auth/LoginPage';
import SignupPage from '@pages/auth/SignupPage';
import BoardListPage from '@pages/board/BoardListPage';
import CategoryBoardPage from '@pages/board/category/CategoryBoardPage';
import DetailBoardPage from '@pages/board/category/DetailBoardPage';
import WriteBoardPage from '@pages/board/WriteBoardPage';
import ForbiddenPage from '@pages/ForbiddenPage';
import GuestHomePage from '@pages/GuestHomePage';
import HomePage from '@pages/HomePage';
import NotfoundPage from '@pages/NotfoundPage';
import NoticePage from '@pages/notice/NoticePage';
import Panel from '@pages/panel/Panel';
import DetailPollGraphPage from '@pages/service/graph/polls/DetailPollGraphPage';
import PollGraphListPage from '@pages/service/graph/polls/PollGraphListPage';
import SelectGraphPage from '@pages/service/graph/SelectGraphPage';
import DetailVoteGraphPage from '@pages/service/graph/votes/DetailVoteGraphPage';
import VoteGraphListPage from '@pages/service/graph/votes/VoteGraphListPage';
import CreatePollPage from '@pages/service/poll/CreatePollPage';
import DetailPollPage from '@pages/service/poll/DetailPollPage';
import EditPollPage from '@pages/service/poll/EditPollPage';
import MyPollPage from '@pages/service/poll/MyPollPage';
import PollListPage from '@pages/service/poll/PollListPage';
import DetailResponsePollPage from '@pages/service/poll/response/DetailResponsePollPage';
import ResponsePollPage from '@pages/service/poll/response/ResponsePollPage';
import ServicePage from '@pages/service/ServicePage';
import SharePage from '@pages/service/share/SharePage';
import CreateVotePage from '@pages/service/vote/CreateVotePage';
import DetailVotePage from '@pages/service/vote/DetailVotePage';
import EditVotePage from '@pages/service/vote/EditVotePage';
import MyVotePage from '@pages/service/vote/MyVotePage';
import DetailResponseVotePage from '@pages/service/vote/response/DetailResponseVotePage';
import ResponseVotePage from '@pages/service/vote/response/ResponseVotePage';
import VoteListPage from '@pages/service/vote/VoteListPage';
import Subscribe from '@pages/subscribe/Subscribe';
import MyResponsePage from '@pages/user/MyResponsePage';
import PasswordPage from '@pages/user/PasswordPage';
import ProfilePage from '@pages/user/ProfilePage';
import UserPage from '@pages/user/UserPage';
import { Logger } from '@utils/Logger';
import { useLayoutEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

const logger = new Logger('AppRoot');

interface AppRootProps {}
const AppRoot: React.FC<AppRootProps> = () => {
  const { log } = useLogger();
  const { isMaster, user, isCrew, verify } = useToken();
  const locate = useLocation();
  const { closeModal } = useModal();
  const { openLoading, closeLoading } = useLoading();
  /* when change page */
  useLayoutEffect(() => {
    const randomIndex = Math.floor(Math.random() * 2);
    const type = ['poll', 'vote'][randomIndex];
    log('render init');
    openLoading(type);
    /* version save */
    localStorage.setItem('version', VERSION);

    verify();

    return () => {
      closeLoading();
      closeModal();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    logger.debug('path change');

    return () => {
      closeModal();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locate.pathname]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={isCrew ? <HomePage /> : <GuestHomePage />} />
        <Route path="price" element={<Subscribe />} />
        <Route path="notice" element={<NoticePage />} />
        <Route path="about" element={<AboutPage />} />

        {/* Authentications */}

        <Route path="auth" element={<ProtectedRouted roles={['Guest']} />}>
          <Route index element={<AuthPage />} />
          <Route element={<AuthSignLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
          </Route>
          <Route path="account" element={<AccountPage />} />
        </Route>

        {/* Board */}
        <Route path="board">
          <Route index element={<BoardListPage />} />
          <Route path=":category" element={<CategoryBoardPage />} />
          {isMaster && <Route path="new" element={<WriteBoardPage />} />}
          <Route path=":category/write" element={<WriteBoardPage />} />
          <Route path=":category/edit" element={<WriteBoardPage />} />
          <Route path=":category/:id" element={<DetailBoardPage />} />
        </Route>

        {/* User */}
        <Route
          path="user"
          element={<ProtectedRoute roles={['User', 'Admin']} />}
        >
          <Route index element={<UserPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="password" element={<PasswordPage />} />
          <Route path="response" element={<MyResponsePage />} />
        </Route>

        {/* Service */}
        <Route
          path="service"
          element={<ProtectedRoute roles={['User', 'Admin']} />}
        >
          <Route index element={<ServicePage />} />

          {/* Poll */}
          <Route path="poll">
            <Route index element={<PollListPage />} />
            <Route path="new" element={<CreatePollPage />} />
            <Route path=":id" element={<DetailPollPage />} />
            <Route path=":id/response" element={<ResponsePollPage />} />
            <Route path="edit/:id" element={<EditPollPage />} />
            <Route
              path=":id/response/:responseId"
              element={<DetailResponsePollPage />}
            />

            {/* User's */}
            <Route path="me">
              <Route index element={<MyPollPage />} />
              <Route path="response" element={<ResponsePollPage me />} />
            </Route>
          </Route>

          {/* Vote */}
          <Route path="vote">
            <Route index element={<VoteListPage />} />
            <Route path="new" element={<CreateVotePage />} />
            <Route path=":id" element={<DetailVotePage />} />
            <Route path=":id/response" element={<ResponseVotePage />} />
            <Route path="edit/:id" element={<EditVotePage />} />
            <Route
              path=":id/response/:responseId"
              element={<DetailResponseVotePage />}
            />

            {/* User's */}
            <Route path="me">
              <Route index element={<MyVotePage />} />
              <Route path="response" element={<ResponseVotePage me />} />
            </Route>
          </Route>

          {/* Graph */}
          <Route path="graph">
            {/* List */}
            <Route index element={<SelectGraphPage />} />

            {/* Poll */}
            <Route path="poll">
              <Route index element={<PollGraphListPage />} />
              <Route path=":id" element={<DetailPollGraphPage />} />
            </Route>

            {/* Vote */}
            <Route path="vote">
              <Route index element={<VoteGraphListPage />} />
              <Route path=":id" element={<DetailVoteGraphPage />} />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* Service use an other layout */}
      <Route
        path="service"
        element={<ProtectedRoute roles={['User', 'Admin']} />}
      >
        <Route path="poll">
          <Route element={<ShareLayout />}>
            <Route path="share" element={<SharePage />} />
          </Route>
        </Route>
        <Route path="vote">
          <Route element={<ShareLayout />}>
            <Route path="share" element={<SharePage />} />
          </Route>
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['Admin']} />}>
        <Route path="panel" element={<PanelLayout />}>
          <Route index element={<Panel />} />
        </Route>
      </Route>

      {/* Notfound Page */}
      <Route element={<Layout />}>
        <Route path="*" element={<NotfoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoot;
