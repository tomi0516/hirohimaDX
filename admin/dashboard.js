//ログイン確認
import { auth } from "../js/firebase.js";
import { db } from "../js/firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

    if (!user) {

        location.href = "login.html";

    }

});


import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const saveButton = document.getElementById("saveButton");
let adminItems = [];
let editingId = null;
let imageUrl = "";

// 一覧を取得
async function loadItemList() {

    const q = collection(db, "lostItems");

    onSnapshot(q, (snapshot) => {

        adminItems = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .sort((a, b) => {

                const order = {
                    "確認中": 0,
                    "保管中": 1,
                    "返却済み": 2
                };

                const statusDiff =
                    (order[a.status] ?? 99) -
                    (order[b.status] ?? 99);

                if (statusDiff !== 0) {
                    return statusDiff;
                }

                const dateA = a.createdAt?.toDate?.() ?? new Date(a.createdAt);
                const dateB = b.createdAt?.toDate?.() ?? new Date(b.createdAt);

                return dateB - dateA;

            });

        filterItems();

        updateStats();

    });

}


// カードを表示
function renderAdminItems(items) {

    const container = document.getElementById("itemList");

    container.innerHTML = "";

    items.forEach(item => {

        const days =
            Math.floor(
                (Date.now() - new Date(item.createdAt).getTime())
                / (1000 * 60 * 60 * 24)
            );

        const isLongTerm = days >= 30;

        container.innerHTML += `

        <div class="card">

            <img
                src="${item.image || "https://placehold.co/600x400?text=No+Image"}"
                class="image">

            <div class="info">

                ${isLongTerm
                    ? '<span class="long-term">🟠 長期保管</span>'
                    : ""
                }

                <span class="
                    status
                    ${item.status === "確認中" ? "pending" : ""}
                    ${item.status === "保管中" ? "keeping" : ""}
                    ${item.status === "返却済み" ? "returned" : ""}
                ">
                    ${item.status}
                </span>

                <h2>${item.name}</h2>

                <p>📍 ${item.foundPlace}</p>

                <p>📅 ${item.foundDate}</p>

                <p>📂 ${item.category}</p>

                <div class="button-area">

                    ${item.status === "確認中" ? `
                        <button class="approve-btn" data-id="${item.id}">
                            ✔ 承認
                        </button>
                    ` : ""}

                    <button class="edit-btn" data-id="${item.id}">
                        ✏ 編集
                    </button>

                    ${item.status === "保管中" ? `
                        <button class="return-btn" data-id="${item.id}">
                            ✅ 返却済み
                        </button>
                    ` : ""}

                    <button class="delete-btn" data-id="${item.id}">
                        🗑 削除
                    </button>

                </div>

            </div>

        </div>

        `;

    });

    addButtonEvents();

}


// ボタンイベント
function addButtonEvents() {

    document.querySelectorAll(".delete-btn").forEach(button => {

        button.addEventListener("click", () => {

            deleteItem(button.dataset.id);

        });

    });

    document.querySelectorAll(".edit-btn").forEach(button => {

        button.addEventListener("click", () => {

            editItem(button.dataset.id);

        });

    });

    document.querySelectorAll(".return-btn").forEach(button => {

        button.addEventListener("click", () => {

            returnItem(button.dataset.id);

        });

    });

    document.querySelectorAll(".approve-btn").forEach(button => {

        button.addEventListener("click", () => {

            approveItem(button.dataset.id);

        });

    });

}



// 登録
let isSaving = false;

saveButton.addEventListener("click", async () => {

    if (isSaving) return;

    isSaving = true;
    saveButton.disabled = true;

    try {

        let imageUrl = "";

        const file = document.getElementById("imageFile").files[0];

        if (file) {
            imageUrl = await uploadImage(file);
        }

        if (editingId) {

            await updateDoc(
                doc(db, "lostItems", editingId),
                {
                    name: document.getElementById("name").value,
                    category: document.getElementById("category").value,
                    foundPlace: document.getElementById("foundPlace").value,
                    storagePlace: document.getElementById("storagePlace").value,
                    foundDate: document.getElementById("foundDate").value,
                    description: document.getElementById("description").value,
                    image: imageUrl
                }
            );

        } else {

            await addDoc(collection(db, "lostItems"), {

                name: document.getElementById("name").value,
                category: document.getElementById("category").value,
                image: imageUrl,
                foundPlace: document.getElementById("foundPlace").value,
                storagePlace: document.getElementById("storagePlace").value,
                foundDate: document.getElementById("foundDate").value,
                description: document.getElementById("description").value,
                isNew: true,
                status: "保管中",
                createdAt: new Date()

            });

        }

        alert("保存しました");

        document.getElementById("name").value = "";
        document.getElementById("category").value = "";
        document.getElementById("foundPlace").value = "";
        document.getElementById("storagePlace").value = "";
        document.getElementById("foundDate").value = "";
        document.getElementById("description").value = "";
        document.getElementById("imageFile").value = "";

        editingId = null;
        saveButton.textContent = "登録する";

        loadItemList();

    } catch (error) {

        console.error(error);
        alert("保存に失敗しました");

    } finally {

        isSaving = false;
        saveButton.disabled = false;
    }

    
});


// 削除
async function deleteItem(id) {

    const ok = confirm("この落とし物を削除しますか？");

    if (!ok) return;

    try {

        await deleteDoc(doc(db, "lostItems", id));

        loadItemList();

    } catch (error) {

        console.error(error);

        alert("削除できませんでした");

    }

}

