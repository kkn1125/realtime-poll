import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  SvgIcon,
  Toolbar,
  Typography,
} from '@mui/material';

import Illu01 from '@assets/illustrations/illu-01.svg?react';
import Illu02 from '@assets/illustrations/illu-02.svg?react';

interface GuestHomeProps {}
const GuestHome: React.FC<GuestHomeProps> = () => {
  return (
    <Stack>
      {/* section 01 */}
      <Stack
        height="calc(100vh - 64px * 2)"
        sx={{
          backgroundColor: (theme) => theme.palette.info.light + '56',
          backgroundImage: `url(${import.meta.resolve('/images/main.jpg')})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <Toolbar />
        <Stack alignItems="center" gap={1}>
          <Typography
            align="center"
            fontSize={32}
            fontWeight={700}
            gutterBottom
          >
            간편한 모두의 설문조사
          </Typography>

          <Typography
            className="font-maru"
            width={500}
            align="center"
            fontWeight={500}
            sx={{ whiteSpace: 'balance' }}
          >
            쉽고 간편하게 만들어 공유하는 설문조사.
          </Typography>
          <Typography
            className="font-maru"
            width={500}
            align="center"
            fontWeight={500}
            sx={{ whiteSpace: 'balance' }}
          >
            설문 결과도 그래프로 간편하게 보세요!
          </Typography>
        </Stack>
      </Stack>

      {/* section 02 */}
      <Stack height="calc(100vh - 64px * 2)">
        <Toolbar />
        <Typography align="center" fontSize={32} fontWeight={700}>
          왜 SnapPoll인가?
        </Typography>
        <Toolbar />
        <Stack flex={1}>
          <Stack direction="row" justifyContent="space-between" gap={5}>
            {/* survey */}
            <Paper component={Stack} p={3}>
              <Stack alignItems="center" sx={{ float: 'right' }}>
                <Illu01 width={150} height={150} />
              </Stack>
              <Typography fontSize={24} fontWeight={700}>
                Poll
              </Typography>
              <Typography fontSize={14} fontWeight={500}>
                설문조사를 더 쉽고 스마트하게 만들어보세요. 복잡한 설정 없이 3분
                만에 전문적인 설문지를 제작하고, 실시간으로 응답을 수집할 수
                있습니다.
              </Typography>
            </Paper>
            {/* graph */}
            <Paper component={Stack} p={3}>
              <Stack alignItems="center" sx={{ float: 'left' }}>
                <Illu02 width={150} height={150} />
              </Stack>
              <Typography fontSize={24} fontWeight={700}>
                Graph
              </Typography>
              <Typography fontSize={14} fontWeight={500}>
                다양한 차트와 그래프로 한눈에 보는 분석 리포트를 제공합니다.
                응답자들의 의견을 직관적으로 파악하고 인사이트를 도출하세요.
              </Typography>
            </Paper>
            {/* share */}
            <Paper component={Stack} p={3}>
              <Stack alignItems="center" sx={{ float: 'right' }}>
                <Illu01 width={150} height={150} />
              </Stack>
              <Typography fontSize={24} fontWeight={700}>
                Share
              </Typography>
              <Typography fontSize={14} fontWeight={500}>
                설문 링크 하나로 누구나 쉽게 참여할 수 있습니다. 이메일, 메신저,
                SNS 등 다양한 채널을 통해 설문을 공유하고 더 많은 의견을
                모아보세요.
              </Typography>
            </Paper>
          </Stack>
        </Stack>
      </Stack>

      {/* section 03 */}
      <Stack height="calc(100vh - 64px * 2)">
        <Toolbar />
        <Typography align="center" fontSize={32} fontWeight={700}>
          어떻게 하면 되나요?
        </Typography>
        <Toolbar />
        <Box flex={1}>
          <Typography fontSize={20} align="center">
            지금 바로 무료로 시작하고, 설문조사의 새로운 경험을 만나보세요.
          </Typography>
        </Box>
        <Stack alignItems="center">
          <Button variant="contained" size="large">
            설문조사 만들기
          </Button>
        </Stack>
        <Toolbar />
      </Stack>
    </Stack>
  );
};

export default GuestHome;
