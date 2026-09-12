// 看电影清单 - 第三次提交：localStorage本地保存（最终版）
const form = document.querySelector('#add-form');
const titleInput = document.querySelector('#title-input');
const directorInput = document.querySelector('#director-input');
const ratingInput = document.querySelector('#rating-input');
const tip = document.querySelector('#tip');
const searchInput = document.querySelector('#search-input');
const list = document.querySelector('#movie-list');

// 页面加载时恢复存档；|| '[]' 保证首次访问没有存档时得到空数组而不是null报错
let movies = JSON.parse(localStorage.getItem('movies') || '[]');
const save = () => localStorage.setItem('movies', JSON.stringify(movies));

let keyword = ''; // 查询关键字

const render = () => {
  list.innerHTML = '';
  // 查询：只渲染片名包含关键字的电影
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
      movies = movies.filter(m => m !== movie); // 先改数组
      save();                                  // 保存删除后的数组
      render();                                // 再重新渲染
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
  save(); // 保存添加后的数组
  tip.textContent = '';
  titleInput.value = '';
  directorInput.value = '';
  ratingInput.value = '';
  render();
});

// 输入即时查询
searchInput.addEventListener('input', (e) => {
  keyword = e.target.value.trim();
  render();
});

render();
