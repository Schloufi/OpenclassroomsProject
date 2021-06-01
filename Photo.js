class Photo {
	constructor(categoryId, categoryName, objectName, fileName, date, telescope, monture, lieu, appareil, commentaire) {
		this.categoryId = categoryId;
		this.categoryName = categoryName;
		this.objectName = objectName;
		this.fileName = fileName;
		this.date = date;
		this.telescope = telescope;
		this.monture = monture;
		this.lieu = lieu;
		this.appareil = appareil;
		this.commentaire = commentaire;
		this.defaultObjectImage = false;
	}
}