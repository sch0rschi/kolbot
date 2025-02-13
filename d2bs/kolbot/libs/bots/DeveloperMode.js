/**
*	@filename	Developermode.js
*	@author		theBGuy
*	@desc		developer mode made easy - run commands or scripts from chat commands
*/

function UnitInfo() {
	this.x = 200;
	this.y = 250;
	this.hooks = [];
	this.cleared = true;

	this.createInfo = function (unit) {
		if (typeof unit === "undefined") {
			this.remove();

			return;
		}

		switch (unit.type) {
		case 0:
			this.playerInfo(unit);

			break;
		case 1:
			this.monsterInfo(unit);

			break;
		case 2:
		case 5:
			this.objectInfo(unit);

			break;
		case 4:
			this.itemInfo(unit);

			break;
		}
	};

	this.playerInfo = function (unit) {
		let i, items, string,
			frameXsize = 0,
			frameYsize = 20,
			quality = ["ÿc0", "ÿc0", "ÿc0", "ÿc0", "ÿc3", "ÿc2", "ÿc9", "ÿc4", "ÿc8"];

		if (!this.currentGid) {
			this.currentGid = unit.gid;
		}

		if (this.currentGid === unit.gid && !this.cleared) {
			return;
		}

		if (this.currentGid !== unit.gid) {
			this.remove();
			this.currentGid = unit.gid;
		}

		this.hooks.push(new Text("Classid: ÿc0" + unit.classid, this.x, this.y, 4, 13, 2));

		items = unit.getItems();

		if (items) {
			this.hooks.push(new Text("Equipped items:", this.x, this.y + 15, 4, 13, 2));
			frameYsize += 15;

			for (i = 0; i < items.length; i += 1) {
				if (items[i].getFlag(0x4000000)) {
					string = items[i].fname.split("\n")[1] + "ÿc0 " + items[i].fname.split("\n")[0];
				} else {
					string = quality[items[i].quality] + (items[i].quality > 4 && items[i].getFlag(0x10) ? items[i].fname.split("\n").reverse()[0].replace("ÿc4", "") : items[i].name);
				}

				this.hooks.push(new Text(string, this.x, this.y + (i + 2) * 15, 0, 13, 2));

				if (string.length > frameXsize) {
					frameXsize = string.length;
				}

				frameYsize += 15;
			}
		}

		this.cleared = false;

		this.hooks.push(new Box(this.x + 2, this.y - 15, Math.round(frameXsize * 7.5) - 4, frameYsize, 0x0, 1, 2));
		this.hooks.push(new Frame(this.x, this.y - 15, Math.round(frameXsize * 7.5), frameYsize, 2));

		this.hooks[this.hooks.length - 2].zorder = 0;
	};

	this.monsterInfo = function (unit) {
		let frameYsize = 125;

		if (!this.currentGid) {
			this.currentGid = unit.gid;
		}

		if (this.currentGid === unit.gid && !this.cleared) {
			return;
		}

		if (this.currentGid !== unit.gid) {
			this.remove();
			this.currentGid = unit.gid;
		}

		this.hooks.push(new Text("Classid: ÿc0" + unit.classid, this.x, this.y, 4, 13, 2));
		this.hooks.push(new Text("HP percent: ÿc0" + Math.round(unit.hp * 100 / 128), this.x, this.y + 15, 4, 13, 2));
		this.hooks.push(new Text("Fire resist: ÿc0" + unit.getStat(39), this.x, this.y + 30, 4, 13, 2));
		this.hooks.push(new Text("Cold resist: ÿc0" + unit.getStat(43), this.x, this.y + 45, 4, 13, 2));
		this.hooks.push(new Text("Lightning resist: ÿc0" + unit.getStat(41), this.x, this.y + 60, 4, 13, 2));
		this.hooks.push(new Text("Poison resist: ÿc0" + unit.getStat(45), this.x, this.y + 75, 4, 13, 2));
		this.hooks.push(new Text("Physical resist: ÿc0" + unit.getStat(36), this.x, this.y + 90, 4, 13, 2));
		this.hooks.push(new Text("Magic resist: ÿc0" + unit.getStat(37), this.x, this.y + 105, 4, 13, 2));

		this.cleared = false;

		this.hooks.push(new Box(this.x + 2, this.y - 15, 136, frameYsize, 0x0, 1, 2));
		this.hooks.push(new Frame(this.x, this.y - 15, 140, frameYsize, 2));

		this.hooks[this.hooks.length - 2].zorder = 0;
	};

	this.itemInfo = function (unit) {
		let i = 0, xpos = 60, ypos = (me.getMerc() ? 80 : 20) + (-1 * (me.screensize ? 0 : -120)),
			frameYsize = 50;

		if (!this.currentGid) {
			this.currentGid = unit.gid;
		}

		if (this.currentGid === unit.gid && !this.cleared) {
			return;
		}

		if (this.currentGid !== unit.gid) {
			this.remove();
			this.currentGid = unit.gid;
		}

		this.hooks.push(new Text("Code: ÿc0" + unit.code, xpos, ypos + 0, 4, 13, 2));
		this.hooks.push(new Text("Classid: ÿc0" + unit.classid, xpos, ypos + 15, 4, 13, 2));
		this.hooks.push(new Text("Item Type: ÿc0" + unit.itemType, xpos, ypos + 30, 4, 13, 2));
		this.hooks.push(new Text("Item level: ÿc0" + unit.ilvl, xpos, ypos + 45, 4, 13, 2));

		this.cleared = false;
		this.socketedItems = unit.getItems();

		if (this.socketedItems) {
			this.hooks.push(new Text("Socketed with:", xpos, ypos + 60, 4, 13, 2));
			frameYsize += 30;

			for (i = 0; i < this.socketedItems.length; i += 1) {
				this.hooks.push(new Text(this.socketedItems[i].fname.split("\n").reverse().join(" "), xpos, ypos + (i + 5) * 15, 0, 13, 2));

				frameYsize += 15;
			}
		}

		if (unit.quality === 4 && unit.getFlag(0x10)) {
			this.hooks.push(new Text("Prefix: ÿc0" + unit.prefixnum, xpos, ypos + frameYsize - 5, 4, 13, 2));
			this.hooks.push(new Text("Suffix: ÿc0" + unit.suffixnum, xpos, ypos + frameYsize + 10, 4, 13, 2));

			frameYsize += 30;
		}

		if (unit.getFlag(0x4000000)) {
			this.hooks.push(new Text("Prefix: ÿc0" + unit.prefixnum, xpos, ypos + frameYsize - 5, 4, 13, 2));

			frameYsize += 15;
		}

		this.hooks.push(new Box(xpos + 2, ypos - 15, 116, frameYsize, 0x0, 1, 2));
		this.hooks.push(new Frame(xpos, ypos - 15, 120, frameYsize, 2));

		this.hooks[this.hooks.length - 2].zorder = 0;
	};

	this.objectInfo = function (unit) {
		let frameYsize = 35;

		if (!this.currentGid) {
			this.currentGid = unit.gid;
		}

		if (this.currentGid === unit.gid && !this.cleared) {
			return;
		}

		if (this.currentGid !== unit.gid) {
			this.remove();
			this.currentGid = unit.gid;
		}

		this.hooks.push(new Text("Type: ÿc0" + unit.type, this.x, this.y, 4, 13, 2));
		this.hooks.push(new Text("Classid: ÿc0" + unit.classid, this.x, this.y + 15, 4, 13, 2));

		if (!!unit.objtype) {
			this.hooks.push(new Text("Destination: ÿc0" + unit.objtype, this.x, this.y + 30, 4, 13, 2));

			frameYsize += 15;
		}

		this.cleared = false;

		this.hooks.push(new Box(this.x + 2, this.y - 15, 116, frameYsize, 0x0, 1, 2));
		this.hooks.push(new Frame(this.x, this.y - 15, 120, frameYsize, 2));

		this.hooks[this.hooks.length - 2].zorder = 0;
	};

	this.remove = function () {
		while (this.hooks.length > 0) {
			this.hooks.shift().remove();
		}

		this.cleared = true;
	};
}

