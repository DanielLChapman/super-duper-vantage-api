export default function formatAmounts(amount = 0) {
    if (isNaN(amount)) return amount;

    const options = {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    };

    // check if its a clean dollar amount
    if (amount % 100 === 0) {
        options.minimumFractionDigits = 0;
    }

    const formatter = Intl.NumberFormat("en-US", options);
    //pennies to dollars and then format
    return formatter.format(amount / 100);
}
