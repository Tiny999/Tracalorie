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
      // {id: 0, name: "Stake Dinner", calories: 1200},
      // {id: 1, name: "Cookies", calories: 400},
      // {id: 2, name: "Eggs", calories: 300}
    ],
    currentItem:  null, 
    totalCalories: 0
  };

  return {
    getItems: function(){
      return state.items;
    },
    addItem: function(name, calories){
      let ID;
      // Create ID
      if(state.items.length > 0){
        ID = state.items[state.items.length - 1].id + 1;
      } else{
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Cresate new Item
      const newItem = new Item(ID, name, calories);

      // Add to Items Array
      state.items.push(newItem);

      return newItem;
    },

    getTotalCalories: function(){
      let total = 0;

      state.items.forEach(item => {
        total += item.calories;
      })

      state.totalCalories = total;

      return state.totalCalories;
    },

    logData: function(){
      return state;
    }
  }
})();



// UI Controller
const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }


  // Public Methods
  return {
    populateItemList: function(items){
      let html = '';

      items.forEach(item => {
        html += `
          <li class="collection-item" id="${item.id}">
            <strong>${item.name}:  </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
          </li>
        `;
      });

      // Insert List items
      document.querySelector(UISelectors.itemList).innerHTML = html;

    },

    getItemInput: function(){
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      }
    },

    addListItem: function(item){
      // Show the list 
      document.querySelector(UISelectors.itemList).style.display = 'block';

      // Create LI element
      const li = document.createElement('li');

      // Add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;

      // Add html
      li.innerHTML = `
        <strong>${item.name}:  </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
      `;

      // Insert Item 
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

    },

    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';

    },

    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    getSelectors: function(){
      return UISelectors;
    }
  }
})();



// App Controller
const App = (function(ItemCtrl, UICtrl){
  // Load Event Listeners
  const loadEventListeners = function(){
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

  }

  // Add Item submit
  function itemAddSubmit(e){
    
    // Get form input from UICtrl 
    const input = UICtrl.getItemInput();

    // Validate Input Fields
    if(input.name !== '' && input.calories !== ''){
      // Add Item 
      const newItem = ItemCtrl.addItem(input.name, input.calories);
  
      // Add Item to UI List
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Clear Input Fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // Public Methods
  return {
    init: function(){
      // Fetch Items from Data Structure
      const items = ItemCtrl.getItems();

      // Check If any items
      if(items.length === 0){
        UICtrl.hideList();
      }else{
        //Populate Item List
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load Event Listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, UICtrl);

// Initialize App
App.init();