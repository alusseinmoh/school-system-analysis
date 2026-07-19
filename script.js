document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const content = document.getElementById("content");
  const searchBox = document.getElementById("searchBox");
  const toggleBtn = document.getElementById("toggleSidebar");
  const itemCount = document.getElementById("itemCount");

  let total = 0;

  // بناء الفهرس (الشريط الجانبي) والمحتوى
  PARTS.forEach((part, pIndex) => {
    const partId = "part-" + pIndex;

    // رابط في الفهرس
    const link = document.createElement("a");
    link.href = "#" + partId;
    link.textContent = part.title;
    sidebar.appendChild(link);

    // كتلة الجزء في المحتوى
    const section = document.createElement("section");
    section.className = "part";
    section.id = partId;

    const h2 = document.createElement("h2");
    h2.textContent = part.title;
    section.appendChild(h2);

    const ul = document.createElement("ul");

    part.items.forEach((item) => {
      total++;
      const isObj = typeof item === "object";
      const text = isObj ? item.text : item;
      const tag = isObj ? item.tag : null;
      const note = isObj ? item.note : null;

      const li = document.createElement("li");
      li.dataset.text = text.toLowerCase();

      let html = "";
      if (tag === "new") html += '<span class="tag tag-new">إضافة مقترحة</span>';
      if (tag === "moved" || tag === "merged") html += '<span class="tag tag-moved">' + (tag === "merged" ? "دُمج" : "نُقل") + "</span>";
      html += "<span class='item-text'>" + text + "</span>";
      if (note) html += "<span class='note'>" + note + "</span>";

      li.innerHTML = html;
      ul.appendChild(li);
    });

    section.appendChild(ul);
    content.appendChild(section);
  });

  itemCount.textContent = total;

  // تفعيل الرابط النشط أثناء التمرير
  const sections = Array.from(document.querySelectorAll(".part"));
  const links = Array.from(sidebar.querySelectorAll("a"));

  function onScroll() {
    let currentId = sections[0].id;
    for (const sec of sections) {
      if (sec.getBoundingClientRect().top < 140) currentId = sec.id;
    }
    links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + currentId));
  }
  window.addEventListener("scroll", onScroll);
  onScroll();

  // إظهار/إخفاء الفهرس
  toggleBtn.addEventListener("click", () => sidebar.classList.toggle("collapsed"));

  // البحث في العناوين
  searchBox.addEventListener("input", () => {
    const q = searchBox.value.trim().toLowerCase();
    document.querySelectorAll(".part li").forEach((li) => {
      const match = !q || li.dataset.text.includes(q);
      li.classList.toggle("hidden", !match);
    });
    document.querySelectorAll(".part").forEach((sec) => {
      const anyVisible = Array.from(sec.querySelectorAll("li")).some((li) => !li.classList.contains("hidden"));
      sec.style.display = anyVisible ? "" : "none";
    });
  });
});
