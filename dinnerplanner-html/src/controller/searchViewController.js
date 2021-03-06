class SearchViewController {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.isCollapsed = false;
    this.addEventListeners();
    this.autoCompleteTimeoutIndex = undefined;
    this.lastFreeTextVal = undefined;
  }

  addEventListeners() {
    this.sidebarView();
    this.dishSearchView();
    this.view.sidebarView.registerEventListener(this);
    this.view.searchResultsView.registerEventListener(this);
  }

  //A view tells us it has been interacted with
  //controller is free to take apropriate action
  handleEvent(evtType, evtData) {
    switch (evtType) {
      case "collapseButtonPressed":
        this.model.setSidebarToggle(!this.model.getUserPrefs("sidebarCollapsed"));
        break;
      case "dishPreviewClicked":
        this.presentDetails(evtData.id);
        break;
      case "dishRemovedButtonClicked":
        this.model.removeDishFromMenu(evtData.id);
        break;
    }
  }

  // Event listeners to the SidebarView functionalities.
  sidebarView() {
    this.view.container.querySelector("#confirmorderbutton")
    .addEventListener("click", () => { GSC('search', 'confirmorderbutton') },
    false);

    this.view.container.querySelector("#num-people-input")
    .addEventListener("change", evt => { this.model.setNumberOfGuests(evt.target.value) },
    false);
  }

  // Event listeners to the DishSearchView functionalities.
  dishSearchView() {
    this.view.container.querySelector("#dish-free-text-search")
    .addEventListener("keyup", function (event) {
      this.lastFreeTextVal = event.target.value;
      //Mouse clicks trigger with keyCode = undefined, ignore
      if (event.keyCode === undefined)
        return;

      //Enter pressed, always search
      if (event.keyCode === 13) {
        event.target.blur();
        this.searchForDish();
      } else {
        //get autocomplete as you type, with debounce
        clearTimeout(this.autoCompleteTimeoutIndex);
        this.autoCompleteTimeoutIndex = setTimeout(() => {
        this.model.getAutocompleteResults(event.target.value, 4);
        }, 500)
      }
    }.bind(this));

    this.view.container.querySelector("#dish-free-text-search")
    .addEventListener("change", function (event) {
      //Automatically perform search after user clicks a suggestion
      if (this.lastFreeTextVal != event.target.value)
        this.searchForDish();
    }.bind(this));

    this.view.container.querySelector("#search-for-dish-btn")
    .addEventListener("click", this.searchForDish.bind(this), false);
  }

  searchForDish() {
    let textQuery = this.view.container.querySelector("#dish-free-text-search").value;
    let dishType = this.view.container.querySelector("#dish-type-selector").value;
    loader.toggle(true);
    this.model.getAllDishes(dishType, textQuery).then(() => { loader.toggle(false) });
  }

  presentDetails(id) {
    loader.toggle(true);
    this.model.getDish(id).then(dish => {
      loader.toggle(false);
      this.model.setRecipeDetailsDish(dish);
      GSC('search', 'smallDishBtn');
    });
  }
}