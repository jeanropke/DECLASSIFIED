var disableMarkers = [];
var visibleMarkers = [];

var map = L.map('worldMap', {
    crs: L.CRS.Simple,
    center: [-(256 / 2), 256 / 2],
    maxBounds: [
        [0, 0],
        [-512 / 2, 512 / 2]
    ],
    zoom: 2,
    maxZoom: 5,
    minZoom: 1,
    layers: [
        ruka.Layer
    ],
    tap: true,
    tapTolerance: 30,
    noWrap: true,
    doubleClickZoom: false,
});
var baseMaps = {
    "Die Maschine": dieMaschine.Layer,
    "Die Maschine Underground": dieMaschine_underground.Layer,
    "Firebase Z": firebaseZ.Layer,
    "Firebase Z Spawn": firebaseZ_spawn.Layer,
    "Duga": duga.Layer,
    "Ruka": ruka.Layer,
    "Alpine": alpine.Layer,
    "Golova": golova.Layer,
    "Sanatorium": sanatorium.Layer,
};

// TODO: improve this to not represent a staircade :@
//##########################################################3
//loops through requiem, omega, maxis and darkAether
//checks if it's actually set
//set factionIcon to the facion + "Icon"
//a.e. var omega from poi.omega turns into => "omega" and adds "Icon"
//than uses the string "omegaIcon" as key for a window variable
//loops through all the seasons within a faction
//sets season for ease of access than loops through the types of intel within ( Audio, Document etc...)
//checks if typeOfIntel is actually set
//loops through all types of intel and makes a marker
if (!debug) {
    for (let faction in poi) {
        if (poi.hasOwnProperty(faction)) {
            let factionIcon = window[faction.toString() + "Icon"]
            for (let i = 0; i <= Object.keys(poi[faction]).length; i++) {
                let season = poi[faction][i];
                for (let typeOfIntel in season) {
                    if (season.hasOwnProperty(typeOfIntel)) {
                        for (let j = 0; j < Object.keys(season[typeOfIntel]).length; j++) {
                            let intel = season[typeOfIntel][j + 1];
                            if (intel.map != "outbreak") {
                                mapLayer = window[intel.map]
                                addMarkerToMap(intel.loc, factionIcon, mapLayer, intel.name, intel.desc)
                            }
                        }
                    }
                }
            }
        }
    }

    for (maep in miscPOI) {
        let currmap = miscPOI[maep]
        if (typeof (miscPOI[maep]) !== "undefined") {
            for (type in currmap) {
                for (item in currmap[type]) {
                    var item = currmap[type][item]
                    let icon = ((item.name == "Aether Rift") ? riftIcon : generalIcon)
                    addMarkerToMap(item.loc, icon, window[maep], item.name, item.desc)

                }
            }
        }
    }
}


function addMarkerToMap(loc, icon, maep, name, desc = ``) {

    const snippet = $(`<div>
        <p>${desc}</p>
        <button type="button" class="btn btn-info remove-button" data-item="${name}">Mark as collected</button>
    </div>`);

    var marker = L.marker(loc, { icon: icon }).addTo(maep.MiscMarkers)
        .bindPopup(`<h1>${name}</h1>${snippet.html()}`);


    //TODO: use a unique ID instead of name. Use a unique ID in data-item in 'Mark as collected' button
    if (localStorage.getItem(name) == 'true') {
        $(marker._icon).css('opacity', '.35');
        disableMarkers.push(name);
    }
    visibleMarkers[name] = marker;

}

map.on('popupopen', function () {
    $('.remove-button').click(function (e) {
        var itemId = $(e.target).data("item");
        if (disableMarkers.includes(itemId.toString())) {
            disableMarkers = $.grep(disableMarkers, function (value) {
                return value != itemId.toString();
            });
            $(visibleMarkers[itemId]._icon).css('opacity', '1');

            localStorage.setItem(itemId, false);
        }
        else {
            disableMarkers.push(itemId.toString());
            $(visibleMarkers[itemId]._icon).css('opacity', '0.35');
            localStorage.setItem(itemId, true);
        }
    });
});