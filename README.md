# 낯가리는 사람들... [커뮤니티] [FE]

## 1. 프로젝트 개요

### 프로젝트 소개

1인 개발로 진행한 '낯가리는 사람들' 커뮤니티 서비스의 **프론트엔드 파트**입니다.

이 프로젝트는 **React**와 **JavaScript**를 기반으로 구축되었으며, 사용자가 게시글과 댓글을 작성하고 다른 사용자와 소통할 수 있는 핵심적인 인터페이스를 제공합니다.

> 개발 기간 : 2024.11 ~ 2025.02<br/>
> 개인 프로젝트<br/>
> URL: [폐쇄됨]

### 개발 스택

<div style="display:flex;gap:10px;flex-wrap:wrap;">
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white">
    <img src="https://img.shields.io/badge/node.js-6DB33F?style=for-the-badge&logo=node.js&logoColor=white">
    <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white">
    <img src="https://img.shields.io/badge/react-black?logo=react&style=for-the-badge">
    <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
</div>

## 2. 전체 프로젝트 소개 및 백엔드 저장소

이 프론트엔드와 연결되는 백엔드 시스템 및 전체 프로젝트에 대한 상세한 설명은 아래 링크에서 확인하실 수 있습니다.

* **[Backend v1 (Node.js & Express)](https://github.com/100-hours-a-week/2-dylan-lee-community-be)**
* **[Backend v2 (FastAPI - Refactored)](https://github.com/webplusangels/dylan-community-be-fastapi)**

### 주요 기능

-   **사용자:** 회원가입, 로그인/로그아웃, 프로필 수정
-   **게시글:** 전체 게시글 목록 조회, 개별 게시글 상세 조회, 게시글 작성 및 수정/삭제
-   **댓글:** 게시글별 댓글 조회, 댓글 작성 및 수정/삭제

### 배포

Github Actions와 S3를 활용하여 CI/CD 파이프라인을 구축하고 빌드와 배포 과정을 자동화했습니다. main 브랜치에 코드가 Push 되면 다음 과정이 자동으로 실행됩니다.

1. Preparation: 코드를 Checkout하고, `.env` 환경변수 파일을 생성합니다.
2. Dependencies & Build: `Node.js` 환경에서 의존성을 설치하고, 빌드합니다.
3. Deplyment: 빌드한 파일을 S3에 업로드하고, 배포합니다.


## 실행 방법

### 환경 변수 설정

`.env` 파일을 생성하고 백엔드 서버의 API 주소를 입력해주세요.

```

# .env

REACT\_APP\_API\_URL=http://localhost:3000

```

### 설치 및 실행

```bash
# 1. 레포지토리 클론
$ git clone [https://github.com/100-hours-a-week/2-dylan-lee-community-fe-react.git](https://github.com/100-hours-a-week/2-dylan-lee-community-fe-react.git)

# 2. 패키지 설치
$ npm install

# 3. 로컬 서버 실행
$ npm start
```
