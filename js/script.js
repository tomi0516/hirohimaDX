import { db } from "./firebase.js";

import {
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const container = document.getElementById("itemsContainer");
const sortFilter = document.getElementById("sortFilter");

let items = [];



// 一覧表示
function renderItems(itemList) {

    container.innerHTML = "";

    document.getElementById("itemCount").textContent =
        `📦 保管中：${itemList.length}件`;

    if (itemList.length === 0) {

        container.innerHTML = `
            <p class="no-result">
                該当する落とし物はありません。
            </p>
        `;

        return;
    }

    itemList.forEach(item => {

        const created =
            item.createdAt?.toDate
                ? item.createdAt.toDate()
                : new Date(item.createdAt);

        const isNew =
            Date.now() - created.getTime()
            < 24 * 60 * 60 * 1000;

        container.innerHTML += `

        <div class="card">

            <img
                src="${item.image || "https://placehold.co/600x400?text=No+Image"}"
                class="image">

            <div class="info">

                ${isNew ? '<span class="new">NEW</span>' : ""}

                <span class="status">${item.status}</span>

                <h2>${item.name}</h2>

                <p>📍 ${item.foundPlace}</p>

                <p>📅 ${item.foundDate}</p>

                <p>📂 ${item.category}</p>

                <button onclick="openModal('${item.id}')">
                    詳細を見る
                </button>

            </div>

        </div>

        `;

    });

}


// Firestoreから取得
async function loadItems() {

    onSnapshot(collection(db, "lostItems"), (snapshot) => {

        items = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter(item => item.status === "保管中");

        console.log(items);

        renderItems(items);

    });

}


// 検索
function filterItems() {

    const keyword = searchInput.value.toLowerCase();

    const category = categoryFilter.value;

    const filtered = items.filter(item => {

        const text = `
            ${item.name}
            ${item.category}
            ${item.foundPlace}
            ${item.storagePlace}
            ${item.description}
        `.toLowerCase();

        return (
            text.includes(keyword) &&
            (
                category === "すべて" ||
                item.category === category
            )
        );

    });

    filtered.sort((a, b) => {

        switch (sortFilter.value) {

            case "createdNew":

                return (b.createdAt?.toDate().getTime() ?? 0)
                     - (a.createdAt?.toDate().getTime() ?? 0);

            case "createdOld":

                return (a.createdAt?.toDate().getTime() ?? 0)
                     - (b.createdAt?.toDate().getTime() ?? 0);

            case "foundNew":

                return new Date(b.foundDate).getTime()
                     - new Date(a.foundDate).getTime();

            case "foundOld":

                return new Date(a.foundDate).getTime()
                     - new Date(b.foundDate).getTime();

            default:

                return 0;

        }

    });
    
    renderItems(filtered);
}

searchInput.addEventListener("input", filterItems);
categoryFilter.addEventListener("change", filterItems);
sortFilter.addEventListener("change", filterItems);


// 初期読み込み
loadItems();




const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModal");

// モーダルを開く
function openModal(itemId){

    const item = items.find(i => i.id === itemId);

    if(!item) return;

    document.getElementById("modalImage").src =
        item.image || "https://placehold.co/600x400?text=No+Image";

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

window.openModal = openModal;


const liveModal = document.getElementById("liveModal");
const liveButton = document.getElementById("liveButton");
const closeLiveModal =
    document.getElementById("closeLiveModal");

liveButton.addEventListener("click", () => {

    liveModal.style.display = "flex";

});

closeLiveModal.addEventListener("click", () => {

    liveModal.style.display = "none";

});


liveModal.addEventListener("click", (e) => {

    if (e.target === liveModal) {

        liveModal.style.display = "none";

    }

});