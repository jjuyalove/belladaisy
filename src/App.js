import React, { useMemo, useState } from 'react';

const h = React.createElement;
const sunoUrl = 'https://suno.com/create';

const storyGroups = [
  {
    title: '계절과 풍경',
    description: '노래의 첫 장면을 쉽게 떠올릴 수 있는 배경이에요.',
    items: ['봄비', '여름', '가을 낙엽', '겨울 첫눈', '밤바다', '강가', '고향역', '달빛 산책', '노을', '꽃길', '시골 버스', '도시의 불빛'],
  },
  {
    title: '사랑과 인연',
    description: '가사에 가장 많이 쓰이는 마음의 키워드예요.',
    items: ['첫사랑', '그리움', '재회', '이별 후 미소', '오래된 약속', '친구 같은 사랑', '부부의 정', '설레는 고백', '기다림', '추억 사진', '다시 만난 사람', '말하지 못한 진심'],
  },
  {
    title: '인생과 응원',
    description: '시니어 교육생에게 친숙한 인생 이야기입니다.',
    items: ['인생 2막', '다시 시작', '괜찮아', '오늘이 제일 젊다', '내 편', '웃으며 살자', '세월의 선물', '작은 행복', '건강한 하루', '용기', '감사', '꿈은 계속된다'],
  },
  {
    title: '가사 문장',
    description: '클릭하면 프롬프트에 바로 들어가는 문장입니다.',
    items: [
      '밤바다에 비친 달처럼 잔잔한 마음을 담아줘',
      '첫사랑을 떠올리며 미소 짓는 따뜻한 가사로 써줘',
      '힘든 세월을 지나 다시 꽃피는 인생을 노래해줘',
      '고향집 마당과 어머니의 손길이 떠오르게 해줘',
      '따라 부르기 쉬운 후렴과 희망적인 메시지를 넣어줘',
      '친구들과 함께 박수치며 부를 수 있는 분위기로 만들어줘',
    ],
  },
];

const artistGroups = [
  {
    title: '👑 트로트 전설',
    items: [
      ['남진', '정통 트로트, 남성 보컬, 당당하고 낭만적인 무대 분위기, 쉬운 후렴'],
      ['나훈아', '깊은 감성의 트로트 발라드, 카리스마 있는 남성 보컬, 인생 서사'],
      ['심수봉', '싱어송라이터 감성 트로트, 애절한 멜로디, 독보적인 음색 느낌'],
      ['주현미', '정통 트로트, 맑고 우아한 여성 보컬, 간드러지는 꺾기'],
      ['김연자', '화려한 엔카풍 트로트, 강한 고음, 축제 같은 에너지'],
      ['설운도', '대중적인 정통 트로트, 신나는 리듬, 기억하기 쉬운 멜로디'],
      ['태진아', '흥겨운 대중 트로트, 밝은 남성 보컬, 행사장 분위기'],
      ['송대관', '친근한 세미 트로트, 유쾌한 가사, 따라 부르기 쉬운 후렴'],
    ],
  },
  {
    title: '🌟 뉴트로트 중견',
    items: [
      ['장윤정', '세미 트로트, 발랄하고 세련된 여성 보컬, 중독성 있는 후렴'],
      ['홍진영', '댄스 트로트, 쌈바 리듬, 밝고 애교 있는 여성 보컬'],
      ['박현빈', '빠른 댄스 트로트, 시원한 남성 보컬, 축제와 회식 분위기'],
      ['진성', '애절한 정통 트로트, 묵직한 남성 보컬, 고향과 인생 이야기'],
    ],
  },
  {
    title: '🚀 오디션 대세',
    items: [
      ['임영웅', '감성 트로트 발라드, 따뜻한 남성 보컬, 큰 스케일의 편곡'],
      ['송가인', '국악 색채가 있는 정통 트로트, 힘 있는 여성 보컬, 한 많은 감성'],
      ['영탁', '신나는 세미 트로트, 유쾌한 에너지, 현대적인 밴드 사운드'],
      ['이찬원', '구수한 정통 트로트, 맑은 남성 보컬, 친근한 꺾기'],
      ['장민호', '세련된 트로트 팝, 부드러운 남성 보컬, 품격 있는 무대'],
      ['정동원', '밝은 트로트 팝, 청량한 보컬, 젊고 산뜻한 분위기'],
      ['안성훈', '탄탄한 정통 트로트, 안정적인 고음, 감동적인 클라이맥스'],
      ['전유진', '맑고 애절한 여성 트로트, 서정적인 멜로디, 깨끗한 고음'],
      ['마이진', '파워풀한 여성 트로트, 당찬 에너지, 무대형 편곡'],
      ['배아현', '정통 트로트, 섬세한 꺾기, 단아하고 깊은 감성'],
    ],
  },
  {
    title: '🎵 노래 제목 느낌',
    items: [
      ['아모르파티', '댄스 트로트, 라틴 리듬, 인생을 즐기자는 긍정적인 분위기'],
      ['어머나', '발랄한 세미 트로트, 귀여운 고백, 쉬운 반복 후렴'],
      ['안동역에서', '애절한 정통 트로트, 기다림과 그리움, 느린 템포'],
      ['곤드레 만드레', '빠른 댄스 트로트, 흥겨운 술자리 분위기, 강한 후렴'],
      ['막걸리 한잔', '서민적인 감성 트로트, 아버지와 인생 이야기, 따뜻한 여운'],
      ['찐이야', '현대적 세미 트로트, 재치 있는 표현, 신나는 리듬'],
    ],
  },
];

