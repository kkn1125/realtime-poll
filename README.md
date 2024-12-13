# SnapPoll Back-end

서버사이드 구현

- 2024-12-14
  - add
    - 프로필 이미지 업로드 기능 추가
    - 프로필 이미지 읽기 API 추가
  - fix
    - 토큰 발급 방식 변경
  - todo
    - 미사용 리소스 제거
- 2024-12-13
  - add
    - Grade, AuthProvider, Role Enum 타입 추가
    - 로컬, 소셜 유저 dto 생성
  - fix
    - 로거 클래스 컨텍스트 표기
    - prisma 유저 로컬, 소셜 테이블 분리 상하 관계로 변경
    - 테이블 변경 사항 코드레벨 반영
    - RoleGuard 로직 변경, 단일책임
    - CookieGuard 로직 수정
    - CookieGuard 전역 가드로 설정
    - IgnoreCookie 데코레이터 수정
- 2024-12-12
  - add
    - 계정 비밀번호 초기화 및 임시 발급 기능 구현
    - 비밀번호 변경 API 추가
  - fix
    - 개인정보 변경 기능 활성화
    - 카카오 로그인 비활성화
- 2024-12-11
  - add
    - 429 too many requests 예외 추가
    - throttler 미들웨어 추가
    - 전역 exception filter 추가
    - 소셜 로그인 추가 (카카오)
    - KAKAO_KEY키 yaml 추가
- 2024-12-10
  - feat
    - 이메일 본인인증 구현
    - 회원가입 시 이메일 인증 절차 추가
    - 인증 토큰 만료 및 확인 페이지 제작
    - 인증 만료시간 1분 지정
  - add
    - 설문, 투표 공개 URL 생성, 정지, 복구 API 구현
- 2024-12-09
  - feat
    - 설문, 투표 수정 API 구현
      - nested update 구현
- 2024-12-08
  - feat
    - 보드 API 수정
    - 프리즈마 테이블 onDelete, onUpdate 구조 수정
  - add
    - response interceptor 추가
- 2024-12-06
  - feat
    - profile upload API 수정
      - 존재 할 경우 업데이트
      - 없을 경우 생성
    - auth verify 응답 값 getMe API와 통일
    - logger middleware query 표시 방식 변경
    - role guard 토큰 만료 에러 분기 처리
- 2024-12-05
  - feat
    - board API 초안 제작
    - basic 모듈 제작
    - 미들웨어 로거 출력 옵션 추가
    - sitemap 동적 응답 추가
    - 알림 모두 읽기 메세지 이벤트 추가
    - sitemap prefix 제외
- 2024-12-04
  - feat
    - version API 추가
    - 투표 테이블 구조 변경
    - 투표 API 기능 개선
    - (polls|votes)/me/response API 추가
    - 참여 기록 제거 기능추가
    - 로그인 리프레시 토큰 기능 추가 구현
      - 토큰 만료 시 리프레시 검증 및 재발급
      - 리프레시마저 만료 시 토큰 제거 및 로그아웃 처리
- 2024-12-03
  - feat
    - 설문조사 API 기능 점검
    - 투표 API 기능 개선
    - 설문, 투표 각 응답 API 기능 제작
    - 설문, 투표 API 전체 및 사용자 아이템 조회 페이지네이션 기능 추가
    - 메세지 테이블 추가, 알림 기능 추가
    - 설문조사 작성 시 글쓴 사람에게 알림
- 2024-12-02
  - feat
    - 설문조사 post메서드 nested write 방식으로 변경
    - 설문조사 응답 post 메서드 상동
- 2024-11-28
  - feat
    - 회원탈퇴 API 데이터 삭제에서 제거 시간 업데이트로 변경
    - 탈퇴 신청 리스트 배치를 통해 제거 기능 구현 예정
- 2024-11-27
  - feat
    - 로그인 및 verify API 응답 변경
    - 로그인 및 토큰 검증, 로그인 유지 설계 변경
- 2024-11-26
  - feat
    - logout API 구현
    - 쿠키, 롤 가드 기능 개선
- 2024-11-25
  - feat
    - user auth API 제작
    - 토큰 검증 API 추가 구현
    - passport이용하여 토큰 검증
    - passport이용하여 로그인 토큰 검증
    - 커스텀 가드 추가
      - 쿠키 파싱
      - 토큰 검증
      - 토큰 + 유저 데이터 검증
    - 로그인 유지 관리 로직 수정
    - 로거 미들웨어 자세히 출력되도록 수정
    - polls 및 votes, users에 공통 호출 API 외 모두 Guard처리
