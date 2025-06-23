const apiKey = "f6a4cf249e6e4afbaf26a7b3b7b9e965";
const newsContainer = document.getElementById("news-container");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".category-btn");

let currentArticles = [];
let fetchTimeout;

async function fetchNews(category = "") {
  newsContainer.innerHTML = `<div class="loading">📰 Fetching latest news...</div>`;
  let url = `https://newsapi.org/v2/top-headlines?language=en&pageSize=20&apiKey=${apiKey}`;
  if (category) {
    url += `&category=${category.toLowerCase()}`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    currentArticles = data.articles;
    renderArticles(currentArticles);
  } catch (err) {
    newsContainer.innerHTML = `<div class="loading error">❌ Failed to load news. Please check your internet or try again later.</div>`;
    console.error("Error:", err);
  }
}

function renderArticles(articles) {
  newsContainer.innerHTML = "";
  if (articles.length === 0) {
    newsContainer.innerHTML = `<div class="loading">😕 No news found.</div>`;
    return;
  }

  articles.forEach(article => {
    const card = document.createElement("div");
    card.className = "news-card";
    card.innerHTML = `
      <img src="${article.urlToImage || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="News Image">
      <h3>${article.title}</h3>
      <p>${article.description || "No description available."}</p>
      <a href="${article.url}" target="_blank">Read more</a>
    `;
    newsContainer.appendChild(card);
  });
}

// Debounced Search
searchInput.addEventListener("input", () => {
  clearTimeout(fetchTimeout);
  fetchTimeout = setTimeout(() => {
    const query = searchInput.value.toLowerCase();
    const filtered = currentArticles.filter(article =>
      article.title.toLowerCase().includes(query) ||
      (article.description && article.description.toLowerCase().includes(query))
    );
    renderArticles(filtered);
  }, 300);
});

// Category Button Click
categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    const category = button.textContent.trim().split(" ")[1]; // Extracts "World" from "🌐 World"
    fetchNews(category);
  });
});

// Live Clock
function showDateTime() {
  const now = new Date();
  document.getElementById("datetime").textContent = now.toLocaleString();
}
setInterval(showDateTime, 1000);

// Auto-refresh every 5 minutes
setInterval(() => {
  fetchNews();
}, 5 * 60 * 1000);

fetchNews();
