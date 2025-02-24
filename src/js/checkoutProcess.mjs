import { getLocalStorage } from "./utils.mjs";
import { checkout } from "./externalServices.mjs";

const checkoutProcess = {
    key: "",
    outputSelector: "",
    list: [],
    itemTotal: 0,
    shipping: 0,
    tax: 0,
    orderTotal: 0,

    init(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        
        try {
            const rawList = getLocalStorage(key);
            if (!Array.isArray(rawList)) throw new Error("No valid cart data found.");

            // Convert items into a structured list with quantities
            this.list = rawList.reduce((acc, item) => {
                if (!item.Id) throw new Error("Cart item missing Id.");
                let existingItem = acc.find(i => i.Id === item.Id);
                existingItem ? existingItem.quantity++ : acc.push({ ...item, quantity: 1 });
                return acc;
            }, []);

            this.calculateItemSummary();
            this.calculateOrderTotal();
        } catch (err) {
            // console.error("Checkout initialization failed:", err);
            this.resetCheckout();
        }
    },

    resetCheckout() {
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
        this.displayOrderTotals();
    },

    calculateItemSummary() {
        try {
            if (!this.list.length) throw new Error("Cart is empty.");

            this.itemTotal = this.list.reduce((sum, item) => {
                if (!item.FinalPrice || !item.quantity) throw new Error(`Invalid item data: ${JSON.stringify(item)}`);
                return sum + item.FinalPrice * item.quantity;
            }, 0);

            const itemCount = this.list.reduce((sum, item) => sum + item.quantity, 0);
            this.updateSummaryUI(itemCount);
        } catch (err) {
            // console.error("Error calculating item summary:", err);
            this.updateSummaryUI(0, true);
        }
    },

    updateSummaryUI(itemCount, error = false) {
        const summaryElement = document.querySelector(this.outputSelector);
        if (!summaryElement) return; // console.warn(`Summary element not found: ${this.outputSelector}`);

        summaryElement.innerHTML = error
            ? "<p>Error loading cart summary.</p>"
            : `<p>Item Subtotal: $${this.itemTotal.toFixed(2)}</p><p>Items in Cart: ${itemCount}</p>`;
    },

    calculateOrderTotal() {
        try {
            const itemCount = this.list.reduce((sum, item) => sum + item.quantity, 0);
            this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
            this.tax = this.itemTotal * 0.06;
            this.orderTotal = this.itemTotal + this.shipping + this.tax;

            this.displayOrderTotals();
        } catch (err) {
            // console.error("Error calculating order total:", err);
            this.resetCheckout();
        }
    },

    displayOrderTotals() {
        const orderTotalsElement = document.getElementById("order-summary");
        if (!orderTotalsElement) return; // console.warn("Order summary element not found.");

        try {
            orderTotalsElement.classList.remove("hide");
            orderTotalsElement.innerHTML = `
                <p>Tax (6%): $${this.tax.toFixed(2)}</p>
                <p>Shipping: $${this.shipping.toFixed(2)}</p>
                <p><strong>Order Total: $${this.orderTotal.toFixed(2)}</strong></p>
            `;
        } catch (err) {
            // console.error("Error displaying order totals:", err);
            orderTotalsElement.innerHTML = "<p>Error displaying order totals.</p>";
        }
    },

    async checkout(form) {
        try {
            if (!(form instanceof HTMLFormElement)) throw new Error("Invalid form element provided.");

            const json = formDataToJSON(form);
            Object.assign(json, {
                orderDate: new Date(),
                orderTotal: this.orderTotal,
                tax: this.tax,
                shipping: this.shipping,
                items: packageItems(this.list),
            });

            const res = await checkout(json);
            alert("Order placed successfully!");
            return res;
        } catch (err) {
            // console.error("Checkout failed:", err);
            alert(`Checkout error: ${err.message || "Something went wrong. Please try again."}`);
            throw err;
        }
    },
};

export function packageItems(items) {
    if (!Array.isArray(items)) throw new Error("Items must be an array.");
    
    return items.map(({ Id, Name, FinalPrice, quantity }) => {
        if (!Id || !Name || !FinalPrice || !quantity) throw new Error(`Invalid item format: ${JSON.stringify({ Id, Name, FinalPrice, quantity })}`);
        return { id: Id, name: Name, price: FinalPrice, quantity };
    });
}

function formDataToJSON(formElement) {
    if (!(formElement instanceof HTMLFormElement)) throw new Error("Invalid form element.");
    
    return [...new FormData(formElement)].reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

export default checkoutProcess;
