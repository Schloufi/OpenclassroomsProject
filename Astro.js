let listDivAll = new Array();
let listPhotosAll = new Array();

// Filters
let onlyDefaultPhoto = false;
let filterCategoryId = null;
let filterObjectNames = new Array();
let filterScopes = new Array();
let filterMounts = new Array();
let filterLocations = new Array();
let filterCameras = new Array();

function toggleOnlyDefault() {
	onlyDefaultPhoto = !onlyDefaultPhoto;
	refreshDisplayedList();
}

function showOnlyCategorie(id) {
	if (filterCategoryId == id) {
		filterCategoryId = null;
	} else {
		filterCategoryId = id;
	}
	refreshDisplayedList();
}

function showOnlyObjectsWithName(name) {
	showOnlyObjectsWithAttribute(filterObjectNames, name);
}
function showOnlyObjectsWithScope(name) {
	showOnlyObjectsWithAttribute(filterScopes, name);
}
function showOnlyObjectsWithMount(name) {
	showOnlyObjectsWithAttribute(filterMounts, name);
}
function showOnlyObjectsWithLocation(name) {
	showOnlyObjectsWithAttribute(filterLocations, name);
}
function showOnlyObjectsWithCamera(name) {
	showOnlyObjectsWithAttribute(filterCameras, name);
}

function showOnlyObjectsWithAttribute(list, name) {
	if (list.includes(name)) {
		list.splice(list.indexOf(name), 1);
	} else {
		list.push(name);
	}
	refreshDisplayedList();
}

function refreshDisplayedList() {
	let miniatures = document.getElementById("miniatures");
	while (miniatures.firstChild) {
		miniatures.removeChild(miniatures.firstChild);
	}
	
	for(i=0;i<listPhotosAll.length;i++)
	{
		let photo = listPhotosAll[i];
		
		// Check only default photo
		if (!onlyDefaultPhoto || photo.defaultObjectImage) {
			// Check category id
			if (filterCategoryId == null || photo.categoryId == filterCategoryId) {
				// Check object name
				if (filterObjectNames.length == 0 || filterObjectNames.includes(photo.objectName)) {
					// Check telescope
					if (filterScopes.length == 0 || filterScopes.includes(photo.telescope)) {
						// Check mount
						if (filterMounts.length == 0 || filterMounts.includes(photo.monture)) {
							// Check location
							if (filterLocations.length == 0 || filterLocations.includes(photo.lieu)) {
								// Check camera
								if (filterCameras.length == 0 || filterCameras.includes(photo.appareil)) {
									miniatures.appendChild(listDivAll[i]);
								}
							}
						}
					}
				}
			}
		}
	}
}

function init() {		
	let xhr = new XMLHttpRequest();
	xhr.open('GET', '../astroData/data.xml', true);

	xhr.timeout = 2000; // time in milliseconds

	xhr.onload = function () {
	  if (this.readyState === XMLHttpRequest.DONE) {
			if (this.status === 200) {
				let xmlText = this.responseText;
				
				let allObjects = new Array();
				let allScopes = new Array();
				let allMounts = new Array();
				let allLocations = new Array();
				let allCameras = new Array();
				
				let parser = new DOMParser();
				let xmlDoc = parser.parseFromString(xmlText,"text/xml");
				
				let categories = xmlDoc.getElementsByTagName('category');
				
				for(i=0;i<categories.length;i++)
				{
					let category = categories[i];

					let categoryId = category.getAttribute("id");
					let categoryName = category.getAttribute("name");
					
					let objects = category.getElementsByTagName('object');
				
					for(j=0;j<objects.length;j++)
					{
						let object = objects[j];
						let objectName = object.getAttribute("name");
						
						if (!allObjects.includes(objectName)) {
							allObjects.push(objectName);
						}
						
						let defaultAdded = false;
						
						let photos = object.getElementsByTagName('photo');
				
						for(k=0;k<photos.length;k++)
						{
							let photoElement = photos[k];
							//telescope, monture, lieu, appareil, commentaire, defaultObjectImage
							let photo = new Photo(
								categoryId,
								categoryName,
								objectName,
								photoElement.getAttribute("name"),
								photoElement.getAttribute("date"),
								photoElement.getAttribute("telescope"),
								photoElement.getAttribute("monture"),
								photoElement.getAttribute("lieu"),
								photoElement.getAttribute("appareil"),
								photoElement.getAttribute("commentaire"));
							
							if (photo.telescope != "" && !allScopes.includes(photo.telescope)) {
								allScopes.push(photo.telescope);
							}
							if (photo.monture != "" && !allMounts.includes(photo.monture)) {
								allMounts.push(photo.monture);
							}
							if (photo.lieu != "" && !allLocations.includes(photo.lieu)) {
								allLocations.push(photo.lieu);
							}
							if (photo.appareil != "" && !allCameras.includes(photo.appareil)) {
								allCameras.push(photo.appareil);
							}
							
							let divMini = document.createElement("div");
							divMini.setAttribute('class', 'miniature');
							divMini.style.backgroundImage = "url('img/mini/" + photo.fileName + "')";
							
							const img = document.createElement("img");
							img.src = "../astroData/" + categoryId + "/" + objectName + "/thumb100_h/" + photo.fileName;
							img.alt = photo.fileName + " (" + photo.date + ")";
							img.onclick = function() {
								let photoImg = document.getElementById("photo-img");
								photoImg.src = img.src.replace("thumb100_h/", "");;
							};
							
							divMini.appendChild(img);
							
							let idxAll = Math.floor(Math.random() * listDivAll.length);
							listDivAll.splice(idxAll, 0, divMini);
							listPhotosAll.splice(idxAll, 0, photo);
						
							if (photoElement.getAttribute("default") == "true" && !defaultAdded) {
								defaultAdded = true;
								photo.defaultObjectImage = true;
							}
						}
					}
				}
				
				let miniatures = document.getElementById("miniatures");
				for(i=0;i<listDivAll.length;i++)
				{
					miniatures.appendChild(listDivAll[i]);
				}
				
				fillFilter(allObjects, "showOnlyObjectsWithName", "filter-objects");
				fillFilter(allScopes, "showOnlyObjectsWithScope", "filter-scope");
				fillFilter(allMounts, "showOnlyObjectsWithMount", "filter-mount");
				fillFilter(allLocations, "showOnlyObjectsWithLocation", "filter-location");
				fillFilter(allCameras, "showOnlyObjectsWithCamera", "filter-camera");
			}
		}
	};

	xhr.send(null);
}

function fillFilter(list, methodName, fieldSetId) {
	list.sort();
	let fieldSet = document.getElementById(fieldSetId);
	for(i=0;i<list.length;i++)
	{
		let div = document.createElement("div");
		fieldSet.appendChild(div);
		
		let input = document.createElement("input");
		input.setAttribute('type', 'checkbox');
		input.setAttribute('name', "cb" + i);
		input.setAttribute('value', list[i]);
		input.setAttribute('onclick', methodName + "('" + list[i].replace("'", "\\'") + "')");
		div.appendChild(input);
		
		let label  = document.createElement("label");
		label.setAttribute('for', "cb" + i);
		label.innerHTML = list[i];
		div.appendChild(label);
	}
}