class Category {
  constructor(id = "", name = "") {
    this.id = id;
    this.name = name;
  }

  toObjectNotation() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}

module.exports = Category;
