// 独立研究1：事件委托重构
// 改造点：删除按钮不再各自绑定监听器，整个ul只绑1个监听器，靠事件冒泡处理
const form = document.querySelector('#add-form');
const titleInput = document.querySelector('#title-input');
const directorInput = document.querySelector('#director-input');
const ratingInput = document.querySelector('#rating-input');
const tip = document.querySelector('#tip');
const searchInput = document.querySelector('#search-input');
const list = document.querySelector('#movie-list');

let movies = JSON.parse(localStorage.getItem('movies-r1') || '[]');
const save = () => localStorage.setItem('movies-r1', JSON.stringify(movies));

let keyword = '';
let lastShown = []; // 记住本次实际渲染了哪些电影，供委托删除时按引用定位

const render = () => {
  list.innerHTML = '';
  const shown = movies.filter(m => m.title.includes(keyword));
  lastShown = shown;

  if (shown.length === 0) {
    const li = document.createElement('li');
    li.textContent = '没有符合条件的电影';
    list.appendChild(li);
    return;
  }
  shown.forEach((movie, index) => {
    const li = document.createElement('li');
    li.dataset.index = index; // 委托监听器靠它找到被点的是哪一条

    const info = document.createElement('span');
    info.textContent = movie.title + '（导演：' + movie.director + '）';

    const score = document.createElement('span');
    score.className = 'score';
    score.textContent = movie.rating + '分';

    const del = document.createElement('span');
    del.className = 'del';
    del.textContent = '删除';
    // 研究1改造点：不再给每个删除按钮单独addEventListener

    li.appendChild(info);
    li.appendChild(score);
    li.appendChild(del);
    list.appendChild(li);
  });
};

// 事件委托：整个列表只绑1个监听器
list.addEventListener('click', (e) => {
  if (!e.target.classList.contains('del')) return; // 点的不是删除就忽略
  const index = Number(e.target.closest('li').dataset.index);
  const movie = lastShown[index];                 // 按引用定位，搜索过滤时也不会删错
  movies = movies.filter(m => m !== movie);       // 先改数组
  save();
  render();
});

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
