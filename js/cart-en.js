const cart = document.querySelector('.cart-items');
const buyerInfo = document.querySelector('.buyer-container');
const navLink = document.querySelector('.nav-location');
const cartPage = document.getElementById('cart-page')
const orderPage = document.getElementById('order-confirmation-page')
const orderCreatedPage = document.getElementById('order-confirmed-page')
const timeToReset = 60 * 30 * 1000 // 60 * 1000 milisec = 60 seconds * 30 = 30 minutes

var totalPrice = document.getElementById('total-before-promo')
var totalQuantity = document.getElementById('total-items-quantity')
var finalPrice = document.getElementById('total-after-promo')
var itemsInCart = document.querySelector('.cart-items').children
var itemsList = document.querySelector('.cart-items')

var h = document.createElement("H1")
var t = document.createTextNode("Cart is empty"); 
h.appendChild(t)
h.classList.add('no-items-message')

// Every 30 minutes the cart resets and items get deleted
function resetCart() {
    sessionStorage.clear();
    items = []
    while (itemsList.firstChild) {
        itemsList.removeChild(itemsList.lastChild);
    }
    calculateItemsOnLoad()
}

// Calculating items price, quantity on page load
function calculateItemsOnLoad() {
    var activeTab = sessionStorage.getItem('refreshData');

    displayAddedItems()
    let price = 0;
    for (let i= 1 ; i<itemsInCart.length; i++){
        price += parseInt(itemsInCart[i].children[1].children[1].children[1].children[0].innerHTML);
    } 
    
    let quantityText = totalQuantity.parentElement.children[1]
    quantityTextChanger(quantityText, parseInt(totalQuantity.innerHTML))
    totalPrice.innerHTML = price;
    finalPrice.innerHTML = price;

    if (activeTab == 'order'){
        openOrderConfirmationPage()
    } else{
        openCartPage()
    }
}


// Switch tab from cart to order
function openOrderConfirmationPage() {
    if (document.getElementById('total-after-promo').innerHTML < 500){
        // If price is less than 500, show that the minimum order price is 500
         document.querySelector('.low-price').classList.remove('hidden')

    } else{
        cartPage.classList.remove('active-nav')
        orderPage.classList.add('active-nav')
        orderCreatedPage.classList.remove('active-nav')
    
        cart.classList.add('hidden')
        buyerInfo.classList.remove('hidden')
    
        var activeTab = 'order'
        sessionStorage.setItem('refreshData', activeTab);

        document.querySelector('.low-price').classList.add('hidden')
    }
}
// Switch tab from order to cart
function openCartPage() {
    cartPage.classList.add('active-nav')
    orderPage.classList.remove('active-nav')
    orderCreatedPage.classList.remove('active-nav')

    cart.classList.remove('hidden')
    buyerInfo.classList.add('hidden')

    var activeTab = 'cart'
    sessionStorage.setItem('refreshData', activeTab);
}
// Swich tabs when clicking order button in cart
function createOrder() {
    if (cartPage.classList.contains('active-nav')){

        if (document.getElementById('total-after-promo').innerHTML >= 500){
            cartPage.classList.remove('active-nav')
            orderPage.classList.add('active-nav')
    
            cart.classList.add('hidden')
            buyerInfo.classList.remove('hidden')
            document.querySelector('.low-price').classList.add('hidden')

            var activeTab = 'order'
            sessionStorage.setItem('refreshData', activeTab);

        } else{
            // If price is less than 500, show that the minimum order price is 500
            document.querySelector('.low-price').classList.remove('hidden')
        }
        
    } else  if (orderPage.classList.contains('active-nav')){
        
        if (document.getElementById('total-after-promo').innerHTML < 500){
            // If price is less than 500, show that the minimum order price is 500
             document.querySelector('.low-price').classList.remove('hidden')

        } else{
            const buyerForm = document.getElementById('buyerform')
            var requirement = 'pass'
            for (let i = 0; i < buyerForm.length - 4 ; i++){
                if (buyerForm[i].value == '') {
                    requirement = 'fail'
                    alert("Please fill in all the fields")
                    break
                }
            }
    
            // Send the form if every field is filled
            if (requirement != 'fail'){
                var items = JSON.parse(sessionStorage.getItem('items'));
                items.forEach(item => {
                    var formItem = document.createElement('input');
                    formItem.type = 'hidden'
                    formItem.name = item.name
                    formItem.value = item.quantity.toString() + ' шт. ' + (item.quantity * item.price).toString() + ' ₽.'
                    buyerForm.appendChild(formItem)
                });
    
                var formPromo = document.createElement('input')
                formPromo.type = 'hidden'
                formPromo.name = 'Промокод'
                formPromo.value =  document.getElementById('promocode').innerHTML + ' ₽.'
                buyerForm.appendChild(formPromo)
    
                var formPrice = document.createElement('input')
                formPrice.type = 'hidden'
                formPrice.name = 'Стоимость заказа после промокода'
                formPrice.value = finalPrice.innerHTML  + ' ₽.'
                buyerForm.appendChild(formPrice)
    
                buyerForm.submit()
    
                orderPage.classList.remove('active-nav')
                orderCreatedPage.classList.add('active-nav')
            }
        }
    }
}

