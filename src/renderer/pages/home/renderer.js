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
      sourcesContainer.innerHTML = `<p class="error">Error loading providers: ${error.message}</p>`;
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
    `;

    sourcesContainer.appendChild(searchArea);

    // Back button logic
    searchArea.querySelector(".back-button").addEventListener("click", () => {
      loadProviders();
    });

    // Search button logic
    const searchBtn = searchArea.querySelector(".primary-button");
    const searchInput = document.getElementById("provider-search-input");

    const handleSearch = async () => {
      const query = searchInput.value;
      if (!query.trim()) return;

      const resultsContainer = document.createElement("div");
      resultsContainer.className = "search-results";
      resultsContainer.innerHTML = "<h4>Searching...</h4>";

      // Remove existing results if any
      const existingResults = searchArea.querySelector(".search-results");
      if (existingResults) existingResults.remove();

      searchArea.appendChild(resultsContainer);

      try {
        const result = await window.yukimi.searchInProvider(
          providerName,
          query
        );

        if (result.success) {
          renderSearchResults(result.content, resultsContainer);
        } else {
          resultsContainer.innerHTML = `<p class="error">Error: ${result.message}</p>`;
        }
      } catch (err) {
        console.error(err);
        resultsContainer.innerHTML = `<p class="error">Search failed.</p>`;
      }
    };

    searchBtn.addEventListener("click", handleSearch);
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSearch();
    });
  }

  function renderSearchResults(items, container) {
    if (!items || items.length === 0) {
      container.innerHTML = "<p>No results found.</p>";
      return;
    }

    container.innerHTML = "";
    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "manga-card";
      card.innerHTML = `
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