// 返却済み
async function returnItem(id) {

    const ok = confirm("返却済みにしますか？");

    if (!ok) return;

    try {

        await updateDoc(
            doc(db, "lostItems", id),
            {
                status: "返却済み"
            }
        );

        const item = adminItems.find(item => item.id === id);

        await addDoc(
            collection(db, "returnHistory"),
            {

                itemName: item.name,

                category: item.category,

                foundPlace: item.foundPlace,

                returnedAt: new Date(),

            }
        );

        loadItemList();

    } catch (error) {

        console.error(error);

        alert("更新できませんでした");

    }

}

// 承認
async function approveItem(id) {

    const ok = confirm("この落とし物を公開しますか？");

    if (!ok) return;

    try {

        await updateDoc(
            doc(db, "lostItems", id),
            {
                status: "保管中"
            }
        );

    } catch (error) {

        console.error(error);
        alert("承認できませんでした");

    }

}


// 編集

function editItem(id){

    const item = adminItems.find(item => item.id === id);

    if(!item) return;

    editingId = id;

    document.getElementById("name").value = item.name;
    document.getElementById("category").value = item.category;
    document.getElementById("foundPlace").value = item.foundPlace;
    document.getElementById("storagePlace").value = item.storagePlace;
    document.getElementById("foundDate").value = item.foundDate;
    document.getElementById("description").value = item.description;

    saveButton.textContent = "更新する";

} 


// 画像アップロード
async function uploadImage(file) {

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "lost-found");

    const response = await fetch(
        "https://api.cloudinary.com/v1_1/xd6a9ui7/image/upload",
        {
            method: "POST",
            body: formData
        }
    );

    const data = await response.json();

    return data.secure_url;

}




// 初期表示
document.getElementById("imageFile").value = "";

loadItemList();
loadHistory();


// 統計情報を更新
function updateStats() {

    const pending =
        adminItems.filter(item => item.status === "確認中").length;

    const keeping = adminItems.filter(
        item => item.status === "保管中"
    ).length;

    const returned = adminItems.filter(
        item => item.status === "返却済み"
    ).length;

    const categories = new Set(
        adminItems.map(item => item.category)
    );

    document.getElementById("pendingCount").textContent =
        `${pending}件`;

    document.getElementById("keepingCount").textContent =
        `${keeping}件`;

    document.getElementById("returnedCount").textContent =
        `${returned}件`;

    document.getElementById("categoryCount").textContent =
        `${categories.size}種類`;

    const notification =
        document.getElementById("notification");

    const notificationText =
        document.getElementById("notificationText");

    //通知機能
    notification.addEventListener("click", () => {

        searchInput.value = "";

        categoryFilter.value = "すべて";

        statusFilter.value = "確認中";

        filterItems();

        document.getElementById("listArea").scrollIntoView({
        
            behavior: "smooth",
            block: "start"

        });

    });

    if (pending > 0) {
        notification.style.display = "block";
        notificationText.textContent =
            `🔔 確認待ちの落とし物が ${pending} 件あります（クリックして確認）`;
    } else {
        notification.style.display = "none";
    }

}


// ログアウト
import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

document.getElementById("logoutButton")
.addEventListener("click", async () => {

    await signOut(auth);

    location.href = "login.html";

});

//CSVファイルダウンロード
document
    .getElementById("csvButton")
    .addEventListener("click", downloadCSV);

function downloadCSV() {

    const header = [
        "落とし物名",
        "カテゴリ",
        "発見場所",
        "保管場所",
        "発見日",
        "状態",
        "特徴"
    ];

    const rows = adminItems.map(item => [
        item.name,
        item.category,
        item.foundPlace,
        item.storagePlace,
        item.foundDate,
        item.status,
        item.description
    ].map(value => `"${String(value ?? "").replace(/"/g, '""')}"`));

    const csv = [
        header,
        ...rows
    ]
    .map(row => row.join(","))
    .join("\n");

    const blob = new Blob(
        ["\uFEFF" + csv],
        { type: "text/csv;charset=utf-8;" }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "lostItems.csv";

    link.click();

}

// 返却履歴
async function loadHistory() {

    const snapshot = await getDocs(
        collection(db, "returnHistory")
    );

    const container =
        document.getElementById("historyList");

    container.innerHTML = "";

    snapshot.forEach(doc => {

        const item = doc.data();

        container.innerHTML += `

        <div class="history-card">

            <h3>${item.itemName}</h3>

            <p>📍 ${item.foundPlace}</p>

            <p>📅 ${
                new Date(item.returnedAt.seconds*1000)
                    .toLocaleString("ja-JP")
            }</p>

        </div>

        `;

    });

}

//検索機能
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");

function filterItems(){

    const keyword = searchInput.value.toLowerCase();

    const status = statusFilter.value;

    const category = categoryFilter.value;

    const filtered = adminItems.filter(item=>{

        const text = `
            ${item.name}
            ${item.foundPlace}
            ${item.storagePlace}
            ${item.description}
        `.toLowerCase();

        return (

            text.includes(keyword)

            &&

            (
                status === "すべて"
                ||
                item.status === status
            )

            &&

            (
                category === "すべて"
                ||
                item.category === category
            )

        );

    });

    renderAdminItems(filtered);

}

searchInput.addEventListener("input", filterItems);

statusFilter.addEventListener("change", filterItems);

categoryFilter.addEventListener("change", filterItems);


