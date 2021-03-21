const fs = require("fs");
const path = require("path");

let createBarrelFile = function (folder, scripts, callback) {
	let absPath = path.join(process.cwd(), folder);

	if (scripts.length === 0) {
		callback();
		return;
	}

	let contents = "";

	for (let ii = 0; ii < scripts.length; ii++) {
		if (scripts[ii] === "@@@sep") {
			contents += "\n// subfolders\n";
		} else {
			let scriptLoc = "./" + scripts[ii].split(".")[0];
			contents += `export * from "${scriptLoc}";\n`;
		}
	}

	fs.writeFileSync(path.join(absPath + "/index.ts"), Buffer.from(contents));

	callback();
};

let barrelFolderRecursive = function (folder, callback) {
	let absPath = path.join(process.cwd(), folder);

	fs.readdir(absPath, (err, files) => {
		let scripts = [];
		let folders = [];

		for (let ii = 0; ii < files.length; ii++) {
			let stat = fs.statSync(path.join(absPath, files[ii]));

			if (stat.isFile()) {
				if (path.extname(files[ii]) !== '.ts' || files[ii] === "index.ts") {
					continue;
				} else {
					scripts.push(files[ii]);
				}
			}

			if (stat.isDirectory()) {
				folders.push(files[ii]);
			}
		}

		let addedSeperator = false;
		let foldersLeft = folders.length;
		let onFolderParsed = function (folderName, scriptCount) {
			foldersLeft--;

			if (scriptCount > 0) {
				if (!addedSeperator) {
					scripts.push("@@@sep");
					addedSeperator = true;
				}
				scripts.push(folderName + "/index.ts");
			}

			if (foldersLeft === 0) {
				createBarrelFile(folder, scripts, () => {
					callback(folder.split("/").pop(), scripts.length);
				});
			}
		}

		for (let ii = 0; ii < folders.length; ii++) {
			barrelFolderRecursive(folder + "/" + folders[ii], onFolderParsed);
		}

		foldersLeft++;
		onFolderParsed("", 0);
	});
};

barrelFolderRecursive("./src", () => { console.log("barrel'd"); });