import { db } from "../js/firebase.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const saveButton = document.getElementById("saveButton");

saveButton.addEventListener("click", async () => {

    try {

        await addDoc(collection(db, "lostItems"), {

            name: document.getElementById("name").value,

            category: document.getElementById("category").value,

            foundPlace: document.getElementById("foundPlace").value,

            storagePlace: document.getElementById("storagePlace").value,

            foundDate: document.getElementById("foundDate").value,

            description: document.getElementById("description").value,

            isNew: true,

            status: "保管中"

        });

        alert("登録しました");

    } catch (error) {

        console.error(error);

        alert("保存に失敗しました");

    }

});