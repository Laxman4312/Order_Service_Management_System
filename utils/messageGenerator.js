const generateOrderMessage = async (orderDetails) => {
    let message = orderDetails.message_template;

    // Replace tokens with actual values
    const replacements = {
        '[Customer Name]': orderDetails.customer_name,
        '[Product Details]': orderDetails.product,
        '[Order No]': orderDetails.order_no,
        '[Total Amount]': orderDetails.total_amount,
        '[Advance Amount]': orderDetails.advance_paid,
        '[Advance Mode]': orderDetails.advance_mode || 'N/A',
        '[Expected Dispatch/Pickup Date]': orderDetails.estimated_dispatch_date,
        '[Revised Dispatch/Pickup Date]': orderDetails.revised_dispatch_date || 'N/A',
        '[Balance Amount]': orderDetails.balance_amount,
        '[Shipping Carrier]': orderDetails.shipping_carrier || 'N/A',
        '[LR No. / Tracking Link]': orderDetails.shipping_lr_tracking || 'N/A'
    };

    for (const [token, value] of Object.entries(replacements)) {
        // Escape special regex characters in token
        const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        message = message.replace(new RegExp(escapedToken, 'g'), value);
    }

    return message;
};

const generateServiceMessage = async (serviceDetails) => {
    let message = serviceDetails.message_template;

    // Replace tokens with actual values
    const replacements = {
        '[Customer Name]': serviceDetails.customer_name,
        '[Product Given for Service]': serviceDetails.product_for_service,
        '[Job Card No.]': serviceDetails.jobcard_no,
        '[Estimated Delivery Date]': serviceDetails.estimated_delivery_date || 'TBD',
        '[Estimated Service Cost]': serviceDetails.estimated_service_cost || 'TBD',
        '[Service Details]': serviceDetails.service_details || 'Will be updated'
    };

    for (const [token, value] of Object.entries(replacements)) {
        const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        message = message.replace(new RegExp(escapedToken, 'g'), value);
    }
    

    return message;
};

module.exports = { generateOrderMessage, generateServiceMessage };
