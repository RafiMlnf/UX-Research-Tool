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

document.getElementById("openPreviewBtn").addEventListener("click", () => {
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

document.getElementById("openPreviewBtn2").addEventListener("click", () => {
  document.getElementById("openPreviewBtn").click();
});

closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.style.display === "flex") closeModal();
});

// Screenshot cards open modal
document.querySelectorAll(".shot").forEach((card) => {
  card.addEventListener("click", () => {
    const title = card.getAttribute("data-preview") || "Preview";
    let bodyHtml = "";
    let imgSrc = null;
    if (title === "Persona Template") {
      imgSrc = "assets/01_Persona_Template_UX.png";
    } else if (title === "User Journey Map") {
      imgSrc = "assets/02_User_Journey_Map.png";
    } else if (title === "Usability Checklist") {
      imgSrc = "assets/03_Usability_Checklist.png";
    }
    if (imgSrc) {
      bodyHtml = `<div class=\"modal-img-wrap\"><img src=\"${imgSrc}\" alt=\"${title}\" class=\"modal-img\" tabindex=0></div>`;
    } else {
      bodyHtml = `<div class=\"placeholder\"></div>`;
    }
    openModal(title, bodyHtml);
  });
});

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
