console.log("Renderer process started");

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;

  // Icons
  const moonIcon =
    '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
  const sunIcon =
    '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const currentTheme = savedTheme || (prefersDark ? "dark" : "light");
  setTheme(currentTheme);

  themeToggle.addEventListener("click", () => {
    const isDark = htmlElement.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
  });

  function setTheme(theme) {
    htmlElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    // Update icon
    const svgElement = themeToggle.querySelector("svg");
    svgElement.innerHTML = theme === "dark" ? moonIcon : sunIcon;
  }

  // Navigation Logic
  const navItems = document.querySelectorAll(".nav-item");
  const viewSections = document.querySelectorAll(".view-section");

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const targetId = item.getAttribute("data-target");
      if (targetId) {
        switchView(targetId);
      }
    });
  });

  function switchView(targetId) {
    // Update Nav Items
    navItems.forEach((item) => {
      if (item.getAttribute("data-target") === targetId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Update View Sections
    viewSections.forEach((section) => {
      if (section.id === targetId) {
        section.classList.add("active");
        if (targetId === "sources") {
          loadProviders();
        }
      } else {
        section.classList.remove("active");
      }
    });
  }

  async function loadProviders() {
    const sourcesContainer = document.getElementById("sources");
    sourcesContainer.innerHTML = "<h3>Loading...</h3>";

    try {
      const providers = await window.yukimi.getProviders();
      sourcesContainer.innerHTML = ""; // Clear loading message

      if (!providers || providers.length === 0) {
        sourcesContainer.innerHTML = "<p>No providers found.</p>";
        return;
      }

      // Create a specific container for the list to control layout
      const listContainer = document.createElement("div");
      listContainer.className = "provider-list";
      sourcesContainer.appendChild(listContainer);

      providers.forEach((provider) => {
        const providerBtn = document.createElement("button");
        providerBtn.className = "provider-button";
        providerBtn.textContent = provider.name.toUpperCase();

        providerBtn.addEventListener("click", () => {
          showSearchArea(provider.name, listContainer);
        });

        listContainer.appendChild(providerBtn);
      });
    } catch (error) {
      console.error("Failed to load providers:", error);
      sourcesContainer.innerHTML = `
        <div class="error-container" style="text-align: center; padding: 20px;">
          <p class="error">Failed to load providers: ${error.message}</p>
          <button id="retry-providers" class="primary-button" style="margin-top: 10px;">Retry</button>
        </div>
      `;
      document
        .getElementById("retry-providers")
        .addEventListener("click", loadProviders);
    }
  }

  function showSearchArea(providerName, listContainer) {
    const sourcesContainer = document.getElementById("sources");

    sourcesContainer.innerHTML = "";

    const searchArea = document.createElement("div");
    searchArea.className = "search-area";
    searchArea.innerHTML = `
      <button class="back-button">← Back to Providers</button>
      <h3>Search ${providerName}</h3>
      <div class="input-group">
        <input type="text" placeholder="Enter a title... Example: Solo Leveling" id="provider-search-input">
        <button class="primary-button">Search</button>
      </div>
      <div class="search-results"></div>
      <div class="loading-indicator" style="display: none; text-align: center; color: var(--text-color); padding: 20px;">Loading more...</div>
    `;

    sourcesContainer.appendChild(searchArea);

    const searchInput = document.getElementById("provider-search-input");
    const searchBtn = searchArea.querySelector(".primary-button");
    const resultsContainer = searchArea.querySelector(".search-results");
    const loadingIndicator = searchArea.querySelector(".loading-indicator");

    let offset = 0;
    let isLoading = false;
    let currentQuery = "";
    let hasMore = true;
    let observer;

    const fetchResults = async (isNewSearch = false) => {
      if (isLoading) return;
      if (!isNewSearch && !hasMore) return;

      isLoading = true;
      if (isNewSearch) {
        resultsContainer.innerHTML = "<h4>Searching...</h4>";
        loadingIndicator.style.display = "none";
        offset = 0;
        hasMore = true;
      } else {
        loadingIndicator.style.display = "block";
      }

      try {
        const result = await window.yukimi.searchInProvider(
          providerName,
          currentQuery,
          offset
        );

        if (isNewSearch) resultsContainer.innerHTML = "";

        if (result.success) {
          const items = result.content;
          if (items.length > 0) {
            renderSearchResults(items, resultsContainer);
            offset += 20;
            if (items.length < 20) hasMore = false;
          } else {
            if (isNewSearch)
              resultsContainer.innerHTML = "<p>No results found.</p>";
            hasMore = false;
          }
        } else {
          if (isNewSearch)
            resultsContainer.innerHTML = `<p class="error">Error: ${result.message}</p>`;
        }
      } catch (err) {
        console.error("Search error:", err);
        const errorMessage = err.message || "Unknown error occurred";

        if (isNewSearch) {
          if (errorMessage.includes("Provider not found")) {
            resultsContainer.innerHTML = `<div class="error-message">
              <p>Error: The provider '<strong>${providerName}</strong>' is not available.</p>
              <button onclick="location.reload()" class="retry-button">Reload App</button>
            </div>`;
          } else {
            resultsContainer.innerHTML = `<p class="error">Search failed: ${errorMessage}</p>`;
          }
        } else {
          hasMore = false;
          loadingIndicator.innerHTML = `<span style="color: coral;">Failed to load more results.</span>`;
        }
      } finally {
        isLoading = false;
        if (
          loadingIndicator &&
          loadingIndicator.innerHTML !==
            '<span style="color: coral;">Failed to load more results.</span>'
        ) {
          loadingIndicator.style.display = "none";
        }
      }
    };

    const handleSearch = () => {
      const query = searchInput.value;
      if (!query.trim()) return;
      currentQuery = query;
      fetchResults(true);
    };

    searchBtn.addEventListener("click", handleSearch);
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSearch();
    });

    // Back button logic
    searchArea.querySelector(".back-button").addEventListener("click", () => {
      if (observer) observer.disconnect();
      loadProviders();
    });

    // Infinite Scroll
    observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          hasMore &&
          currentQuery
        ) {
          fetchResults(false);
        }
      },
      { root: null, threshold: 0.1 }
    );

    const sentinel = document.createElement("div");
    searchArea.appendChild(sentinel);
    observer.observe(sentinel);
  }

  function renderSearchResults(items, container) {
    if (!items || items.length === 0) return;

    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "manga-card";
      card.innerHTML = `
        <div class="manga-cover">
          <img src="${item.cover_art || ""}" alt="${
        item.title
      }" loading="lazy" onerror="this.style.display='none'">
        </div>
        <div class="manga-info">
          <h4>${item.title || "Unknown Title"}</h4>
          <div class="meta">
            <span class="status ${item.status}">${item.status}</span>
            <span class="year">${item.year || "N/A"}</span>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }
});
