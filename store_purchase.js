if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoded', ready);
} else {
    ready()
}

function ready() {
    var removeCartItemButtons =  document.getElementsByClassName('btn-danger')
    console.log(removeCartItemButtons)

    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i];
        button.addEventListener('click', removeCartItem)
    }


    var quantityInputs = document.getElementsByClassName('cart-quantity-input')

    for (var i=0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)

}

function purchaseClicked() {
    alert('Thank you for your purchase!')
 

    
    var cartItems = [];
    var cartRows = document.getElementsByClassName('cart-items')[0].getElementsByClassName('cart-row');
    for (var i = 0; i < cartRows.length; i++) {
        var cartItem = cartRows[i].getElementsByClassName('cart-item-title')[0].innerText;
        var cartPrice = cartRows[i].getElementsByClassName('cart-price')[0].innerText * 100;
        var cartQty = cartRows[i].getElementsByClassName('cart-quantity-input')[0].value;
        var j = i+1000;
        cartItems.push({ id: i+1, name: cartItem, priceInCents: cartPrice, quantity: cartQty });
    }
    fetch("http://3.133.140.120:3000/checkout-session", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            items: cartItems,
        }),
    })
        .then((res) => {
            if (res.ok) return res.json();
            return res.json().then((json) => Promise.reject(json));
        })
        .then(({ url }) => {
            window.location = url;
        })
        .catch((e) => {
            console.error(e.error);
        });

        var cartItems=document.getElementsByClassName('cart-items')[0];
        while (cartItems.hasChildNodes()) {
            cartItems.removeChild(cartItems.firstChild)
        }
        updateCartTotal();
}

function removeCartItem(event) {
    var buttonClicked = event.target
        buttonClicked.parentElement.parentElement.remove()
        updateCartTotal() 
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0 ) {
        input.value = 1
    }
    updateCartTotal();
}

function addToCartClicked(event) {
    var button = event.target;
    var shopItem = button.parentElement.parentElement;
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    console.log(title, price, imageSrc);
    addItemToCart(title, price, imageSrc);
    updateCartTotal();
}


function addItemToCart(title, price, imageSrc) {
    alert(`${title} added to Cart!`)
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')

    for (var i = 0; i < cartItemNames.length; i++) {
        console.log(cartItemNames[i].innerText, title);
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to cart')
            return;
        }
    }

    var cartRowContents = `
                <div class="cart-item cart-column">
                <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
                <span class="cart-item-title">${title}</span>
            </div>
            <span class="cart-price cart-column">${price}</span>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" value="1">
                <button class="btn btn-danger" type="button">REMOVE</button>
            </div>
            `
            cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow)

    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}



function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
    var total = 0;
    for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i]
    var priceElement = cartRow.getElementsByClassName('cart-price')[0]
    var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
    var price = parseFloat(priceElement.innerText.replace('$', ''))
    var quantity = quantityElement.value
    total = total + (price * quantity);
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('cart-total-price')[0].innerText= '$' + total;
}