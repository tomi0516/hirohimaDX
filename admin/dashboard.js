import { db } from "../js/firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const saveButton = document.getElementById("saveButton");
let adminItems = [];
let editingId = null;

// 一覧を取得
async function loadItemList() {

    const snapshot = await getDocs(collection(db, "lostItems"));

    adminItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    renderAdminItems(adminItems);

}


// カードを表示
function renderAdminItems(items) {

    const container = document.getElementById("itemList");

    container.innerHTML = "";

    items.forEach(item => {

        container.innerHTML += `

        <div class="card">

            <img
                src="${item.image || "https://placehold.co/600x400?text=No+Image"}"
                class="image">

            <div class="info">

                ${item.isNew ? '<span class="new">NEW</span>' : ""}

                <span class="status">${item.status}</span>

                <h2>${item.name}</h2>

                <p>📍 ${item.foundPlace}</p>

                <p>📅 ${item.foundDate}</p>

                <p>📂 ${item.category}</p>

                <div class="button-area">

                    <button
                        class="edit-btn"
                        data-id="${item.id}">
                        ✏ 編集
                    </button>

                    <button
                        class="delete-btn"
                        data-id="${item.id}">
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

}


// 登録
saveButton.addEventListener("click", async () => {

    try {

        if (editingId) {

            await updateDoc(
                doc(db, "lostItems", editingId),
                {

                    name: document.getElementById("name").value,
                    category: document.getElementById("category").value,
                    foundPlace: document.getElementById("foundPlace").value,
                    storagePlace: document.getElementById("storagePlace").value,
                    foundDate: document.getElementById("foundDate").value,
                    description: document.getElementById("description").value

                }
            );

        } else {

            await addDoc(collection(db, "lostItems"), {

                name: document.getElementById("name").value,

                category: document.getElementById("category").value,

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

        // フォームをリセット
        document.getElementById("name").value = "";
        document.getElementById("category").value = "";
        document.getElementById("foundPlace").value = "";
        document.getElementById("storagePlace").value = "";
        document.getElementById("foundDate").value = "";
        document.getElementById("description").value = "";

        editingId = null;
        saveButton.textContent = "登録する";

        loadItemList();

    } catch (error) {

        console.error(error);
        alert("保存に失敗しました");

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




// 初期表示
loadItemList();