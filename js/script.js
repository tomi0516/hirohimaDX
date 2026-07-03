const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

//落とし物データ
const items = [
    {
        id: 1,
        name: "黒いシャープペン",
        category: "文房具",

        foundPlace: "3階廊下",
        storagePlace: "職員室",

        foundDate: "2026-07-02",
        description: "黒色・名前なし",

        image: "https://placehold.co/600x400",

        status: "保管中",

        isNew: true
    },

    {
        id: 2,
        name: "青い水筒",
        category: "その他",

        foundPlace: "体育館",
        storagePlace: "職員室",

        foundDate: "2026-07-01",
        description: "青色のステンレスボトル",

        image: "https://placehold.co/600x400",

        status: "保管中",

        isNew: true
    },

    {
        id: 3,
        name: "財布",
        category: "財布",

        foundPlace: "食堂",
        storagePlace: "職員室",

        foundDate: "2026-06-30",
        description: "黒色の二つ折り財布",

        image: "https://placehold.co/600x400",

        status: "保管中",

        isNew: true
    }
];

const container = document.getElementById("itemsContainer");



function renderItems(itemList) {

    const container = document.getElementById("itemsContainer");

    container.innerHTML = "";

    document.getElementById("itemCount").textContent =
    `📦 保管中：${itemList.length}件`;

    if(itemList.length === 0){

        container.innerHTML = `
            <p class="no-result">
                該当する落とし物はありません。
            </p>
        `;

        document.getElementById("itemCount").textContent =
            "📦 保管中：0件";

        return;
    }

    itemList.forEach(item => {

        container.innerHTML += `

        <div class="card">

            <img src="${item.image}" class="image">

            <div class="info">

                ${item.isNew ? '<span class="new">NEW</span>' : ''}
                
                <span class="status">${item.status}</span>

                <h2>${item.name}</h2>

                <p>📍 ${item.foundPlace}</p>

                <p>📅 ${item.foundDate}</p>

                <p>📂 ${item.category}</p>
                
                <button onclick="openModal(${item.id})">
                詳細を見る
                </button>

            </div>

        </div>

        `;

    });


}

renderItems(items);


function filterItems() {

    const keyword = searchInput.value.toLowerCase();

    const category = categoryFilter.value;

    const filtered = items.filter(item => {

        const text =
            `${item.name}
             ${item.category}
             ${item.foundPlace}
             ${item.storagePlace}
             ${item.description}`
            .toLowerCase();

        const matchKeyword = text.includes(keyword);

        const matchCategory =
            category === "すべて" ||
            item.category === category;

        return matchKeyword && matchCategory;

    });

    renderItems(filtered);

}

searchInput.addEventListener("input", filterItems);
categoryFilter.addEventListener("change", filterItems);