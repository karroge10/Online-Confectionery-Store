const sortButton = document.querySelector('.sort-by');
const sortPopularity = document.getElementById("popularity")
const sortPrice = document.getElementById("price")
const sortDownPopular = document.querySelector('.popular-icon')
const sortDownPrice = document.querySelector('.price-icon')
const buyButtons = document.querySelectorAll('.add-to-cart-button')

const sortCake = document.getElementById('cake')
const sortCheesecake = document.getElementById('cheesecake')
const sortOther = document.getElementById('other')

var menu = document.querySelector('.menu-grid');

var navCircle = document.querySelector('.nav-circle')
var navQuantity = document.querySelector('.nav-quantity')

const nav = document.querySelector('nav')
const navCart = document.querySelector('.nav-cart-text')

const timeToReset = 60 * 30 * 1000 // 60 * 1000 milisec = 60 seconds * 30 = 30 minutes

// Dictionary for language change
const menuDictionary = {
    'Торт Ягодный' : "Berry Cake", 
    'Торт Шоколадный' : "Chocolate Cake", 
    'Тарталетка с малиной (1 шт.)' : "Raspberry Tartlet (1 piece)", 
    'Торт Медовик' : 'Honey Cake',
    'Торт Красный Бархат' : 'Red Velvet Cake',
    'Яблочный Штрудель (1 шт.)' : 'Apple Strudel (1 piece)',
    'Торт Наполеон' : "Napoleon Cake", 
    'Торт Прага' : "Prague Cake", 
    'Шоколадный Чизкейк' : "Chocolate Cheesecake", 
    'Эклер Ягодный' : "Eclair with berries (1 piece)", 
    'Чизкейк Нью-Йорк' : "New York Cheesecake", 
    'Торт Орео' : "Oreo Cake", 
    'Маффины Шоколадные (6 шт.)' : "Chocolate Muffins (6 pieces)", 
    'Торт Праздничный' : "Celebration Cake", 
    'Чизкейк Тирамису (1 шт.)' : "Tiramisu Cheesecake (1 piece)", 
    'Торт Тыквенный' : "Pumpkin Cake", 
    'Чизкейк Авокадо' : "Avocado Cheesecake", 
    'Торт Радужный' : "Rainbow Cake", 
    'Сладкий рулет (1 шт.)' : "Sweet rolls (1 piece)", 
    'Торт Морковный' : "Carrot Cake", 
    'Чизкейк Клубничный (1 шт.)' : "Strawberry Cheesecake (1 piece)", 
    'Чизкейк Брусничный' : "Lingonberry Cheesecake", 
    'Карамельный Торт' : "Caramel Cake", 
    'Макаруны (6 шт.)' : "Macarons (6 pieces)"
}

if (window.screen.width > 1100 && window.screen.height > 600){
    window.onscroll = function() {
    if (window.pageYOffset > 90){
      nav.classList.add('nav-show')
      navCart.classList.add('cart-text-show')
      navCircle.classList.add('nav-circle-black')
    } else{
      nav.classList.remove('nav-show')
      navCart.classList.remove('cart-text-show')
      navCircle.classList.remove('nav-circle-black')
    }
  }
}

var navigationLink = sessionStorage.getItem('navigation')
if (performance.navigation.type == performance.navigation.TYPE_RELOAD){
    sessionStorage.setItem('navigation', 'none');
    navigationLink = 'none'

    if (window.pageYOffset > 90){
        nav.classList.add('nav-show')
        navCart.classList.add('cart-text-show')
        navCircle.classList.add('nav-circle-black')
      } else{
        nav.classList.remove('nav-show')
        navCart.classList.remove('cart-text-show')
        navCircle.classList.remove('nav-circle-black')
      }  
}
if (navigationLink != 'none' && navigationLink != null && navigationLink != undefined){
    if (navigationLink == 'menu'){
        scrollSmoothTo('menu')
    } else if(navigationLink == 'about'){
        scrollSmoothTo('about')
    } else if(navigationLink == 'reviews'){
        scrollSmoothTo('reviews')
    } else if(navigationLink == 'footer'){
        scrollSmoothTo('footer')
    } else{
        scrollSmoothTo('menu')
        sortByType(document.getElementById(navigationLink))
    }
}
// Every 5 minutes the cart resets and items get deleted
function resetCart() {
    sessionStorage.clear();
    itemsList = []

    buyButtons.forEach(function(button){
        button.innerHTML = 'Add to cart'
        button.classList.remove('item-button-clicked')
    })
    navCircle.classList.add('hidden')
    navQuantity.innerHTML = 0;
}

