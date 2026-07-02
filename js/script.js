const items = [
    {
        name: "黒いシャープペン",
        place: "3階廊下",
        date: "2026/07/02",
        category: "文房具",
        image: "https://placehold.co/400x250?text=Photo",
        isNew: true
    },
    {
        name: "青い水筒",
        place: "体育館",
        date: "2026/07/01",
        category: "その他",
        image: "https://placehold.co/400x250?text=Photo",
        isNew: false
    },
    {
        name: "財布",
        place: "食堂",
        date: "2026/06/30",
        category: "財布",
        image: "https://placehold.co/400x250?text=Photo",
        isNew: true
    }
];

const container = document.getElementById("itemsContainer");

items.forEach(item => {

    container.innerHTML += `

    <div class="card">

        <img src="${item.image}" class="image">

        <div class="info">

            ${item.isNew ? '<span class="new">NEW</span>' : ''}

            <h2>${item.name}</h2>

            <p>📍 ${item.place}</p>

            <p>📅 ${item.date}</p>

            <p>📂 ${item.category}</p>

            <button>詳細を見る</button>

        </div>

    </div>

    `;

});