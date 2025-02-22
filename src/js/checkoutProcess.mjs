import { getLocalStorage } from "./utils.mjs";
import { checkout } from "./externalServices.mjs"

const checkoutProcess = {
    key: "",
    outputSelector: "",
    list: [],
    itemTotal: 0,
    shipping: 0,
    tax: 0,
    orderTotal: 0,

    init: function (key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        let rawList = Array.isArray(getLocalStorage(key)) ? getLocalStorage(key) : [];

        this.list = rawList.reduce((acc, item) => {
            let existingItem = acc.find(i => i.Id === item.Id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                acc.push({ ...item, quantity: 1});
            }
            return acc;
        }, []);

        this.calculateItemSummary();
        this.calculateOrderTotal();
    },

    calculateItemSummary: function() {
        // Calculate the total price and total number of items in the cart
        this.itemTotal = this.list.reduce((sum, item) => {
            console.log("Item being calculated:", item);
            return sum + (item.FinalPrice * item.quantity);
        }, 0);
        
        const itemCount = this.list.reduce((sum, item) => sum + item.quantity, 0);
    
        const summaryElement = document.querySelector(this.outputSelector);
        if (summaryElement) {
            summaryElement.innerHTML = `
                <p>Item Subtotal: $${this.itemTotal.toFixed(2)}</p>
                <p>Items in Cart: ${itemCount}</p>
            `;
        }
    },

    calculateOrderTotal: function() {
        // Calculate shipping cost ($10 for the first item, $2 for each additional item)
        const itemCount = this.list.reduce((sum, item) => sum + item.quantity, 0);
        this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;

        // Calculate tax (6% of subtotal)
        this.tax = this.itemTotal * 0.06;

        // Calculate final order total
        this.orderTotal = this.itemTotal + this.shipping + this.tax;

        // Display updated order totals
        this.displayOrderTotals();
    },

    displayOrderTotals: function() {
        // Display the calculated order totals inside the order summary section
        const orderTotalsElement = document.getElementById("order-summary");
        if (orderTotalsElement) {
            orderTotalsElement.classList.remove("hide");
            orderTotalsElement.innerHTML = `
                <p>Tax (6%): $${this.tax.toFixed(2)}</p>
                <p>Shipping: $${this.shipping.toFixed(2)}</p>
                <p><strong>Order Total: $${this.orderTotal.toFixed(2)}</strong></p>
            `;
        }
    },

    checkout: async function (form) {
        const json = formDataToJSON(form);

        json.orderDate = new Date();
        json.orderTotal = this.orderTotal;
        json.tax = this.tax;
        json.shipping = this.shipping;

        json.items = packageItems(this.list);
        console.log(json);
        
        try {
            const res = await checkout(json);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }
};

export function packageItems(items) {
    return items.map(item => ({
        id: item.Id, // Adjust based on your cart structure
        name: item.Name,
        price: item.FinalPrice,
        quantity: item.quantity
    }));
}

function formDataToJSON(formElement) {
    const formData = new FormData(formElement),
        convertedJSON = {};

    formData.forEach(function (value, key) {
        convertedJSON[key] = value;
    });

    return convertedJSON;
}



export default checkoutProcess;