// Determine which sorting parameter we use to sort (popularity or price)
function sortBy2(id){
    const sortOption = document.getElementById(id)
    if (sortOption == sortPrice){
        sortByPrice();
    } else{
        sortByPopularity()
    }
}

// Sort by popularity
function sortByPopularity() {
    sortCake.classList.remove('item-button-clicked')
    sortCheesecake.classList.remove('item-button-clicked')
    sortOther.classList.remove('item-button-clicked')

    sortPrice.classList.remove('selected')
    sortPopularity.classList.add('selected')

    sortDownPrice.classList.remove('fa-sort-amount-down')
    sortDownPrice.classList.add('fa-sort-amount-down-alt')
    
    const sortButtonsArr = document.querySelector('.sort-types-selection')
    for (let i = 0; i < sortButtonsArr.children.length; i++){
        sortButtonsArr.children[i].classList.remove('item-button-clicked')
    }

    for (let i = 0; i < menu.children.length; i++){
        for (j = i; j < menu.children.length; j++){
            if (+menu.children[i].getAttribute('data-rating') < +menu.children[j].getAttribute('data-rating')){
                replacedNode = menu.replaceChild(menu.children[j], menu.children[i])
                insertAfter(replacedNode, menu.children[i])
            }
        }
    }
}
// When sort by price is clicked, it gets highlighted, icon appears, sort by popular button loses highlight and its icon disappears
function sortByPrice() {
    sortCake.classList.remove('item-button-clicked')
    sortCheesecake.classList.remove('item-button-clicked')
    sortOther.classList.remove('item-button-clicked')

    const sortButtonsArr = document.querySelector('.sort-types-selection')
    for (let i = 0; i < sortButtonsArr.children.length; i++){
        sortButtonsArr.children[i].classList.remove('item-button-clicked')
    }
    
    sortPriceInc();

    if (sortPrice.classList.contains('selected')){
        // call the function for sorting by decreasing price
        if (sortDownPrice.classList.contains("fa-sort-amount-down-alt")){
            sortDownPrice.classList.remove('fa-sort-amount-down-alt') // inc
            sortDownPrice.classList.add('fa-sort-amount-down') // dec

            sortPriceDec();
        
        // call the function for sorting by increasing price
        } else{
            sortDownPrice.classList.remove('fa-sort-amount-down')
            sortDownPrice.classList.add('fa-sort-amount-down-alt')

            sortPriceInc();

        }
    }

    sortPopularity.classList.remove('selected')
    sortPrice.classList.add('selected')

}

// Sort items by incresing or decreasing price
function sortPriceInc() {
    for (let i = 0; i < menu.children.length; i++){
        for (j = i; j < menu.children.length; j++){
            if (+menu.children[i].getAttribute('data-price') > +menu.children[j].getAttribute('data-price')){
                replacedNode = menu.replaceChild(menu.children[j], menu.children[i])
                insertAfter(replacedNode, menu.children[i])
            }
        }
    }
}
function sortPriceDec() {
    for (let i = 0; i < menu.children.length; i++){
        for (j = i; j < menu.children.length; j++){
            if (+menu.children[i].getAttribute('data-price') < +menu.children[j].getAttribute('data-price')){
                replacedNode = menu.replaceChild(menu.children[j], menu.children[i])
                insertAfter(replacedNode, menu.children[i])
            }
        }
    }
}
function insertAfter(elem, refElem){
    return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
}

// Sort by type of dessert
function sortByType(type) {
    sortPrice.classList.remove('selected')
    sortPopularity.classList.remove('selected')

    sortCake.classList.remove('item-button-clicked')
    sortCheesecake.classList.remove('item-button-clicked')
    sortOther.classList.remove('item-button-clicked')

    type.classList.add('item-button-clicked')
    
    var desType = type.id;

    for (let i = 0; i < menu.children.length; i++){
        for (j = i; j < menu.children.length; j++){
            
            if (menu.children[j].getAttribute('data-type') == desType){
                replacedNode = menu.replaceChild(menu.children[j], menu.children[i])
                insertAfter(replacedNode, menu.children[i])
            }
        }
    }
}

