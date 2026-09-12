// 独立研究3：存储容错
// 改造点：读取存档和写入存档都用 try...catch 包住
// 存档损坏(JSON.parse抛错)时回退空数组不白屏；写入超量(QuotaExceededError)时页面友好提示
const form = document.querySelector('#add-form');
const titleInput = document.querySelector('#title-input');
const directorInput = document.querySelector('#director-input');
const ratingInput = document.querySelector('#rating-input');
const tip = document.querySelector('#tip');
const searchInput = document.querySelector('#search-input');
const list = document.querySelector('#movie-list');

// 读取容错：存档内容损坏导致JSON.parse抛错时，回退为空数组
let movies = [];
try {
  movies = JSON.parse(localStorage.getItem('movies-r3') || '[]');
} catch (err) {
  movies = [];
}

// 写入容错：超过localStorage约5MB上限或隐私模式禁止写入时，setItem会抛错
const save = () => {
  try {
    localStorage.setItem('movies-r3', JSON.stringify(movies));
  } catch (err) {
    tip.textContent = '保存失败：本地存储空间可能已满，请删除部分电影后再试';
  }
};

let keyword = '';

const render = () => {
  list.innerHTML = '';
  const shown = movies.filter(m => m.title.includes(keyword));

  if (shown.length === 0) {
    const li = document.createElement('li');
    li.textContent = '没有符合条件的电影';
    list.appendChild(li);
    return;
  }
  shown.forEach(movie => {
    const li = document.createElement('li');

    const info = document.createElement('span');
    info.textContent = movie.title + '（导演：' + movie.director + '）';

    const score = document.createElement('span');
    score.className = 'score';
    score.textContent = movie.rating + '分';

    const del = document.createElement('span');
    del.className = 'del';
    del.textContent = '删除';
    del.addEventListener('click', () => {
      movies = movies.filter(m => m !== movie);
      save();
      render();
    });

    li.appendChild(info);
    li.appendChild(score);
    li.appendChild(del);
    list.appendChild(li);
  });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const director = directorInput.value.trim();
  const rating = Number(ratingInput.value.trim());

  if (title === '') {
    tip.textContent = '片名不能为空';
    return;
  }
  if (director === '') {
    tip.textContent = '导演不能为空';
    return;
  }
  if (!(rating >= 1 && rating <= 10)) {
    tip.textContent = '评分必须是1-10之间的数字';
    return;
  }

  movies.push({ title: title, director: director, rating: rating });
  save();
  tip.textContent = '';
  titleInput.value = '';
  directorInput.value = '';
  ratingInput.value = '';
  render();
});

searchInput.addEventListener('input', (e) => {
  keyword = e.target.value.trim();
  render();
});

render();
