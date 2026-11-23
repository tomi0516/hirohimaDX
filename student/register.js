import { db } from "../js/firebase.js";

import {
    collection,
    doc,
    writeBatch,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const saveButton = document.getElementById("saveButton");

let isSaving = false;

// 登録
saveButton.addEventListener("click", async () => {

    if (isSaving) return;

    isSaving = true;
    saveButton.disabled = true;

    try {

        const studentId = document.getElementById("studentId").value.trim();
        const studentName = document.getElementById("studentName").value.trim();

        if (!/^\d{4}$/.test(studentId)) {
            alert("学籍番号は4桁の数字で入力してください。");
            return;
        }

        if (!studentName) {
            alert("氏名を入力してください。");
            return;
        }

        let imageUrl = "";

        const file = document.getElementById("imageFile").files[0];

        if (file) {
            imageUrl = await uploadImage(file);
        }

        const itemRef = doc(collection(db, "lostItems"));
        const reportRef = doc(db, "studentReports", itemRef.id);
        const batch = writeBatch(db);

        batch.set(itemRef, {

            name: document.getElementById("name").value,

            category: document.getElementById("category").value,

            image: imageUrl,

            foundPlace: document.getElementById("foundPlace").value,

            storagePlace: document.getElementById("storagePlace").value,

            foundDate: document.getElementById("foundDate").value,

            description: document.getElementById("description").value,

            isNew: true,

            status: "確認中",

            createdAt: serverTimestamp()

        });

        batch.set(reportRef, {
            itemId: itemRef.id,
            studentId,
            studentName,
            createdAt: serverTimestamp()
        });

        await batch.commit();

        alert("登録完了しました。先生が確認後に公開されます。");

        // フォーム初期化
        document.getElementById("name").value = "";
        document.getElementById("studentId").value = "";
        document.getElementById("studentName").value = "";
        document.getElementById("category").value = "";
        document.getElementById("foundPlace").value = "";
        document.getElementById("storagePlace").value = "";
        document.getElementById("foundDate").value = "";
        document.getElementById("description").value = "";
        document.getElementById("imageFile").value = "";

    } catch (error) {

        console.error(error);

        alert("登録に失敗しました");

    } finally {

        isSaving = false;
        saveButton.disabled = false;

    }

});

// Cloudinaryへ画像アップロード
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
