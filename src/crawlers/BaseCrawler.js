export class BaseCrawler {
    constructor(name, displayName, icon, url) {
        this.name = name;
        this.displayName = displayName;
        this.icon = icon;
        this.url = url;
    }
    getName() {
        return this.name;
    }
    getDisplayName() {
        return this.displayName;
    }
    getIcon() {
        return this.icon;
    }
    getUrl() {
        return this.url;
    }
}
