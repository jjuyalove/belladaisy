import React, { useMemo, useRef, useState } from 'react';

const h = React.createElement;
const maxPhotos = 9;

const sizes = {
  square: { label: '정사각형 1080×1080', width: 1080, height: 1080, ratio: '1 / 1' },
  portrait: { label: '세로 900×1280', width: 900, height: 1280, ratio: '900 / 1280' },
  landscape: { label: '가로 1280×900', width: 1280, height: 900, ratio: '1280 / 900' },
};

const frames = [
  { id: 'one-simple', count: 1, name: '큰 사진 1칸', css: 'f-one' },
  { id: 'two-diagonal', count: 2, name: '사선 2분할', css: 'f-two-diagonal' },
  { id: 'two-wave', count: 2, name: '물결 2분할', css: 'f-two-wave' },
  { id: 'two-s', count: 2, name: 'S 곡선 2분할', css: 'f-two-s' },
  { id: 'three-big-top-mix', count: 3, name: '큰 위칸 + 대각선', css: 'f-three-mix' },
  { id: 'three-slant', count: 3, name: '기울어진 3칸', css: 'f-three-slant' },
  { id: 'three-circle', count: 3, name: '가운데 원형', css: 'f-three-circle' },
  { id: 'three-rows', count: 3, name: '가로 3단', css: 'f-three-rows' },
  { id: 'three-top-two', count: 3, name: '넓은 위칸', css: 'f-three-top-two' },
  { id: 'three-stripes', count: 3, name: '평행 사선', css: 'f-three-stripes' },
  { id: 'three-organic', count: 3, name: '부드러운 곡선', css: 'f-three-organic' },
  { id: 'four-mosaic', count: 4, name: '모자이크 4칸', css: 'f-four-mosaic' },
  { id: 'four-asym', count: 4, name: '비대칭 4분할', css: 'f-four-asym' },
  { id: 'four-bands', count: 4, name: '가운데 2칸', css: 'f-four-bands' },
  { id: 'four-top-three', count: 4, name: '위 1칸 아래 3칸', css: 'f-four-top-three' },
  { id: 'four-circle', count: 4, name: '큰 원형', css: 'f-four-circle' },
  { id: 'four-cross', count: 4, name: '비대칭 십자', css: 'f-four-cross' },
  { id: 'five-heart', count: 5, name: '가운데 하트', css: 'f-five-heart' },
  { id: 'five-side', count: 5, name: '좌우 모자이크', css: 'f-five-side' },
  { id: 'five-mosaic', count: 5, name: '작은칸 모자이크', css: 'f-five-mosaic' },
  { id: 'five-irregular', count: 5, name: '불규칙 5칸', css: 'f-five-irregular' },
  { id: 'heart-eight', count: 8, name: '하트 8칸', css: 'f-heart-eight' },
  { id: 'rect-five', count: 5, name: '직사각 모자이크', css: 'f-rect-five' },
  { id: 'clover-four', count: 4, name: '네잎클로버', css: 'f-clover-four' },
  { id: 'six-simple', count: 6, name: '단순 6칸', css: 'f-six-simple' },
  { id: 'seven-simple', count: 7, name: '큰칸 포함 7칸', css: 'f-seven-simple' },
  { id: 'nine-simple', count: 9, name: '단순 9칸', css: 'f-nine-simple' },
];


function createPhoto(file) {
  return { id: crypto.randomUUID(), file, url: URL.createObjectURL(file), scale: 1, x: 0, y: 0 };
}