// Delete 1 item from cart when clicking minus button and adding 1 item when clicking plus button
function changeItemAmount(action, elem){
    // itemQuantity is the <p></p> with quantity in it
    var itemQuantity = elem.parentElement.children[1]
    // cartItem is the whole div element of that item in cart
    var cartItem = elem.parentElement.parentElement.parentElement
    // newQuantity is used to change number inside <p></p>
    var newQuantity = parseInt(itemQuantity.innerHTML)
    // PriceContainer is the container with hidden (base) item price and modified item price
    var PriceContainer = elem.parentElement.parentElement.parentElement.children[1].children[1]

    if (action == 'reduce'){
        if (newQuantity > 1 ){
            newQuantity -= 1;
            itemQuantity.innerHTML = newQuantity;
            priceCalculation(action, PriceContainer)
            updateStorage(cartItem, 'reduce')
        } else if (newQuantity = 1){
            newQuantity -= 1;
            itemQuantity.innerHTML = newQuantity;
            updateStorage(cartItem, 'delete')
            cartItem.classList.add('hide-item')
            setTimeout(function() {
                removeItemFromCart(cartItem, 'increase')
            }, 300);
            priceCalculation(action, PriceContainer)

        }
    } else{
        newQuantity += 1;
        itemQuantity.innerHTML = newQuantity;
        priceCalculation(action, PriceContainer)
        updateStorage(cartItem)
    }
}
function removeItemFromCart(cartItem){
    cartItem.remove()
}

// Delete item from cart fully by pressing remove button 
function deleteItemFromCart(elem){
    let itemPrice = elem.parentElement.parentElement.parentElement.children[1].children[1].children[1].children[0]
    let itemQuantity = elem.parentElement.parentElement.parentElement.children[1].children[0].children[1]

    let finalQuantity = document.getElementById('total-items-quantity')
    let totalPrice = document.getElementById('total-before-promo')
    let finalPrice = document.getElementById('total-after-promo')

    // cartItem is the whole div element of that item in cart
    var cartItem = elem.parentElement.parentElement.parentElement
    cartItem.classList.add('hide-item')
    setTimeout(function() {
        removeItemFromCart(cartItem)
    }, 300);

    totalPrice.innerHTML = parseInt(totalPrice.innerHTML) - parseInt(itemPrice.innerHTML)
    finalPrice.innerHTML = parseInt(finalPrice.innerHTML) - parseInt(itemPrice.innerHTML)
    finalQuantity.innerHTML = parseInt(finalQuantity.innerHTML) - parseInt(itemQuantity.innerHTML)
    updateStorage(cartItem, 'delete')
}


// Склонение слова товары
function quantityTextChanger(quantityText, number) {

    if (number == 1){
        quantityText.innerHTML = 'item'
    } else{
        quantityText.innerHTML = 'items'
    }
}


