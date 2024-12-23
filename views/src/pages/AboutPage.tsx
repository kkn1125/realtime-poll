import { Container, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface AboutPageProps {}
const AboutPage: React.FC<AboutPageProps> = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ flex: 1 }}>
      <Stack gap={10}>
        {/* Section 01 */}
        <Stack gap={2}>
          <Typography fontSize={32} fontWeight={700} gutterBottom>
            SnapPoll은
          </Typography>
          <Typography fontSize={18} fontWeight={300}>
            빠르고 직관적인 설문조사를 통해 사용자와의 소통을 새롭게 정의하는
            서비스입니다. 누구나 손쉽게 설문을 생성하고, 실시간으로 결과를
            확인하며, 데이터를 활용할 수 있습니다. 복잡한 설문 도구 대신, 간편한
            인터페이스로 효율적인 피드백을 받아보세요.
          </Typography>
          <Typography fontSize={18} fontWeight={300}>
            개인 사용자부터 비즈니스까지, 다양한 니즈에 맞는 커스터마이징 옵션을
            제공합니다. 스냅폴은 데이터 기반 의사결정을 돕는 강력한 도구로,
            여러분의 프로젝트와 비즈니스를 한 단계 업그레이드합니다. 설문조사도
            이제 스마트하게, 스냅폴과 함께하세요.
          </Typography>
        </Stack>

        {/* Section 02 */}
        {/* <Stack gap={2}>
          <Typography fontSize={32} fontWeight={700} gutterBottom>
            사용 방법
          </Typography>
          <Typography fontSize={18} fontWeight={300}>
            빠르고 직관적인 설문조사를 통해 사용자와의 소통을 새롭게 정의하는
            서비스입니다. 누구나 손쉽게 설문을 생성하고, 실시간으로 결과를
            확인하며, 데이터를 활용할 수 있습니다. 복잡한 설문 도구 대신, 간편한
            인터페이스로 효율적인 피드백을 받아보세요.
          </Typography>
          <Typography fontSize={18} fontWeight={300}>
            개인 사용자부터 비즈니스까지, 다양한 니즈에 맞는 커스터마이징 옵션을
            제공합니다. 스냅폴은 데이터 기반 의사결정을 돕는 강력한 도구로,
            여러분의 프로젝트와 비즈니스를 한 단계 업그레이드합니다. 설문조사도
            이제 스마트하게, 스냅폴과 함께하세요.
          </Typography>
        </Stack> */}
      </Stack>
    </Container>
  );
};

export default AboutPage;
