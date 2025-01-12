function generateList() {
    let pointsOfInterest = poi
    let aside = document.getElementById("aside")
    let lib = {
        Audio: "Audio Logs",
        Radio: "Radio Transmisions",
        Documents: "Documents",
        Artifacts: "Artifacts",
    }
    for (faction in pointsOfInterest) {
        let factionText = ((faction.toString() == "darkAether") ? "Dark Aether" : faction.toString())
        let factionElement = createElement("section", [faction, 'faction-list'], `<img class="faction-icon" src="./assets/img/icons/faction-${faction}-icon.png">${factionText}`)
        let seasonList = createElement("div", "season-list", "")
        for (season in pointsOfInterest[faction]) {
            let seasonText = ((season == 0) ? "Preseason" : `Season ${season}`)
            let seasonItems = createElement("div", "season-item", seasonText)
            let categoryList = createElement("div", "category-list", "")
            for (category in pointsOfInterest[faction][season]) {
                let categoryItems = createElement("div", "category-item", `${lib[category]}`)
                let intelList = createElement("div", "category-list", "")
                for (intel in pointsOfInterest[faction][season][category]) {
                    let item = pointsOfInterest[faction][season][category][intel]
                    let intelItem = createElement("div", "intel-item", `${intel}: ${item.name}`)
                    let intelDesc = createElement("div", "intel-desc", "")
                    let description = createElement("p", "intel-description", item.desc)
                    intelDesc.appendChild(description)



                    if (item.loc[0] != 0 && item.loc[1] != 0) {
                        let location = createElement("button", "item-location", "Locate Intel")
                        location.onclick = function() {
                            switchAndFly(item.loc, item.map)
                        }
                        intelDesc.appendChild(location)
                    }

                    intelItem.appendChild(intelDesc)
                    intelList.appendChild(intelItem)
                }
                categoryItems.appendChild(intelList)
                if (pointsOfInterest[faction][season][category][1] !== undefined) categoryList.appendChild(categoryItems)
            }
            seasonItems.appendChild(categoryList)
            seasonList.appendChild(seasonItems)
        }

        factionElement.appendChild(seasonList)
        aside.appendChild(factionElement)
    }


}

function createElement(type, className, inside = undefined) {
    element = document.createElement(type)
    if (className != "") {
        if (Array.isArray(className)) {
            for (i in className) element.classList.add(className[i])
        } else {
            element.classList.add(className)
        }
    }
    if (inside != "") {
        if (Array.isArray(inside)) {
            for (i in inside) element.appendChild(inside[i])
        }
        let tempElement = undefined
        if (type == "section" || type == "div") {
            tempElement = document.createElement("h2")
            tempElement.onclick = function() {
                if (this.nextSibling != undefined) this.nextSibling.classList.toggle("visible")
            }
            tempElement.innerHTML = inside
        } else {
            tempElement = document.createTextNode(inside)
        }
        element.appendChild(tempElement)

    }
    return element
}