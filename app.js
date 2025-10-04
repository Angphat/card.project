/* app.js (ES5-safe version) */
var cards = [
  { id: 101, title: 'ตัวอย่าง 1', body: 'การ์ดตัวอย่าง', image: 'https://picsum.photos/seed/101/600/400', likes: 0 },
  { id: 102, title: 'ตัวอย่าง 2', body: 'อีกตัวอย่าง', image: 'https://picsum.photos/seed/102/600/400', likes: 0 }
];

var grid = document.getElementById('grid');
var addBtn = document.getElementById('addBtn');
var fetchBtn = document.getElementById('fetchBtn');
var clearBtn = document.getElementById('clearBtn');
var titleInput = document.getElementById('titleInput');
var imageInput = document.getElementById('imageInput');
var stats = document.getElementById('stats');

function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, function(s) {
    var map = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"};
    return map[s];
  });
}

function render() {
  var html = cards.map(function(card) {
    return '<div class="card" data-id="' + card.id + '">' +
      '<img src="' + card.image + '" alt="' + escapeHTML(card.title) + '" />' +
      '<div class="body">' +
        '<h3>' + escapeHTML(card.title) + '</h3>' +
        '<p>' + escapeHTML(card.body || '') + '</p>' +
        '<div class="actions">' +
          '<div>' +
            '<button class="btn-sm likeBtn">👍 <span>' + card.likes + '</span></button>' +
            '<button class="btn-sm deleteBtn">🗑️</button>' +
          '</div>' +
          '<div class="small">#' + card.id + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
  grid.innerHTML = html;
  attachListeners();
  updateStats();
}

function attachListeners() {
  var likeBtns = grid.querySelectorAll('.likeBtn');
  Array.prototype.forEach.call(likeBtns, function(btn) {
    btn.onclick = function() {
      var id = Number(btn.closest('.card').dataset.id);
      cards = cards.map(function(c) {
        if (c.id === id) {
          // สร้าง object ใหม่ (immutable-style)
          return { id: c.id, title: c.title, body: c.body, image: c.image, likes: c.likes + 1 };
        }
        return c;
      });
      render();
    };
  });

  var delBtns = grid.querySelectorAll('.deleteBtn');
  Array.prototype.forEach.call(delBtns, function(btn) {
    btn.onclick = function() {
      var id = Number(btn.closest('.card').dataset.id);
      cards = cards.filter(function(c) { return c.id !== id; });
      render();
    };
  });
}

function updateStats() {
  var totalLikes = cards.reduce(function(sum, c) { return sum + c.likes; }, 0);
  stats.textContent = 'การ์ดทั้งหมด: ' + cards.length + ' — ยอดไลก์รวม: ' + totalLikes;
}

addBtn.addEventListener('click', function() {
  var title = (titleInput.value || '').trim() || 'การ์ดใหม่';
  var image = (imageInput.value || '').trim() || ('https://picsum.photos/seed/' + Date.now() + '/600/400');
  var id = Date.now();
  var newCard = { id: id, title: title, body: 'เพิ่มโดยผู้ใช้', image: image, likes: 0 };
  cards = cards.concat([newCard]);
  titleInput.value = '';
  imageInput.value = '';
  render();
});

fetchBtn.addEventListener('click', function() {
  fetchBtn.disabled = true;
  fetchBtn.textContent = 'กำลังดึงข้อมูล...';
  fetch('https://jsonplaceholder.typicode.com/photos?_limit=3').then(function(res) {
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }).then(function(data) {
    var newCards = data.map(function(d) {
      return {
        id: Date.now() + Math.floor(Math.random() * 10000),
        title: d.title,
        body: 'ดึงมาจาก Fetch API',
        image: d.thumbnailUrl || d.url,
        likes: 0
      };
    });
    cards = cards.concat(newCards);
    render();
  }).catch(function(err) {
    alert('เกิดข้อผิดพลาด: ' + err.message);
  }).finally(function() {
    fetchBtn.disabled = false;
    fetchBtn.textContent = 'Fetch 3 การ์ด (Fetch API)';
  });
});

clearBtn.addEventListener('click', function() {
  if (!confirm('ลบบัตรทั้งหมดจริงหรือไม่?')) return;
  cards = [];
  render();
});

render();
