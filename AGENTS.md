# AGENTS.md

## 프로젝트 이름

Bella Daisy Mastering Lab

## 프로젝트 목표

이 프로젝트는 브라우저에서 동작하는 음악 마스터링 웹앱이다.

사용자는 mp3/wav 파일을 업로드하고, 음악을 미리 들으면서 기본 마스터링 효과를 적용할 수 있어야 한다.

## 1단계 목표

처음 버전에서는 아래 기능만 만든다.

- Audio file upload
- Play / Pause
- Mastering presets
  - Clean
  - Warm
  - Loud
  - Bright
  - Soft
- Manual sliders
  - Input Gain
  - Bass
  - Mid
  - Treble
  - Compressor Amount
  - Limiter
  - Output Gain
- Real-time preview
- WAV export

## 개발 방향

- React 또는 Next.js를 사용한다.
- Web Audio API를 사용한다.
- 처음부터 너무 복잡하게 만들지 않는다.
- 나중에 stem separation 기능을 추가할 수 있도록 구조를 나눈다.
- stem separation은 드럼, 베이스, 보컬, 기타 악기 소리를 분리하는 기능이다.

## 작업 규칙

- 변경한 파일 목록을 설명한다.
- 실행 방법을 알려준다.
- 실제 mp3/wav 파일, API key, 비밀번호, 토큰은 저장소에 넣지 않는다.
- 어려운 기능은 억지로 만들지 말고, 왜 어려운지 설명한다.
