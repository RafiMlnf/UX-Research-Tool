// Smooth scroll for in-page links, but skip links with data-dl (download buttons)
document.querySelectorAll('a[href^="#"]:not([data-dl])').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", id);
  });
});

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Toast helper
const toast = document.getElementById("toast");
let toastTimer = null;

function showToast(msg) {
  toast.textContent = msg;
  toast.style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.style.display = "none"), 2200);
}

// Copy link
document.getElementById("copyLinkBtn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(location.href);
    showToast("Link berhasil disalin.");
  } catch {
    showToast("Gagal menyalin link (browser membatasi).");
  }
});

// Modal preview
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const closeModalBtn = document.getElementById("closeModalBtn");

function openModal(title, bodyHtml) {
  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHtml || "Preview belum diisi.";
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Function untuk membuka gambar full screen dalam popup
function openImagePopup(imgSrc, imgAlt) {
  const popupModal = document.createElement("div");
  popupModal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    cursor: zoom-out;
  `;

  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = imgAlt;
  img.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    border-radius: 8px;
  `;

  popupModal.appendChild(img);
  document.body.appendChild(popupModal);

  // Close popup saat diklik
  popupModal.addEventListener("click", () => {
    popupModal.remove();
  });

  // Close popup dengan Escape key
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      popupModal.remove();
      document.removeEventListener("keydown", handleEscape);
    }
  };
  document.addEventListener("keydown", handleEscape);
}

const openPreviewBtnEl = document.getElementById("openPreviewBtn");
if (openPreviewBtnEl) {
  openPreviewBtnEl.addEventListener("click", () => {
    openModal(
      "Contoh UX Research Toolkit",
      `
    <div class="placeholder">
      <div>
        <b>Contoh struktur Toolkit</b><br><br>
        1) Persona Template<br>
        2) User Journey Map<br>
        3) Usability Checklist<br><br>
        <span style="color:rgba(238,242,255,.75)">
          Ganti placeholder ini dengan screenshot atau PDF toolkit kamu.
        </span>
      </div>
    </div>
  `
    );
  });
}

const openPreviewBtn2El = document.getElementById("openPreviewBtn2");
if (openPreviewBtn2El && openPreviewBtnEl) {
  openPreviewBtn2El.addEventListener("click", () => {
    openPreviewBtnEl.click();
  });
}

closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.style.display === "flex") closeModal();
});

// Preview links sudah menggunakan onclick langsung untuk membuka popup gambar

// Download buttons (demo)
document.querySelectorAll("[data-dl]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const name = btn.getAttribute("data-dl");
    showToast(`Link download "${name}" belum diisi. Ganti href pada tombol download.`);
  });
});

// Contact form (demo validation)

// Tambahkan di script.js
const checkboxes = document.querySelectorAll(".demo-check");
const progressText = document.getElementById("progressText");

checkboxes.forEach((box) => {
  box.addEventListener("change", () => {
    const total = checkboxes.length;
    const checked = document.querySelectorAll(".demo-check:checked").length;
    progressText.textContent = `${checked}/${total} Selesai`;

    if (checked === total) {
      progressText.textContent = "Sempurna! 🎉";
      progressText.style.color = "var(--accent2)";
    } else {
      progressText.style.color = "var(--muted)";
    }
  });
});

// Ganti kode form submit yang lama dengan yang baru ini:
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  // Validasi sederhana
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    showToast("Mohon lengkapi Nama, Email, dan Pesan.");
    return;
  }

  // Tombol jadi loading
  const btn = form.querySelector("button");
  const originalText = btn.textContent;
  btn.textContent = "Mengirim...";
  btn.disabled = true;

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      showToast("Pesan berhasil terkirim! Terima kasih.");
      form.reset();
    } else {
      showToast("Oops! Ada masalah saat mengirim pesan.");
    }
  } catch (error) {
    showToast("Gagal terhubung ke server.");
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
});
