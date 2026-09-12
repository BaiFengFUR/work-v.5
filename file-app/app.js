// 看电影清单 - 第一次提交：添加功能与统一渲染
// 一条电影记录的结构：{ title: '片名', director: '导演', rating: 9 }
const form = document.querySelector('#add-form');
const titleInput = document.querySelector('#title-input');
const directorInput = document.querySelector('#director-input');
const ratingInput = document.querySelector('#rating-input');
const tip = document.querySelector('#tip');
const list = document.querySelector('#movie-list');

let movies = [];

const render = () => {
  list.innerHTML = '';
  if (movies.length === 0) {
    const li = document.createElement('li');
    li.textContent = '暂无电影';
    list.appendChild(li);
    return;
  }
  movies.forEach(movie => {
    const li = document.createElement('li');

    const info = document.createElement('span');
    info.textContent = movie.title + '（导演：' + movie.director + '）';

    const score = document.createElement('span');
    score.className = 'score';
    score.textContent = movie.rating + '分';

    li.appendChild(info);
    li.appendChild(score);
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
  tip.textContent = '';
  titleInput.value = '';
  directorInput.value = '';
  ratingInput.value = '';
  render();
});

render();