// Change price when modifying cart
function priceCalculation(action, PriceContainer) {
    var totalPrice = document.querySelector('.total-numbers').children[0]
    var newTotal = parseInt(totalPrice.innerHTML);
    var baseItemPrice = parseInt(PriceContainer.children[0].children[0].innerHTML)
    var itemsPrice = PriceContainer.children[1].children[0]
    var modifiedItemsPrice = parseInt(itemsPrice.innerHTML)

    const promocodeText = document.querySelector('.promo-input').value

    // Defining total quantity of items in cart and final price 
    let totalQuantity = document.getElementById('total-items-quantity')
    let quantityText = totalQuantity.parentElement.children[1]
    let finalPrice = document.getElementById('total-after-promo')
    

    if (action == 'increase'){
        modifiedItemsPrice += baseItemPrice;
        newTotal += baseItemPrice;
        updatedQuantity = parseInt(totalQuantity.innerHTML) + 1;

    } else{
        modifiedItemsPrice -= baseItemPrice;
        newTotal -= baseItemPrice;
        updatedQuantity = parseInt(totalQuantity.innerHTML) - 1;
    }

    // change the price displayed in html
    totalQuantity.innerHTML = updatedQuantity;
    quantityTextChanger(quantityText, totalQuantity.innerHTML)
    itemsPrice.innerHTML = modifiedItemsPrice;
    totalPrice.innerHTML = newTotal

    // only use promoce when price is higher than 1000
    if (totalPrice.innerHTML < 1000){
        document.getElementById('promocode').innerHTML = 0;
        finalPrice.innerHTML = totalPrice.innerHTML;

        
        if (promocodeText.toUpperCase() == 'SALE' || promocodeText.toUpperCase() == 'FREE' || promocodeText.toUpperCase() == 'SWEET'){
            document.querySelector('.promo-low-price').classList.remove('hidden')
            document.querySelector('.wrong-promo').classList.add('hidden')
            document.querySelector('.promo-activated').classList.add('hidden')
        } else if (promocodeText == ''){
            document.querySelector('.wrong-promo').classList.add('hidden')
            document.querySelector('.promo-activated').classList.add('hidden')
            document.querySelector('.promo-low-price').classList.add('hidden')
        } else{
            document.querySelector('.wrong-promo').classList.remove('hidden')
            document.querySelector('.promo-activated').classList.add('hidden')
            document.querySelector('.promo-low-price').classList.add('hidden')
        }

    } else{
        usePromocode();
        if (document.getElementById('promocode').innerHTML == 500){
            finalPrice.innerHTML = parseInt(totalPrice.innerHTML) - 500;
        } else{
            finalPrice.innerHTML = totalPrice.innerHTML
        }
    }

    // Reset cart after 30 minutes
    setInterval(function() {
        resetCart()
    }, timeToReset);

}

// Promocode function
function usePromocode(){
    const promocodeText = document.querySelector('.promo-input').value
    const wrongPromocode = document.querySelector('.wrong-promo')
    const correctPromocode = document.querySelector('.promo-activated')
    const lowPricePromocode = document.querySelector('.promo-low-price')
    const promocodeDisplay = document.getElementById('promocode')

    let finalPrice = document.getElementById('total-after-promo')
    let totalPrice = document.getElementById('total-before-promo')
    
    if (totalPrice.innerHTML < 1000){
        if (promocodeText.toUpperCase() == 'SALE' || promocodeText.toUpperCase() == 'FREE' || promocodeText.toUpperCase() == 'SWEET'){
            document.querySelector('.promo-low-price').classList.remove('hidden')
            document.querySelector('.wrong-promo').classList.add('hidden')
        } else{
            document.querySelector('.wrong-promo').classList.remove('hidden')
            document.querySelector('.promo-low-price').classList.add('hidden')
        }

    } else{
        if (promocodeDisplay.innerHTML == 0){
            if (promocodeText.toUpperCase() == 'SALE' || promocodeText.toUpperCase() == 'FREE' || promocodeText.toUpperCase() == 'SWEET'){
                promocodeDisplay.innerHTML = 500;
                correctPromocode.classList.remove('hidden')
                wrongPromocode.classList.add('hidden')
                lowPricePromocode.classList.add('hidden')
                finalPrice.innerHTML = parseInt(finalPrice.innerHTML) - 500

            } else if (promocodeText == ''){
                promocodeDisplay.innerHTML = 0;
                wrongPromocode.classList.add('hidden')
                correctPromocode.classList.add('hidden')
                lowPricePromocode.classList.add('hidden')
                finalPrice.innerHTML = finalPrice.innerHTML;

            } else{
                promocodeDisplay.innerHTML = 0;
                wrongPromocode.classList.remove('hidden')
                correctPromocode.classList.add('hidden')
                lowPricePromocode.classList.add('hidden')
                finalPrice.innerHTML = finalPrice.innerHTML;
            }
        }
    }
    
    
}
// Use 'enter' key to activate promocode button
var promoInput = document.querySelector(".promo-input");
promoInput.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.querySelector(".promo-button").click();
  }
});


