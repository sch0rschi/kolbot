/**
*	@filename	AncientTunnels.js
*	@author		kolton
*	@desc		clear Ancient Tunnels
*/

function AncientTunnels() {
	Town.doChores();
	Pather.useWaypoint(44);
	Precast.doPrecast(true);

	try {
		Config.AncientTunnels.OpenChest && Pather.moveToPreset(me.area, 2, 580) && Misc.openChests(5) && Pickit.pickItems();
		Config.AncientTunnels.KillDarkElder && getPresetUnit(me.area, 1, 751) && Pather.moveToPreset(me.area, 1, 751) && Attack.clear(15, 0, getLocaleString(2886));
	} catch (e) {
		console.warn(e);
	}

	if (!Pather.moveToExit(65, true)) throw new Error("Failed to move to Ancient Tunnels");
	Attack.clearLevel(Config.ClearType);

	return true;
}
