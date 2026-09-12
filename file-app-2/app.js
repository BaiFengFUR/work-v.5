// 独立研究2：数据导出（Blob + URL.createObjectURL）
// 改造点：新增"导出JSON"按钮，点击把当前数组下载成 movies.json 文件
const form = document.querySelector('#add-form');
const titleInput = document.querySelector('#title-input');
const directorInput = document.querySelector('#director-input');
const ratingInput = document.querySelector('#rating-input');
const tip = document.querySelector('#tip');
const searchInput = document.querySelector('#search-input');
const exportBtn = document.querySelector('#export-btn');
const list = document.querySelector('#movie-list');

let movies = JSON.parse(localStorage.getItem('movies-r2') || '[]');
const save = () => localStorage.setItem('movies-r2', JSON.stringify(movies));

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

// 研究2：导出JSON
// 1.JSON.stringify转字符串 -> 2.Blob造文件 -> 3.createObjectURL给临时地址
// 4.a标签程序触发下载 -> 5.revokeObjectURL释放内存
exportBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(movies, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'movies.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

render();