function displayAddedItems(){
    let itemBase = document.querySelector('.base')
    var itemsCount = 0;
    if (items == null || items.length == 0 ){
        itemsList.appendChild(h)

    } else{
        for (let i = 0; i < items.length; i++){

            let newItem = itemBase.cloneNode(true);
            if (menuDictionary[items[i].name] != undefined){

                newItem.children[0].children[1].children[0].innerHTML = menuDictionary[items[i].name]
            } else{
                newItem.children[0].children[1].children[0].innerHTML = items[i].name
            }

            newItem.children[0].children[0].children[0].src = items[i].image
            newItem.children[0].children[1].children[1].children[0].innerHTML = items[i].weight
            newItem.children[1].children[1].children[0].children[0].innerHTML = items[i].price  //base price
            newItem.children[1].children[1].children[1].children[0].innerHTML = items[i].price * items[i].quantity  //modified price
            newItem.children[1].children[0].children[1].innerHTML = items[i].quantity
    
            itemsCount += items[i].quantity;
    
            newItem.classList.remove('hidden')
            itemsList.appendChild(newItem)
        }
        totalQuantity.innerHTML = itemsCount;
    }

}


// Create a copy of sessionStorage without the deleted item 
function updateStorage(cartItem, action) {
    var newItemsList = []

    for (let i = 1; i < cart.children.length; i++){
        if (action == 'delete'){
            if(cart.children[i] !== cartItem){
                let image = cart.children[i].children[0].children[0].children[0].getAttribute('src')
                let name = cart.children[i].children[0].children[1].children[0].innerHTML
                let weight = parseInt(cart.children[i].children[0].children[1].children[1].children[0].innerHTML)
                let price = parseInt(cart.children[i].children[1].children[1].children[0].children[0].innerHTML)
                let quantity = parseInt(cart.children[i].children[1].children[0].children[1].innerHTML)
    
                let newItem = {
                    "name": name,
                    "price": price,
                    'weight': weight,
                    'image': image,
                    'quantity': quantity
                }
    
                newItemsList.push(newItem)

            }
        } else{
                let image = cart.children[i].children[0].children[0].children[0].getAttribute('src')
                let name = cart.children[i].children[0].children[1].children[0].innerHTML
                let weight = parseInt(cart.children[i].children[0].children[1].children[1].children[0].innerHTML)
                let price = parseInt(cart.children[i].children[1].children[1].children[0].children[0].innerHTML)
                let quantity = parseInt(cart.children[i].children[1].children[0].children[1].innerHTML)
    
                let newItem = {
                    "name": name,
                    "price": price,
                    'weight': weight,
                    'image': image,
                    'quantity': quantity
                }
    
                newItemsList.push(newItem)
        }
        
    }
    if (newItemsList.length == 0){
        itemsList.insertBefore(h, itemsList.firstChild)
    }
    sessionStorage.setItem('itemsBack', JSON.stringify(newItemsList));
    sessionStorage.setItem('items', JSON.stringify(newItemsList));
}

// Menu nav link in cart to take you to main page and run sort function
function cartNavLink(type) {
    sessionStorage.setItem('navigation', type.dataset.sorttype);
}
function cartNavLink2(type) {
    sessionStorage.setItem('navigation', type);
}
sessionStorage.removeItem('navigation')


var items = JSON.parse(sessionStorage.getItem('items'));

sessionStorage.setItem('itemsBack', JSON.stringify(items));


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
    'Торт Тыквенный' : "Pumpkin Cheesecake", 
    'Чизкейк Авокадо' : "Avocado Cheesecake", 
    'Торт Радужный' : "Rainbow Cheesecake", 
    'Сладкий рулет (1 шт.)' : "Sweet rolls (1 piece)", 
    'Торт Морковный' : "Carrot Cake", 
    'Чизкейк Клубничный (1 шт.)' : "Strawberry Cheesecake (1 piece)", 
    'Чизкейк Брусничный' : "Lingonberry Cheesecake", 
    'Карамельный Торт' : "Caramel Cake", 
    'Макаруны (6 шт.)' : "Macarons (6 pieces)"
}
