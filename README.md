# snutt-internal

snutt internal 용도의 것들을 위한 모노레포

## Secrets

### Github Repository Secrets

- `NOTION_KANBAN_DATABASE_ID`
  - 노션의 칸반 페이지 데이터베이스 id. ex) `6e5...`
- `NOTION_EPIC_DATABASE_ID`
  - 노션의 에픽 페이지 데이터베이스 id. ex) `287...`
- `NOTION_KANBANBOT_TOKEN`
  - 노션 칸반 페이지를 읽기 위한 권한이 있는 봇의 토큰. ex) `secret_TK0...`
- `SLACK_TTUNS_TOKEN`
  - 슬랙에 메세지를 쏘기 위한 권한이 있는 [봇](https://api.slack.com/apps/A05K9150T9R)의 토큰. ex) `xoxb-697...`
- `SLACK_CHANNEL`
  - 메세지를 쏠 채널 이름. ex) `team-snutt-slack-test`
- `AWS_ACCESS_KEY_ID`
  - snutt-frontend-cicd IAM 의 access key id
- `AWS_SECRET_ACCESS_KEY`
  - snutt-frontend-cicd IAM 의 secret access key
- `AWS_REGION`
  - snutt-frontend-cicd IAM 의 region
- `AWS_ADMIN_WEB_S3_BUCKET_DEV`
  - snutt-admin-web dev 버킷
- `AWS_ADMIN_WEB_CLOUDFRONT_DISTRIBUTION_ID_DEV`
  - snutt-admin-web dev 클라우드프론트
- `SNUTT_API_KEY`
  - snutt 서버 apiKey