function sortByTypeNav(type){
    sortPrice.classList.remove('selected')
    sortPopularity.classList.remove('selected')

    sortCake.classList.remove('item-button-clicked')
    sortCheesecake.classList.remove('item-button-clicked')
    sortOther.classList.remove('item-button-clicked')

    document.getElementById(type.dataset.sorttype).classList.add('item-button-clicked')

    var desType = type.dataset.sorttype;
    
    for (let i = 0; i < menu.children.length; i++){
        for (j = i; j < menu.children.length; j++){
            
            if (menu.children[j].getAttribute('data-type') == desType){
                replacedNode = menu.replaceChild(menu.children[j], menu.children[i])
                insertAfter(replacedNode, menu.children[i])
            }
        }
    }
}


// Get a list of items back when going from cart to main page
var itemsList = []
var tempItems = JSON.parse(sessionStorage.getItem('itemsBack'));

if (tempItems != null){
    itemsList = tempItems
    var newQuantity = 0;
    var newPrice = 0;

    itemsList.forEach(function(item) {
        if (menuDictionary[item.name] != undefined){
            item.name = menuDictionary[item.name]
        }
        newQuantity += item.quantity
        newPrice += item.price
      })

    if (itemsList.length > 0){
        navCircle.classList.remove('hidden')
        navQuantity.innerHTML = newQuantity;
    }
    findButtons(itemsList)
}
sessionStorage.removeItem('refreshData')


// Find buttons of bought items
function findButtons(itemsList){
    for (let i = 0; i < menu.children.length; i ++){
    
        for (let j = 0; j < itemsList.length; j ++){

            if (menu.children[i].children[0].children[1].children[0].children[0].childElementCount == 2){
                var tempName = menu.children[i].children[0].children[1].children[0].children[0].children[0].innerHTML + ' ' +menu.children[i].children[0].children[1].children[0].children[0].children[1].innerHTML
            } else{
                var tempName = menu.children[i].children[0].children[1].children[0].children[0].children[0].innerHTML
            }

            if (itemsList[j].name == tempName){
                var button = menu.children[i].children[0].children[1].children[1].children[1];
                button.innerHTML = 'Open cart'
                button.classList.add('item-button-clicked')
            }
        }
    }
}


// Add item to cart from menu
function addToCart(item) {

    var menuItem = item.parentElement.parentElement.parentElement

    if (item.innerHTML == 'Add to cart'){
        item.innerHTML = 'Open cart'
        item.classList.add('item-button-clicked')
        navCircle.classList.remove('hidden')
        navQuantity.innerHTML = parseInt(navQuantity.innerHTML) + 1;
        // Create an object for that item and transfer it to cart html page
        if (menuItem.children[1].children[0].children[0].childElementCount == 2){
            var name = menuItem.children[1].children[0].children[0].children[0].innerHTML + ' ' + menuItem.children[1].children[0].children[0].children[1].innerHTML 
        } else{
            var name = menuItem.children[1].children[0].children[0].children[0].innerHTML
        }

        let price = parseInt(menuItem.children[1].children[1].children[0].children[0].innerHTML);
        let weight = parseInt(menuItem.children[1].children[0].children[1].children[1].innerHTML)
        let image = menuItem.children[0].getAttribute("src");
 
        let itemTest = {
            "name": name,
            "price": price,
            'weight': weight,
            'image': image,
            'quantity': 1
        }

        // Create an array with items and send it to cart
        itemsList.push(itemTest)
        sessionStorage.setItem('items', JSON.stringify(itemsList));
        sessionStorage.setItem('itemsBack', JSON.stringify(itemsList));

        // Reset cart after 30 minutes
        setInterval(function() {
            resetCart()
        }, timeToReset);

    } else{
        location.href = "/cart-en.html";
    }
    

}

sessionStorage.setItem('items', JSON.stringify(itemsList));

// Smooth scrolling instead of changing link url
function scrollSmoothTo(elementId) {
    var element = document.getElementById(elementId);
    element.scrollIntoView({ block: 'start',  behavior: 'smooth' });
  }

// Responsive design code

window.onorientationchange = function() { window.location.reload(); };

const navList = document.querySelector(".nav-list")
const hamburger = document.querySelector(".navbar__ham")

//Hamburger button
function hamburgerOpen(){

    if (!navList.classList.contains("active")){
        navList.classList.add('active')
    } else{
        navList.classList.remove('active')
    }
    if (!hamburger.classList.contains("open")){
        hamburger.classList.add('open')
    } else{
        hamburger.classList.remove('open')
    }

}
function hamburgerClose(){
    navList.classList.remove('active')
    hamburger.classList.remove('open')
}