function DeveloperMode() {
	let done = false, action = false, command = false, userAddon = false, test = false;
	let watchSent = [], watchRecv = [], blockSent = [], blockRecv = [];
	let unitInfo, unit = new UnitInfo();
	let runCommand = function (msg) {
		if (msg.length <= 1) return;

		let cmd = msg.split(" ")[0].split(".")[1];
		let msgList = msg.split(" ");

		switch (cmd.toLowerCase()) {
		case "me":
			print("Character Level: " + me.charlvl + " | Area: " + me.area + " | x: " + me.x + ", y: " + me.y);
			me.overhead("Character Level: " + me.charlvl + " | Area: " + me.area + " | x: " + me.x + ", y: " + me.y);

			break;
		case "useraddon":
			userAddon = !userAddon;
			me.overhead("userAddon set to " + userAddon);

			break;
		case "run":
			if (msgList.length < 2) {
				print("ÿc1Missing arguments");
			} else {
				action = msgList[1];
			}

			break;
		case "done":
			done = true;

			break;
		case "testing":
			test = true;

			break;
		case "command":
			if (msgList.length < 2) {
				print("ÿc1Missing arguments");
			} else {
				command = msgList.splice(1).join(" ");
			}

			break;
		case "watch":
			if (msgList.length < 3) {
				print("ÿc1Missing arguments");
				break;
			}

			switch (msgList[1].toLowerCase()) {
			case "sent":
				if (msgList[2] === "list") {
					print("Watching sent packets : ÿc8" + watchSent.join(", "));
					break;
				}

				watchSent.push(msgList[2]);
				print("Added ÿc80x" + msgList[2] + "ÿc0 (sent) to watch list");
				break;

			case "recv":
				if (msgList[2] === "list") {
					print("Watching received packets : ÿc8" + watchRecv.join(", "));
					break;
				}

				watchRecv.push(msgList[2]);
				print("Added ÿc80x" + msgList[2] + "ÿc0 (recv) to watch list");
				break;

			default:
				print("ÿc1Invalid argument : " + msgList[1]);
				break;
			}

			break;

		case "!watch":
			if (msgList.length < 3) {
				print("ÿc1Missing arguments");
				break;
			}

			switch (msgList[1].toLowerCase()) {
			case "sent":
				if (watchSent.indexOf(msgList[2]) > -1) watchSent.splice(watchSent.indexOf(msgList[2]), 1);
				print("Removed packet ÿc80x" + msgList[2] + "ÿc0 (sent) from watch list");
				break;

			case "recv":
				if (watchRecv.indexOf(msgList[2]) > -1) watchRecv.splice(watchRecv.indexOf(msgList[2]), 1);
				print("Removed packet ÿc80x" + msgList[2] + "ÿc0 (recv) from watch list");
				break;

			default:
				print("ÿc1Invalid argument : " + msgList[1]);
				break;
			}

			break;

		case "block":
			if (msgList.length < 3) {
				print("ÿc1Missing arguments");
				break;
			}

			switch (msgList[1].toLowerCase()) {
			case "sent":
				if (msgList[2] === "list") {
					print("Blocking sent packets : ÿc8" + blockSent.join(", "));
					break;
				}

				blockSent.push(msgList[2]);
				print("Added ÿc80x" + msgList[2] + "ÿc0 (sent) to block list");
				break;

			case "recv":
				if (msgList[2] === "list") {
					print("Blocking received packets : ÿc8" + blockRecv.join(", "));
					break;
				}

				blockRecv.push(msgList[2]);
				print("Added ÿc80x" + msgList[2] + "ÿc0 (recv) to block list");
				break;

			default:
				print("ÿc1Invalid argument : " + msgList[1]);
				break;
			}

			break;

		case "!block":
			if (msgList.length < 3) {
				print("ÿc1Missing arguments");
				break;
			}

			switch (msgList[1].toLowerCase()) {
			case "sent":
				if (blockSent.indexOf(msgList[2]) > -1) blockSent.splice(blockSent.indexOf(msgList[2]), 1);
				print("Removed packet ÿc80x" + msgList[2] + "ÿc0 (sent) from block list");
				break;

			case "recv":
				if (blockRecv.indexOf(msgList[2]) > -1) blockRecv.splice(blockRecv.indexOf(msgList[2]), 1);
				print("Removed packet ÿc80x" + msgList[2] + "ÿc0 (recv) from block list");
				break;

			default:
				print("ÿc1Invalid argument : " + msgList[1]);
				break;
			}

			break;
		}
	};

	// Received packet handler
	let packetReceived = function(pBytes) {
		let ID = pBytes[0].toString(16);

		// Block received packets from list
		if (blockRecv.includes(ID)) return true;

		if (watchRecv.includes(ID)) {
			let size = pBytes.length;
			let array = [].slice.call(pBytes);
			array.shift();
			console.log("ÿc2S  ÿc8" + ID + "ÿc0 " + array.join(" ") + "  ÿc5(" + size + " Bytes)");
		}

		return false;
	};

	// Sent packet handler
	let packetSent = function (pBytes) {
		let ID = pBytes[0].toString(16);

		// Block all commands or irc chat from being sent to server
		if (ID === "15") {
			if (pBytes[3] === 46) {
				let str = "";

				for (let b = 3; b < pBytes.length - 3; b++) {
					str += String.fromCharCode(pBytes[b]);
				}

				if (pBytes[3] === 46) {
					runCommand(str);
					return true;
				}
			}
		}

		// Block sent packets from list
		if (blockSent.includes(ID)) return true;

		if (watchSent.includes(ID)) {
			let size = pBytes.length;
			let array = [].slice.call(pBytes);
			array.shift();
			console.log("ÿc2C  ÿc8" + ID + "ÿc0 " + array.join(" ") + "  ÿc5(" + size + " Bytes)");
		}

		//![0x6D, 0x02, 0x03].includes(pBytes[0]) && console.log(pBytes);

		return false;
	};

	let copiedConfig = Misc.copy(Config);
	print('starting developermode');
	me.overhead("Started developer mode");
	addEventListener("gamepacketsent", packetSent);
	addEventListener("gamepacket", packetReceived);
	Config.Silence = false;

	while (!done) {
		if (action) {
			if (!isIncluded("bots/" + action + ".js")) {
				include("bots/" + action + ".js");
			}

			if (!unit.cleared) {
				unit.remove();
				userAddon = false;
			}

			if (isIncluded("bots/" + action + ".js")) {
				try {
					Loader.runScript(action);
				} catch (e) {
					print(e);
				}
			} else {
				print("Failed to include: " + action);
			}

			me.overhead("Done with action");
			action = false;
		}

		if (command) {
			if (!unit.cleared) {
				unit.remove();
				userAddon = false;
			}

			try {
				eval(command);
			} catch (e) {
				print(e);
			}

			me.overhead("Done with action");
			command = false;
		}

		if (userAddon) {
			unitInfo = getUnit(101);
			unit.createInfo(unitInfo);
		}

		if (test) {
			me.overhead("done");
			test = false;
		}

		delay(100);
	}

	removeEventListener("gamepacketsent", packetSent);
	removeEventListener("gamepacket", packetReceived);
	Config = copiedConfig;
	
	return true;
}
