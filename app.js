// Storage Controller

// Item Controller
const ItemCtrl = (function(){
  // Item Constructor 
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure (State)
  const state = {
    items: [
      {id: 0, name: "stake dinner", calories: 1200},
      {id: 1, name: "cookies", calories: 400},
      {id: 2, name: "eggs", calories: 300}
    ],
    currentItem:  null, 
    totalCalories: 0
  };

  return {
    logData:  function () {
      return state;
    }
  }
})();

// UI Controller
const UICtrl = (function(){
  
})();

// App Controller
const App = (function(ItemCtrl, UICtrl){
  
  

})(ItemCtrl, UICtrl);