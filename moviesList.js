const API_URL = "https://movie-api-production-8550.up.railway.app/api/movies";

let movies = [];

const gallery = document.getElementById("gallery");

async function escapeHtml(s = "") {
    return String(s).replace(/[&<>"']/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
}

function createCard(movie) {
    const card = document.createElement("article");
    // we'll set the "top" class later after computing maxRating
    card.className = "card";
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", movie.name + " — rating " + (movie.rating ?? "N/A"));

    const thumb = document.createElement("div");
    thumb.className = "thumb";

    const img = document.createElement("img");
    img.alt = movie.name || "poster";
    img.src = movie.url;

    img.onerror = function () {
        thumb.innerHTML = "";
        const initials = (movie.name || "")
            .split(" ")
            .map(w => w[0] || "")
            .slice(0, 2)
            .join("")
            .toUpperCase() || "?";
        const fallback = document.createElement("div");
        fallback.className = "fallback-initials";
        fallback.textContent = initials;
        thumb.appendChild(fallback);
    };

    thumb.appendChild(img);

    const info = document.createElement("div");
    info.className = "info";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = movie.name || "Untitled";

    const meta = document.createElement("div");
    meta.className = "meta";
    if (movie.name.toLowerCase().includes("series") || movie.name.toLowerCase().includes("season")) {
        meta.textContent = "Series";
    } else {
        meta.textContent = "Movie";
    }


    const recomendation = document.createElement("div");
    if (Number(movie.rating) >= 6 && Number(movie.rating) <= 8) {
        recomendation.textContent = "Recommended";
        recomendation.className = "recomendation recommended";
    } else if (Number(movie.rating) > 8) {
        recomendation.textContent = "Highly Recommended";
        recomendation.className = "recomendation highly-recommended";
    } else {
        recomendation.textContent = "Optional to watch";
        recomendation.className = "recomendation optional";
    }


    // rating pill (simple)
    const rating = document.createElement("div");
    rating.className = "rating-pill";
    rating.textContent = (movie.rating !== undefined && movie.rating !== null) ? Number(movie.rating).toFixed(1) + " / 10" : "N/A";

    // small helper text
    const small = document.createElement("div");
    small.className = "small-muted";
    small.textContent = movie.category;

    // append in order: title + meta + rating + small
    info.appendChild(title);
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "8px";
    row.appendChild(meta);
    row.appendChild(rating);
    info.appendChild(row);
    info.appendChild(small);

    info.appendChild(recomendation);

    card.appendChild(thumb);
    card.appendChild(info);

    return card;
}

async function loadMovies() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        movies = await response.json();

        console.log("✅ Movies loaded:", movies);

        // --- move all rendering logic here so it runs after fetch completes ---

        // stable sort: highest rating first
        const sorted = movies.map((m, i) => ({ ...m, __idx: i }))
            .sort((a, b) => {
                if (b.rating === a.rating) return a.__idx - b.__idx;
                return (b.rating ?? -Infinity) - (a.rating ?? -Infinity);
            });

        const maxRating = sorted.reduce((mx, m) => Math.max(mx, Number(m.rating ?? -Infinity)), -Infinity);

        // render
        gallery.innerHTML = "";
        sorted.forEach(m => {
            const card = createCard(m);
            // add "top" class if this movie has the max rating
            if (Number(m.rating) === maxRating) card.classList.add("top");
            gallery.appendChild(card);
        });

        // --- end rendering logic ---

    } catch (err) {
        console.error("❌ Failed to fetch movies:", err);
    }
}

// Call when page loads
loadMovies();
