  // Enhanced MovieVerse Admin JavaScript
    const API_URL = "https://movie-api-production-8550.up.railway.app/api/movies";

    // DOM Elements
    const moviesGrid = document.getElementById("moviesGrid");
    const loadingState = document.getElementById("loadingState");
    const emptyState = document.getElementById("emptyState");
    const refreshBtn = document.getElementById("refreshBtn");
    const addMovieBtn = document.getElementById("addMovieBtn");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const ratingFilter = document.getElementById("ratingFilter");
    const sortBy = document.getElementById("sortBy");

    // Stats elements
    const totalMoviesEl = document.getElementById("totalMovies");
    const avgRatingEl = document.getElementById("avgRating");
    const categoriesEl = document.getElementById("categories");
    const lastUpdatedEl = document.getElementById("lastUpdated");

    // Modal elements
    const modalBackdrop = document.getElementById("modalBackdrop");
    const editForm = document.getElementById("editForm");
    const editName = document.getElementById("editName");
    const editUrl = document.getElementById("editUrl");
    const editRating = document.getElementById("editRating");
    const editCategory = document.getElementById("editCategory");
    const cancelBtn = document.getElementById("cancelBtn");
    const modalMessage = document.getElementById("modalMessage");

    // Add Movie modal elements
    const addModalBackdrop = document.getElementById("addModalBackdrop");
    const addForm = document.getElementById("addForm");
    const addName = document.getElementById("addName");
    const addUrl = document.getElementById("addUrl");
    const addRating = document.getElementById("addRating");
    const addCategory = document.getElementById("addCategory");
    const addCancelBtn = document.getElementById("addCancelBtn");
    const addModalMessage = document.getElementById("addModalMessage");

    // State
    let movies = [];
    let filteredMovies = [];
    let currentEditId = null;

    // ---- Utility Functions ----
    function showLoading() {
        loadingState.classList.remove("hidden");
    moviesGrid.classList.add("hidden");
    emptyState.classList.add("hidden");
  }

    function hideLoading() {
        loadingState.classList.add("hidden");
    moviesGrid.classList.remove("hidden");
  }

    function showEmptyState() {
        emptyState.classList.remove("hidden");
    moviesGrid.classList.add("hidden");
  }

    function hideEmptyState() {
        emptyState.classList.add("hidden");
    moviesGrid.classList.remove("hidden");
  }

    function showModal() {
        modalBackdrop.classList.add("show");
    modalBackdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    editName.focus();
  }

    function hideModal() {
        modalBackdrop.classList.remove("show");
    modalBackdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    modalMessage.classList.add("hidden");
    modalMessage.textContent = "";
    editForm.reset();
    currentEditId = null;
  }

    function showAddModal() {
        addModalBackdrop.classList.add("show");
    addModalBackdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    addName.focus();
  }

    function hideAddModal() {
        addModalBackdrop.classList.remove("show");
    addModalBackdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    addModalMessage.classList.add("hidden");
    addModalMessage.textContent = "";
    addForm.reset();
  }

    function showMessage(message, isError = false) {
        modalMessage.textContent = message;
    modalMessage.className = `status-message ${
        isError ? "status-error" : "status-success"
    }`;
    modalMessage.classList.remove("hidden");
  }

    function showAddMessage(message, isError = false) {
        addModalMessage.textContent = message;
    addModalMessage.className = `status-message ${
        isError ? "status-error" : "status-success"
    }`;
    addModalMessage.classList.remove("hidden");
  }

    // ---- Data Management ----
    async function loadMovies() {
        showLoading();
    try {
      const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    movies = await res.json();
    filteredMovies = [...movies];
    updateStats();
    updateCategoryFilter();
    renderMovies();
    hideLoading();
    } catch (err) {
        console.error(err);
    hideLoading();
    showEmptyState();
    showMessage("Failed to load movies", true);
    }
  }

    function updateStats() {
        totalMoviesEl.textContent = movies.length;

    const validRatings = movies.filter((m) => m.rating && !isNaN(m.rating));
    const avgRating =
      validRatings.length > 0
    ? (
            validRatings.reduce((sum, m) => sum + Number(m.rating), 0) /
    validRatings.length
    ).toFixed(1)
    : "0.0";
    avgRatingEl.textContent = avgRating;

    const uniqueCategories = new Set(
      movies.map((m) => m.category).filter(Boolean)
    );
    categoriesEl.textContent = uniqueCategories.size;

    lastUpdatedEl.textContent = new Date().toLocaleTimeString();
  }

    function updateCategoryFilter() {
    const categories = [
      ...new Set(movies.map((m) => m.category).filter(Boolean)),
    ].sort();
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    categories.forEach((category) => {
      const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
    });
  }

    // ---- Filtering and Sorting ----
    function filterAndSortMovies() {
        let filtered = [...movies];

    // Search filter
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filtered = filtered.filter(
            (movie) =>
                movie.name?.toLowerCase().includes(searchTerm) ||
                movie.category?.toLowerCase().includes(searchTerm)
        );
    }

    // Category filter
    const selectedCategory = categoryFilter.value;
    if (selectedCategory) {
        filtered = filtered.filter(
            (movie) => movie.category === selectedCategory
        );
    }

    // Rating filter
    const minRating = ratingFilter.value;
    if (minRating) {
        filtered = filtered.filter(
            (movie) => Number(movie.rating) >= Number(minRating)
        );
    }

    // Sort
    const sortValue = sortBy.value;
    filtered.sort((a, b) => {
      switch (sortValue) {
        case "rating-desc":
    return (b.rating ?? -Infinity) - (a.rating ?? -Infinity);
    case "rating-asc":
    return (a.rating ?? Infinity) - (b.rating ?? Infinity);
    case "name-asc":
    return (a.name || "").localeCompare(b.name || "");
    case "name-desc":
    return (b.name || "").localeCompare(a.name || "");
    case "category":
    return (a.category || "").localeCompare(b.category || "");
    default:
    return 0;
      }
    });

    filteredMovies = filtered;
    renderMovies();
  }

    // ---- Rendering ----
    function createMovieCard(movie) {
    const card = document.createElement("div");
    card.className = "movie-card fade-in";

    // Poster
    const poster = document.createElement("div");
    poster.className = "movie-poster";

    const img = document.createElement("img");
    img.src = movie.url || "";
    img.alt = movie.name || "Movie poster";
    img.loading = "lazy";
    img.onerror = () => {
        poster.innerHTML = `
      <div class="fallback-initials">
        ${(movie.name || "?")
            .split(" ")
            .map((s) => s[0] || "")
            .slice(0, 2)
            .join("")
            .toUpperCase()}
      </div>
    `;
    };

    const overlay = document.createElement("div");
    overlay.className = "poster-overlay";

    const ratingBadge = document.createElement("div");
    ratingBadge.className = "rating-badge";
    ratingBadge.innerHTML = `
    <i class="fas fa-star"></i>
    ${movie.rating ? Number(movie.rating).toFixed(1) : "N/A"}
    `;

    poster.appendChild(img);
    poster.appendChild(overlay);
    poster.appendChild(ratingBadge);

    // Info
    const info = document.createElement("div");
    info.className = "movie-info";

    const title = document.createElement("h3");
    title.className = "movie-title";
    title.textContent = movie.name || "Untitled Movie";

    const category = document.createElement("div");
    category.className = "movie-category";
    category.innerHTML = `
    <i class="fas fa-tag"></i>
    ${movie.category || "Uncategorized"}
    `;

    const actions = document.createElement("div");
    actions.className = "movie-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "action-btn action-btn-edit";
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
    editBtn.addEventListener("click", () => openEditModal(movie));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "action-btn action-btn-delete";
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
    deleteBtn.addEventListener("click", () => confirmDelete(movie));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    info.appendChild(title);
    info.appendChild(category);
    info.appendChild(actions);

    card.appendChild(poster);
    card.appendChild(info);

    return card;
  }

    function renderMovies() {
        moviesGrid.innerHTML = "";

    if (filteredMovies.length === 0) {
        showEmptyState();
    return;
    }

    hideEmptyState();
    filteredMovies.forEach((movie, index) => {
      const card = createMovieCard(movie);
    card.style.animationDelay = `${index * 0.1}s`;
    moviesGrid.appendChild(card);
    });
  }

    // ---- Edit Modal ----
    function openEditModal(movie) {
        currentEditId = movie._id || movie.id;
    editName.value = movie.name || "";
    editUrl.value = movie.url || "";
    editRating.value = movie.rating ?? "";
    editCategory.value = movie.category || "";
    showModal();
  }

    // ---- Event Listeners ----
    refreshBtn.addEventListener("click", loadMovies);
    addMovieBtn.addEventListener("click", showAddModal);

    searchInput.addEventListener("input", filterAndSortMovies);
    categoryFilter.addEventListener("change", filterAndSortMovies);
    ratingFilter.addEventListener("change", filterAndSortMovies);
    sortBy.addEventListener("change", filterAndSortMovies);

    cancelBtn.addEventListener("click", hideModal);
    addCancelBtn.addEventListener("click", hideAddModal);

  editForm.addEventListener("submit", async (e) => {
        e.preventDefault();
    if (!currentEditId) return;

    showMessage("Saving changes...");

    const payload = {
        name: editName.value.trim(),
    url: editUrl.value.trim(),
    rating: Number(editRating.value),
    category: editCategory.value.trim(),
    };

    // Validation
    if (
    !payload.name ||
    !payload.url ||
    isNaN(payload.rating) ||
    payload.rating < 0 ||
      payload.rating > 10
    ) {
        showMessage(
            "Please fill all fields correctly. Rating must be between 0-10.",
            true
        );
    return;
    }

    try {
      const res = await fetch(`${API_URL}/${currentEditId}`, {
        method: "PUT",
    headers: {"Content-Type": "application/json" },
    body: JSON.stringify(payload),
      });

    if (!res.ok) {
        const errorText = await res.text();
    showMessage(`Failed to save: ${res.status} ${errorText}`, true);
    return;
      }

      // Update local data
      movies = movies.map((m) =>
    m._id === currentEditId || m.id === currentEditId
    ? {...m, ...payload }
    : m
    );

    updateStats();
    filterAndSortMovies();
    showMessage("Movie updated successfully! ✅");

      setTimeout(() => {
        hideModal();
      }, 1500);
    } catch (err) {
        console.error(err);
    showMessage("Network error while saving. Please try again.", true);
    }
  });

  // Add Movie form submission
  addForm.addEventListener("submit", async (e) => {
        e.preventDefault();

    showAddMessage("Adding movie...");

    const payload = {
        name: addName.value.trim(),
    url: addUrl.value.trim(),
    rating: Number(addRating.value),
    category: addCategory.value.trim(),
    };

    // Validation
    if (
    !payload.name ||
    !payload.url ||
    isNaN(payload.rating) ||
    payload.rating < 0 ||
      payload.rating > 10
    ) {
        showAddMessage(
            "Please fill all fields correctly. Rating must be between 0-10.",
            true
        );
    return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
    headers: {"Content-Type": "application/json" },
    body: JSON.stringify(payload),
      });

    if (!res.ok) {
        const errorText = await res.text();
    showAddMessage(`Failed to add movie: ${res.status} ${errorText}`, true);
    return;
      }

    const newMovie = await res.json();

    // Add to local data
    movies.push(newMovie);
    updateStats();
    updateCategoryFilter();
    filterAndSortMovies();
    showAddMessage("Movie added successfully! ✅");

      setTimeout(() => {
        hideAddModal();
      }, 1500);
    } catch (err) {
        console.error(err);
    showAddMessage(
    "Network error while adding movie. Please try again.",
    true
    );
    }
  });

    // Delete confirmation
    async function confirmDelete(movie) {
    const id = movie._id || movie.id;
    const confirmed = confirm(
    `Are you sure you want to delete "${movie.name}"?\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {method: "DELETE" });

    if (!res.ok) {
        const errorText = await res.text();
    alert(`Delete failed: ${res.status} ${errorText}`);
    return;
      }

      // Remove from local data
      movies = movies.filter((m) => !(m._id === id || m.id === id));
    updateStats();
    filterAndSortMovies();
    } catch (err) {
        console.error(err);
    alert("Network error while deleting. Please try again.");
    }
  }

  // Modal backdrop click
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) hideModal();
  });

  addModalBackdrop.addEventListener("click", (e) => {
    if (e.target === addModalBackdrop) hideAddModal();
  });

  // Escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modalBackdrop.classList.contains("show")) {
        hideModal();
      } else if (addModalBackdrop.classList.contains("show")) {
        hideAddModal();
      }
    }
  });

  // Initialize
  document.addEventListener("DOMContentLoaded", () => {
        loadMovies();
  });