function App() {
  const [photos, setPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState('사진');
  const [selectedFrameId, setSelectedFrameId] = useState('two-diagonal');
  const [message, setMessage] = useState('사진을 추가하면 자동으로 콜라주가 만들어져요.');
  const [background, setBackground] = useState('#fff8ed');
  const [gap, setGap] = useState(10);
  const [radius, setRadius] = useState(22);
  const [sizeKey, setSizeKey] = useState('square');
  const [text, setText] = useState('추억 콜라주');
  const [font, setFont] = useState('system-ui');
  const [textColor, setTextColor] = useState('#5b392f');
  const fileInputRef = useRef(null);
  const replaceIndexRef = useRef(null);
  const dragRef = useRef(null);

  const photoCount = photos.length || 2;
  const currentFrames = useMemo(() => frames.filter((frame) => frame.count === photoCount), [photoCount]);
  const selectedFrame = frames.find((frame) => frame.id === selectedFrameId && frame.count === photoCount) || currentFrames[0] || frames[0];
  const selectedSize = sizes[sizeKey];


  const handleFiles = (event) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith('image/'));
    event.target.value = '';
    if (!files.length) return;

    const replaceIndex = replaceIndexRef.current;
    replaceIndexRef.current = null;

    if (replaceIndex !== null) {
      const [file] = files;
      setPhotos((current) => current.map((photo, index) => index === replaceIndex ? createPhoto(file) : photo));
      setMessage('사진을 새 사진으로 바꿨어요.');
      return;
    }

    setPhotos((current) => {
      const room = maxPhotos - current.length;
      const picked = files.slice(0, room).map(createPhoto);
      if (files.length > room) setMessage('최대 9장까지만 선택할 수 있어요. 9장만 넣었어요.');
      else setMessage(`${current.length + picked.length}장의 사진을 넣었어요.`);
      return [...current, ...picked];
    });
  };

  const changePhoto = (index, changes) => setPhotos((current) => current.map((photo, photoIndex) => photoIndex === index ? { ...photo, ...changes } : photo));
  const replacePhoto = (index) => { replaceIndexRef.current = index; fileInputRef.current?.click(); };

  const startDrag = (event, index) => {
    event.preventDefault();
    const photo = photos[index];
    if (!photo) return;
    dragRef.current = { index, startX: event.clientX, startY: event.clientY, x: photo.x, y: photo.y };
    window.addEventListener('pointermove', onDrag);
    window.addEventListener('pointerup', stopDrag, { once: true });
  };

  const onDrag = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    changePhoto(drag.index, { x: drag.x + event.clientX - drag.startX, y: drag.y + event.clientY - drag.startY });
  };

  const stopDrag = () => {
    dragRef.current = null;
    window.removeEventListener('pointermove', onDrag);
  };

  const exportPng = async () => {
    const node = document.querySelector('.collage-stage');
    const rect = node.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    canvas.width = selectedSize.width;
    canvas.height = selectedSize.height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cells = Array.from(document.querySelectorAll('.collage-cell'));
    for (const [index, cell] of cells.entries()) {
      const photo = photos[index];
      const r = cell.getBoundingClientRect();
      const x = (r.left - rect.left) * scaleX;
      const y = (r.top - rect.top) * scaleY;
      const w = r.width * scaleX;
      const hgt = r.height * scaleY;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, w, hgt, radius * scaleX);
      ctx.clip();
      if (photo) {
        const img = new Image();
        img.src = photo.url;
        await img.decode();
        const cover = Math.max(w / img.width, hgt / img.height) * photo.scale;
        const iw = img.width * cover;
        const ih = img.height * cover;
        ctx.drawImage(img, x + (w - iw) / 2 + photo.x * scaleX, y + (hgt - ih) / 2 + photo.y * scaleY, iw, ih);
      } else {
        ctx.fillStyle = '#eee8dc';
        ctx.fillRect(x, y, w, hgt);
      }
      ctx.restore();
    }
    ctx.fillStyle = textColor;
    ctx.font = `${Math.round(canvas.width * 0.055)}px ${font}`;
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height - canvas.height * 0.06);
    const anchor = document.createElement('a');
    anchor.download = '추억-콜라주.png';
    anchor.href = canvas.toDataURL('image/png');
    anchor.click();
  };

  const renderCells = (preview = false) => Array.from({ length: selectedFrame.count }, (_, index) => {
    const photo = photos[index];
    return h('button', {
      key: index,
      className: `collage-cell cell-${index + 1}`,
      type: 'button',
      onClick: preview || !photo ? undefined : () => replacePhoto(index),
      onPointerDown: preview || !photo ? undefined : (event) => startDrag(event, index),
      title: photo ? '사진을 누르면 교체하고 드래그하면 위치를 바꿔요.' : '빈 사진칸',
    }, photo && !preview ? h('img', { src: photo.url, alt: `선택한 사진 ${index + 1}`, style: { transform: `translate(${photo.x}px, ${photo.y}px) scale(${photo.scale})` } }) : h('span', null, index + 1));
  });

  const tabContent = {
    사진: h('section', { className: 'panel' },
      h('h2', null, '사진 넣기'),
      h('button', { className: 'big-action', onClick: () => fileInputRef.current?.click() }, '사진 추가'),
      h('p', null, '1장부터 9장까지 선택할 수 있어요. 사진을 드래그하면 보이는 위치를 바꿀 수 있어요.'),
      photos.map((photo, index) => h('label', { className: 'range-row', key: photo.id },
        `사진 ${index + 1} 확대`,
        h('input', { type: 'range', min: 0.7, max: 2.5, step: 0.05, value: photo.scale, onChange: (event) => changePhoto(index, { scale: Number(event.target.value) }) }),
      )),
    ),
    프레임: h('section', { className: 'panel' },
      h('h2', null, `${photoCount}장용 프레임 선택`),
      h('div', { className: 'frame-grid' }, currentFrames.map((frame) => h('button', { key: frame.id, className: frame.id === selectedFrame.id ? 'frame-thumb selected' : 'frame-thumb', onClick: () => setSelectedFrameId(frame.id) },
        h('div', { className: `thumb-stage ${frame.css}` }, Array.from({ length: frame.count }, (_, index) => h('span', { key: index, className: `cell-${index + 1}` }))),
        h('strong', null, frame.name),
      ))),
    ),
    꾸미기: h('section', { className: 'panel' },
      h('h2', null, '꾸미기'),
      h('label', { className: 'range-row' }, '배경색', h('input', { type: 'color', value: background, onChange: (event) => setBackground(event.target.value) })),
      h('label', { className: 'range-row' }, `사진 사이 여백 ${gap}px`, h('input', { type: 'range', min: 0, max: 28, value: gap, onChange: (event) => setGap(Number(event.target.value)) })),
      h('label', { className: 'range-row' }, `모서리 둥글기 ${radius}px`, h('input', { type: 'range', min: 0, max: 60, value: radius, onChange: (event) => setRadius(Number(event.target.value)) })),
      h('input', { className: 'text-input', value: text, onChange: (event) => setText(event.target.value), placeholder: '넣고 싶은 글자' }),
      h('select', { className: 'text-input', value: font, onChange: (event) => setFont(event.target.value) }, h('option', { value: 'system-ui' }, '기본 글씨'), h('option', { value: 'serif' }, '명조 느낌'), h('option', { value: 'cursive' }, '손글씨 느낌')),
      h('input', { type: 'color', value: textColor, onChange: (event) => setTextColor(event.target.value) }),
    ),
    저장: h('section', { className: 'panel' },
      h('h2', null, '사진으로 저장'),
      h('select', { className: 'text-input', value: sizeKey, onChange: (event) => setSizeKey(event.target.value) }, Object.entries(sizes).map(([key, size]) => h('option', { key, value: key }, size.label))),
      h('button', { className: 'big-action', onClick: exportPng }, '사진으로 저장'),
    ),
  };

  return h('main', { className: 'memory-app' },
    h('input', { ref: fileInputRef, className: 'sr-only', type: 'file', accept: 'image/*', multiple: true, onChange: handleFiles }),
    h('header', { className: 'top-title' }, h('p', null, '휴대폰에서 쉽게 만드는'), h('h1', null, '추억 콜라주')),
    h('section', { className: 'canvas-card' },
      h('div', { className: `collage-stage ${selectedFrame.css}`, style: { background, gap: `${gap}px`, borderRadius: `${radius}px`, aspectRatio: selectedSize.ratio } }, renderCells(), text && h('div', { className: 'collage-text', style: { color: textColor, fontFamily: font } }, text)),
      h('p', { className: 'helper' }, message),
    ),
    tabContent[activeTab],
    h('nav', { className: 'bottom-nav' }, ['사진', '프레임', '꾸미기', '저장'].map((tab) => h('button', { key: tab, className: activeTab === tab ? 'active' : '', onClick: () => setActiveTab(tab) }, tab))),
  );
}

export default App;
