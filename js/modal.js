const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModal");

// モーダルを開く
function openModal(itemId){

    const item = items.find(i => i.id === itemId);

    if(!item) return;

    document.getElementById("modalImage").src = item.image;

    document.getElementById("modalName").textContent = item.name;

    document.getElementById("modalCategory").textContent =
        "📂 カテゴリ： " + item.category;

    document.getElementById("modalFoundPlace").textContent =
        "📍 発見場所： " + item.foundPlace;

    document.getElementById("modalStoragePlace").textContent =
        "🏢 保管場所： " + item.storagePlace;

    document.getElementById("modalDate").textContent =
        "📅 発見日： " + item.foundDate;

    document.getElementById("modalDescription").textContent =
        "📝 特徴： " + item.description;

    modal.style.display = "flex";

}

// モーダルを閉じる
function closeModal() {
    modal.style.display = "none";
}

// ×ボタン
closeModalBtn.addEventListener("click", closeModal);

// 背景をクリックしたら閉じる
modal.addEventListener("click", function(e) {
    if (e.target === modal) {
        closeModal();
    }
});