const moods = ['따뜻하게', '신나게', '애절하게', '고급스럽게', '유쾌하게', '잔잔하게', '희망차게', '눈물 나게'];
const voices = ['남성 보컬', '여성 보컬', '듀엣', '중저음 보컬', '맑은 고음', '합창 느낌'];
const lengths = ['2분 내외', '3분 내외', '짧은 후렴 반복', '인트로 짧게', '마지막 후렴 크게'];

function ToggleButton({ label, active, onClick, tone = 'chip' }) {
  return h('button', { type: 'button', className: `${tone}${active ? ' active' : ''}`, onClick }, label);
}

function App() {
  const [selectedStories, setSelectedStories] = useState(['여름', '밤바다', '첫사랑']);
  const [stylePrompt, setStylePrompt] = useState('감성 트로트 발라드, 따뜻한 남성 보컬, 큰 스케일의 편곡');
  const [customStory, setCustomStory] = useState('');
  const [songTitle, setSongTitle] = useState('그 여름 밤바다');
  const [selectedMood, setSelectedMood] = useState('따뜻하게');
  const [selectedVoice, setSelectedVoice] = useState('남성 보컬');
  const [selectedLength, setSelectedLength] = useState('3분 내외');
  const [copyMessage, setCopyMessage] = useState('');

  const toggleStory = (item) => {
    setSelectedStories((current) => (current.includes(item) ? current.filter((value) => value !== item) : [...current, item]));
  };

  const addCustomStory = () => {
    const value = customStory.trim();
    if (!value || selectedStories.includes(value)) return;
    setSelectedStories((current) => [...current, value]);
    setCustomStory('');
  };

  const finalPrompt = useMemo(() => {
    const story = selectedStories.length ? selectedStories.join(', ') : '따뜻한 인생 이야기';
    return [
      `[곡 제목] ${songTitle || '제목 미정'}`,
      `[장르/스타일] ${stylePrompt}`,
      `[가사에 담을 이야기] ${story}`,
      `[분위기] ${selectedMood}`,
      `[보컬] ${selectedVoice}`,
      `[길이와 구성] ${selectedLength}, 1절-후렴-2절-후렴-브릿지-마지막 후렴`,
      '[요청] 시니어도 따라 부르기 쉬운 한국어 가사로, 후렴은 기억하기 쉽게 반복해줘. 직접적인 가수 이름이나 기존 노래 가사는 사용하지 말고 참고 분위기만 살려줘.',
    ].join('\n');
  }, [selectedStories, songTitle, stylePrompt, selectedMood, selectedVoice, selectedLength]);

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(finalPrompt);
    setCopyMessage('프롬프트를 복사했어요. 이제 수노AI로 이동해 붙여넣기 하세요.');
  };

  return h('main', { className: 'app-shell' },
    h('section', { className: 'hero-card' },
      h('p', { className: 'eyebrow' }, 'Senior Suno AI Prompt Maker'),
      h('h1', null, '수노AI 노래 프롬프트 메이커'),
      h('p', { className: 'hero-copy' }, '키워드를 누르기만 해도 가사 이야기와 장르 설명이 완성됩니다. AI 기능 없이도 시니어 교육생이 쉽게 사용할 수 있도록 큰 버튼과 읽기 쉬운 화면으로 만들었습니다.'),
    ),
    h('section', { className: 'panel sticky-preview' },
      h('label', { className: 'field-label' }, '노래 제목', h('input', { className: 'title-input', value: songTitle, onChange: (event) => setSongTitle(event.target.value), placeholder: '예: 내 인생 꽃길' })),
      h('h2', null, '완성될 프롬프트'),
      h('pre', { className: 'prompt-box' }, finalPrompt),
      h('div', { className: 'action-row' },
        h('button', { className: 'primary', onClick: copyPrompt }, '프롬프트 복사'),
        h('a', { className: 'suno-link', href: sunoUrl, target: '_blank', rel: 'noreferrer' }, '수노AI로 이동하기'),
      ),
      copyMessage && h('p', { className: 'copy-message' }, copyMessage),
    ),
    h('section', { className: 'panel' },
      h('div', { className: 'section-heading' }, h('p', { className: 'eyebrow' }, 'Step 1'), h('h2', null, '노래에 담고 싶은 이야기 선택')),
      storyGroups.map((group) => h('div', { className: 'choice-group', key: group.title },
        h('h3', null, group.title), h('p', null, group.description),
        h('div', { className: 'chip-grid' }, group.items.map((item) => h(ToggleButton, { key: item, label: item, active: selectedStories.includes(item), onClick: () => toggleStory(item) }))),
      )),
      h('div', { className: 'custom-row' },
        h('input', { value: customStory, onChange: (event) => setCustomStory(event.target.value), onKeyDown: (event) => event.key === 'Enter' && addCustomStory(), placeholder: '직접 작성하기: 예) 손주의 졸업식' }),
        h('button', { onClick: addCustomStory }, '추가'),
      ),
    ),
    h('section', { className: 'panel' },
      h('div', { className: 'section-heading' }, h('p', { className: 'eyebrow' }, 'Step 2'), h('h2', null, '가수·노래 느낌으로 장르 선택')),
      h('p', { className: 'notice' }, '저작권 보호를 위해 실제 가수 이름을 최종 프롬프트에 넣지 않고, 선택한 버튼을 장르와 분위기 설명으로 바꿉니다.'),
      artistGroups.map((group) => h('div', { className: 'choice-group', key: group.title },
        h('h3', null, group.title),
        h('div', { className: 'artist-grid' }, group.items.map(([name, prompt]) => h('button', { key: name, className: stylePrompt === prompt ? 'artist active' : 'artist', onClick: () => setStylePrompt(prompt) }, h('strong', null, name), h('span', null, prompt)))),
      )),
    ),
    h('section', { className: 'panel' },
      h('div', { className: 'section-heading' }, h('p', { className: 'eyebrow' }, 'Step 3'), h('h2', null, '분위기·보컬·길이 마무리')),
      h('h3', null, '분위기'), h('div', { className: 'chip-grid' }, moods.map((item) => h(ToggleButton, { key: item, label: item, active: selectedMood === item, onClick: () => setSelectedMood(item) }))),
      h('h3', null, '보컬'), h('div', { className: 'chip-grid' }, voices.map((item) => h(ToggleButton, { key: item, label: item, active: selectedVoice === item, onClick: () => setSelectedVoice(item) }))),
      h('h3', null, '길이와 구성'), h('div', { className: 'chip-grid' }, lengths.map((item) => h(ToggleButton, { key: item, label: item, active: selectedLength === item, onClick: () => setSelectedLength(item) }))),
    ),
  );
}

export default App;
