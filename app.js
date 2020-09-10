// Storage Controller
const StorageCtrl = (function(){
  // Public Methods
  return {
    storeItem: function(item){
      let items;

      // Chech if any items in LS
      if(localStorage.getItem('items') === null){
        items = [];

        items.push(item);
        // Set LS
        localStorage.setItem('items', JSON.stringify(items))
      } else{
        items = JSON.parse(localStorage.getItem('items'));

        items.push(item);
        // Set LS
        localStorage.setItem('items', JSON.stringify(items))
      }
    },
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items' === null)){
        items = [];
      } else{
        items = JSON.parse(localStorage.getItem('items'));
      }

      return items;
    },
  }
})();


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
    items: StorageCtrl.getItemsFromStorage(),
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

    getItemById: function(id){
      let found = null;
      // Loop through items
      state.items.forEach(item => {
        if(item.id === id ){
          found = item;
        }
      });
      return found;
    },

    updateItem: function(name, calories){
      // Calories to number
      calories = parseInt(calories);

      let found = null;
      /// loop through items
      state.items.forEach(item => {
        if(item.id === state.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },

    deleteItem: function(id){
      // Get the ids
      const ids = state.items.map(item => {
        return item.id;
      });

      // Get the index
      const index = ids.indexOf(id);

      // Remove item
      state.items.splice(index, 1);
    },

    clearAllItems: function(){
      state.items = [];
    },

    setCurrentItem: function(item){
      state.currentItem = item;
    },

    getCurrentItem: function(){
      return state.currentItem;
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
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
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

    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //convert nodelist into array
      listItems = Array.from(listItems);

      listItems.forEach(listItem => {
        const itemId = listItem.getAttribute('id');

        if(itemId === `item-${item.id}`){
          document.querySelector(`#${itemId}`).innerHTML = `
            <strong>${item.name}:  </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
          `;
        }
      })
    },

    deleteListItem: function(id){
      const itemId = `#item-${id}`,
            item = document.querySelector(itemId);

      item.remove();
    },

    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';

    },

    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

      UICtrl.showEditState();
    },

    removeItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      listItems = Array.from(listItems);

      listItems.forEach(item => {
        item.remove();
      })
    },

    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    clearEditState: function(){
     UICtrl.clearInput();
     document.querySelector(UISelectors.updateBtn).style.display = 'none';
     document.querySelector(UISelectors.deleteBtn).style.display = 'none';
     document.querySelector(UISelectors.backBtn).style.display = 'none';
     document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    showEditState: function(){  
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
     },

    getSelectors: function(){
      return UISelectors;
    }
  }
})();



// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
  // Load Event Listeners
  const loadEventListeners = function(){
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit by enter
    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update Item Event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Back button Event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    // Delete Item Event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Clear Items Event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

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

      // Store in LS
      StorageCtrl.storeItem(newItem);

      // Clear Input Fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // Click edit item
  function itemEditClick(e){
    if(e.target.classList.contains('edit-item')){
      // Get list item id
      const listId = e.target.parentNode.parentNode.id; 

      // Break into an array
      const listIdArr = listId.split('-');

      // Get the actual id
      const id = parseInt(listIdArr[1]);

      // Get Item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current Item
      ItemCtrl.setCurrentItem(itemToEdit);
    }

    // Add Item to form
    UICtrl.addItemToForm();

    e.preventDefault();
  }

  // Update Item Submit event
  function itemUpdateSubmit(e){
    // Get item input
    const input = UICtrl.getItemInput();

    // Update Item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories)

    // Update the UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  // Delete item
  function itemDeleteSubmit(e){
    // get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
    
    e.preventDefault();
  }

  // Clear Items Event
  function clearAllItemsClick(e){
    // Delete All Items from data structure
    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Clear UI
    UICtrl.removeItems();

    // Hide the list
    UICtrl.hideList();


    e.preventDefault();
  }

  // Public Methods
  return {
    init: function(){
      // Set initial state
      UICtrl.clearEditState();

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

})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();