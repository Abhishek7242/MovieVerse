// ============================
// CONFIG: put your movies here
// Each item: { name: "Movie Title", url: "https://...", rating: 8.7 }
// rating: numeric where higher = better
// ============================


const gallery = document.getElementById("gallery");

function escapeHtml(s = "") {
    return String(s).replace(/[&<>"']/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
}

// stable sort: highest rating first
const sorted = movies.map((m, i) => ({ ...m, __idx: i }))
    .sort((a, b) => {
        if (b.rating === a.rating) return a.__idx - b.__idx;
        return (b.rating ?? -Infinity) - (a.rating ?? -Infinity);
    });

const maxRating = sorted.reduce((mx, m) => Math.max(mx, Number(m.rating ?? -Infinity)), -Infinity);

function createCard(movie) {
    const isTop = Number(movie.rating) === maxRating;

    const card = document.createElement("article");
    card.className = "card" + (isTop ? " top" : "");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", movie.name + " — rating " + (movie.rating ?? "N/A"));

    const thumb = document.createElement("div");
    thumb.className = "thumb";

    const img = document.createElement("img");
    img.alt = movie.name || "poster";
    img.src = movie.url;
    img.loading = "lazy";

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
    meta.textContent = "Movie";

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

    card.appendChild(thumb);
    card.appendChild(info);

    return card;
}

// render
gallery.innerHTML = "";
sorted.forEach(m => gallery.appendChild(createCard(m)));