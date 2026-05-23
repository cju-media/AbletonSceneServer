inlets = 1;
outlets = 2; // Left outlet (0): Scene Index | Right outlet (1): Play State (0 or 1)

function bang() {
    var song = new LiveAPI("live_set");
    if (!song) {
        outlet(1, 0); // Force stopped state if LOM breaks
        return;
    }

    var trackIds = song.get("tracks");
    if (!trackIds) {
        outlet(1, 0); // Force stopped state if no tracks found
        return;
    }

    var activeSlots = {};
    var isAnyScenePlaying = 0; // Default to 0 (Not playing)

    // 1. Scan tracks to find which slot rows are actively running a clip
    for (var t = 0; t < trackIds.length; t += 2) {
        var trackPath = "live_set tracks " + (t / 2);
        var track = new LiveAPI(trackPath);
        var slotIndex = parseInt(track.get("playing_slot_index"));
        
        // Valid playing clips return 0 or higher
        if (slotIndex >= 0) {
            activeSlots[slotIndex] = true;
            isAnyScenePlaying = 1; // Flip state to 1 because something is playing
        }
    }

    // 2. Output the play state flag from the second (right) outlet first
    outlet(1, isAnyScenePlaying);

    // 3. Output the clean numerical index of any playing scene from the first (left) outlet
    for (var sceneIndex in activeSlots) {
        if (activeSlots.hasOwnProperty(sceneIndex)) {
            outlet(0, parseInt(sceneIndex)); 
        }
    }
}