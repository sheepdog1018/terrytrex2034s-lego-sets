const sheetId = "1BeH9uPzbpe8wNo5DNStJFM3gr6QluvOTs3KQiKN_pe0";
const sheetName = "LEGO_Sets_List";

// 🔹 Load Owned Set Numbers for the separate checker (optional)
const query = encodeURIComponent("SELECT C");
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${sheetName}&tq=${query}`;

let ownedSets = [];

fetch(url)
	.then((res) => res.text())
	.then((rep) => {
		const json = JSON.parse(rep.substring(47).slice(0, -2));
		const rows = json.table.rows;
		ownedSets = rows.map((row) => row.c[0]?.v.toString().trim());
		displayOwnedSets(ownedSets.length);
	});

// 🔹 Gallery Logic
const galleryQuery = encodeURIComponent("SELECT B,C,D,F");
const galleryURL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${sheetName}&tq=${galleryQuery}`;

let fullLegoData = [];

fetch(galleryURL)
	.then((res) => res.text())
	.then((rep) => {
		const json = JSON.parse(rep.substring(47).slice(0, -2));
		const rows = json.table.rows;

		fullLegoData = rows.map((row) => ({
			name: row.c[0]?.v || "",
			number: row.c[1]?.v?.toString() || "",
			link: row.c[2]?.v || "",
			img: row.c[3]?.v || ""
		}));

		renderGallery(fullLegoData);
	});

function renderGallery(data) {
	const container = document.getElementById("legoGallery");
	const counter = document.getElementById("setCount");
	container.innerHTML = ""; // clear previous

	// 🔢 Update the set count
	counter.textContent = `Showing ${data.length} LEGO set${
		data.length !== 1 ? "s" : ""
	}`;

	data.forEach((item) => {
		const card = document.createElement("div");
		card.className = "lego-card";
		card.innerHTML = `
      <a href="${item.link}" target="_blank">
        <img src="${item.img}" alt="${item.name}" />
      </a>
      <h3>${item.name}</h3>
      <p>#${item.number}</p>
    `;
		container.appendChild(card);
	});
}

// 🔍 Filter Gallery by Set Number Input
function filterGallery() {
	const input = document
		.getElementById("filterInput")
		.value.trim()
		.toLowerCase();
	if (!input) {
		renderGallery(fullLegoData); // Show all
		return;
	}

	const filtered = fullLegoData.filter(
		(item) =>
			item.number.startsWith(input) || item.name.toLowerCase().includes(input)
	);

	renderGallery(filtered);
}

function checkSet() {
	const input = document.getElementById("setNumberInput").value.trim();
	const result = document.getElementById("result");

	if (!input) {
		result.textContent = "Please enter a set number.";
		return;
	}

	if (ownedSets.includes(input)) {
		result.textContent = `✅ You OWN LEGO set #${input}!`;
	} else {
		result.textContent = `❌ You do NOT own LEGO set #${input}.`;
	}
}

function displayOwnedSets(count) {
	const iconWall = document.getElementById("ownedSetIconWall");
	const countText = document.getElementById("ownedSetCountText");

	// Show count
	countText.textContent = `Owned: ${count} LEGO set${count !== 1 ? "s" : ""}`;

	// External image URLs
	const icons = [
		"https://i.postimg.cc/pVzbn513/lego-svgrepo1213-bg-1.png",
		"https://i.postimg.cc/d32VWHQy/lego-logotype-svgrepo-com-redfill-yellowbg.png",
		"https://i.postimg.cc/pTp9Zb6c/legoicons6453-cleaned-bg.png",
		"https://i.postimg.cc/xdcBjXzx/lego-svgrepo-com-1-bg.png",
		"https://i.postimg.cc/tJC3yx17/bricks-svgrepo-com-bg.png"
	];

	// Populate the icon wall
	for (let i = 0; i < count; i++) {
		const img = document.createElement("img");
		img.src = icons[Math.floor(Math.random() * icons.length)];
		img.alt = "LEGO Block";
		iconWall.appendChild(img);
	}
}