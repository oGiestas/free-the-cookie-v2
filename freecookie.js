window.addEventListener("load", (event) => {
	setTimeout(() => main(document.body), 500);
});

let count = 0;
let manage = 0;
let contents = new Array();

let today = new Date();
let date = today.getDate() + '-' + (today.getMonth()+1) + '-' + today.getFullYear() +
	' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

contents.push(date);
contents.push(window.location.href);

function main(node) {
	let walker = document.createTreeWalker(
	node,
	NodeFilter.SHOW_ALL,
	);

	manage += 1;

	while (walker.nextNode() != null) {
		var current = walker.currentNode;
		if (current.shadowRoot) {
			allchilds(current.shadowRoot);
		}
		
		let content = walker.currentNode.textContent.toLowerCase();
		for (var i = 0; i < wordlist.length; i++) {
			if (content.includes(wordlist[i])) {
				current = walker.currentNode;
				allchilds(current);
			}
		}
	}
	if (count == 0) {
		contents.push("No refuse option available.");
	} 

	if (manage == 2) {
		contents.push("Manage options triggered.");
		setTimeout(() => main(document.body), 500);
	} else {
		let csvContent = "data:text/csv;charset=utf-8," + contents.join(",");
		var encodedUri = encodeURI(csvContent);
		var link = document.createElement("a");
		var filename = window.location.host + ".csv";
		
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", filename);
		document.body.appendChild(link);
		link.click();
	}
}

function allchilds(node) {
    if (!node.children) return;
	
	for (var i = 0; i < node.children.length; i++) {
		var child = node.children[i];
		checkbtn(child);
		allchilds(child);
	} 
}

function checkbtn(child) {
	let buttonlist = ["button", "[role=button]"];
	for (var i = 0; i < buttonlist.length; i++) {
		if (child.matches(buttonlist[i])) {
			let content = child.textContent.toLowerCase();
		
			for (var i = 0; i < checklist.length; i++) {
				if (content.includes(checklist[i])) {
					count += 1;
					contents.push("Refuse button found: ");
					contents.push(child.textContent);
					contents.push(child.outerHTML);
					child.click();
				}
			}
			if (manage == 1) {
				for (var j = 0; j < managelist.length; j++) {
					if (content.includes(managelist[j])) {
						manage += 1;
						contents.push("Manage button found: ");
						contents.push(child.textContent);
						contents.push(child.outerHTML);
						child.click();
						break;
					}
				}
			}
		}
	}
}

