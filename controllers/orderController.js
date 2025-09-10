// // const Order = require('../models/orderModel');

// // class OrderController {
// //     static async createOrder(req, res) {
// //         try {
// //             const orderData = req.body;
// //             const newOrder = await Order.create(orderData);

// //             res.status(201).json({ message: 'Order created successfully', order: newOrder });
// //         } catch (error) {
// //             console.error("Error in createOrder:", error.message);
// //             res.status(500).json({ error: 'Failed to create order' });
// //         }
// //     }

// //     // Get order by ID
// //     static async getOrderById(req, res) {
// //         try {
// //             const { id } = req.params;
// //             const order = await Order.findById(id);
// //             if (!order) {
// //                 return res.status(404).json({ error: 'Order not found' });
// //             }
// //             res.status(200).json(order);
// //         } catch (error) {
// //             console.error("Error in getOrderById:", error.message);
// //             res.status(500).json({ error: 'Failed to retrieve order' });
// //         }
// //     }

// //     // Get all orders (with optional filters)
// //     static async getAllOrders(req, res) {
// //         try {
// //             const filters = req.query;
// //             const orders = await Order.findAll(filters);
// //             res.status(200).json(orders);
// //         } catch (error) {
// //             console.error("Error in getAllOrders:", error.message);
// //             res.status(500).json({ error: 'Failed to retrieve orders' });
// //         }
// //     }

// //     // Update an order
// //     static async updateOrder(req, res) {
// //         try {
// //             const { id } = req.params;
// //             const updated = await Order.update(id, req.body);
// //             res.status(200).json({ message: 'Order updated successfully', updated });
// //         } catch (error) {
// //             console.error("Error in updateOrder:", error.message);
// //             const statusCode = error.statusCode || 500;
// //             res.status(statusCode).json({ error: error.message });
// //         }
// //     }

// //     // Update order status only
// //     static async updateOrderStatus(req, res) {
// //         try {
// //             const { id } = req.params;
// //             const { status_id } = req.body;
// //             const success = await Order.updateStatus(id, status_id);
// //             if (!success) {
// //                 return res.status(404).json({ error: 'Order not found or not updated' });
// //             }
// //             res.status(200).json({ message: 'Order status updated successfully' });
// //         } catch (error) {
// //             console.error("Error in updateOrderStatus:", error.message);
// //             res.status(500).json({ error: 'Failed to update status' });
// //         }
// //     }

// //     // Delete an order
// //     static async deleteOrder(req, res) {
// //         try {
// //             const { id } = req.params;
// //             const success = await Order.delete(id);
// //             if (!success) {
// //                 return res.status(404).json({ error: 'Order not found or already deleted' });
// //             }
// //             res.status(200).json({ message: 'Order deleted successfully' });
// //         } catch (error) {
// //             console.error("Error in deleteOrder:", error.message);
// //             res.status(500).json({ error: 'Failed to delete order' });
// //         }
// //     }
// // }

// // module.exports = OrderController;
// const Order = require('../models/orderModel');
// const OrderStatus = require('../models/OrderStatus');
// const { generateOrderMessage } = require('../utils/messageGenerator');


// const orderController = {
//   async createOrder(req, res) {
//     try {
//       const orderData = req.body;

//       const order = await Order.create(orderData);

//       const orderDetails = await Order.findById(order.id);
//       const message = await generateOrderMessage(orderDetails);

      
//       const phone = orderDetails.customer_contact?.replace(/\D/g, '');

      
//       const whatsappUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;

//       // Send response with order and WhatsApp details
//       res.status(201).json({
//         message: 'Order created successfully',
//         order: orderDetails,
//         whatsappMessage: message,
//         whatsappUrl
//       });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   },

//   async getAllOrders(req, res) {
//     try {
//         const filters = {
//             status_id: req.query.status_id,
//             order_date: req.query.order_date,
//             order_no: req.query.order_no,
//             query: req.query.query, // ✅ Add this
//         };

//         const orders = await Order.findAll(filters);

//         const ordersWithWhatsapp = await Promise.all(
//             orders.map(async (order) => {
//                 try {
//                     const message = await generateOrderMessage(order);
//                     const phone = order.customer_contact?.replace(/\D/g, '');
//                     const whatsappUrl = phone ? `https://wa.me/91${phone}?text=${encodeURIComponent(message)}` : null;

//                     return {
//                         ...order,
//                         whatsappMessage: message,
//                         whatsappUrl
//                     };
//                 } catch (err) {
//                     return {
//                         ...order,
//                         whatsappMessage: null,
//                         whatsappUrl: null,
//                         errorGeneratingMessage: err.message
//                     };
//                 }
//             })
//         );

//         res.json(ordersWithWhatsapp);     
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// },


//     async getOrderById(req, res) {
//         try {
//             const order = await Order.findById(req.params.id);
//             if (!order) {
//                 return res.status(404).json({ error: 'Order not found' });
//             }
//             res.json(order);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     },

//     // async updateOrder(req, res) {
//     //     try {
//     //         const orderId = req.params.id;
//     //         const oldOrder = await Order.findById(orderId);
            
//     //         const success = await Order.update(orderId, req.body);
//     //         if (!success) {
//     //             return res.status(404).json({ error: 'Order not found' });
//     //         }
            
//     //         const updatedOrder = await Order.findById(orderId);
            
//     //         // If status changed, send WhatsApp message
//     //         if (oldOrder.status_id !== updatedOrder.status_id) {
//     //             // const message = await generateOrderMessage(updatedOrder);
//     //             // await sendWhatsAppMessage(updatedOrder.customer_contact, message);
//     //         }
            
//     //         res.json({
//     //             message: 'Order updated successfully',
//     //             order: updatedOrder
//     //         });
//     //     } catch (error) {
//     //         res.status(500).json({ error: error.message });
//     //     }
//     // },
//             async updateOrder(req, res) {
//             try {
//                 const orderId = req.params.id;

//                 // Fetch the old order before updating
//                 const oldOrder = await Order.findById(orderId);
//                 if (!oldOrder) {
//                 return res.status(404).json({ error: 'Order not found' });
//                 }

//                 // Update the order
//                 const success = await Order.update(orderId, req.body);
//                 if (!success) {
//                 return res.status(400).json({ error: 'Failed to update order' });
//                 }

//                 // Fetch the updated order
//                 const updatedOrder = await Order.findById(orderId);

//                 // Check if status has changed
//                 if (oldOrder.status_id !== updatedOrder.status_id) {
//                 const message = await generateOrderMessage(updatedOrder);
//                 const phone = updatedOrder.customer_contact?.replace(/\D/g, '');

//                 if (phone) {
//                     const whatsappUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;

//                     // You can uncomment if you want to actually send the message via WhatsApp API
//                     // await sendWhatsAppMessage(updatedOrder.customer_contact, message);

//                     return res.json({
//                     message: 'Order updated and status changed. WhatsApp message generated.',
//                     order: updatedOrder,
//                     whatsappMessage: message,
//                     whatsappUrl
//                     });
//                 }
//                 }

//                 // If status didn't change
//                 res.json({
//                 message: 'Order updated successfully',
//                 order: updatedOrder
//                 });

//             } catch (error) {
//                 res.status(500).json({ error: error.message });
//             }
//             },
            
//     async deleteOrder(req, res) {
//         try {
//             const success = await Order.delete(req.params.id);
//             if (!success) {
//                 return res.status(404).json({ error: 'Order not found' });
//             }
//             res.json({ message: 'Order deleted successfully' });
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     },

//     async exportOrders(req, res) {
//         try {
//             const filters = {
//                 status_id: req.query.status_id,
//                 order_date: req.query.order_date,
//                 order_no: req.query.order_no
//             };
            
//             const orders = await Order.findAll(filters);
//             const format = req.query.format || 'excel';
            
//             if (format === 'excel') {
//                 // Generate Excel file
//                 const excelBuffer = await generateExcelFile(orders, 'orders');
//                 res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//                 res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');
//                 res.send(excelBuffer);
//             } else if (format === 'pdf') {
//                 // Generate PDF file
//                 const pdfBuffer = await generatePDFFile(orders, 'orders');
//                 res.setHeader('Content-Type', 'application/pdf');
//                 res.setHeader('Content-Disposition', 'attachment; filename=orders.pdf');
//                 res.send(pdfBuffer);
//             }
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }
// };

// module.exports = orderController;

const Order = require('../models/orderModel');
const OrderStatus = require('../models/OrderStatus');
const { generateOrderMessage } = require('../utils/messageGenerator');
const queryAsync = require('../middleware/queryAsync');

// const { sendWhatsAppMessage } = require('../utils/whatsappService'); // Optional if you send messages

const orderController = {

  // ✅ Create order
  async createOrder(req, res) {
    try {
      const orderData = req.body;
      const order = await Order.create(orderData);

      const orderDetails = await Order.findById(order.id);
      const message = await generateOrderMessage(orderDetails);
      const phone = orderDetails.customer_contact?.replace(/\D/g, '');

      const whatsappUrl = phone
        ? `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`
        : null;

      res.status(201).json({
        message: 'Order created successfully',
        order: orderDetails,
        whatsappMessage: message,
        whatsappUrl
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // ✅ Get all orders (excluding soft-deleted)
//   async getAllOrders(req, res) {
//     try {
//       const filters = {
//         status_id: req.query.status_id,
//         order_date: req.query.order_date,
//         order_no: req.query.order_no,
//         query: req.query.query,
//       };

//      const isDeletedParam = req.query.is_deleted;
//     const is_deleted = isDeletedParam === 'true' ? true : isDeletedParam === 'false' ? false : null;

//       const orders = await Order.findAll(filters, is_deleted);

//       const ordersWithWhatsapp = await Promise.all(
//         orders.map(async (order) => {
//           try {
//             const message = await generateOrderMessage(order);
//             const phone = order.customer_contact?.replace(/\D/g, '');
//             const whatsappUrl = phone
//               ? `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`
//               : null;

//             return {
//               ...order,
//               whatsappMessage: message,
//               whatsappUrl
//             };
//           } catch (err) {
//             return {
//               ...order,
//               whatsappMessage: null,
//               whatsappUrl: null,
//               errorGeneratingMessage: err.message
//             };
//           }
//         })
//       );

//       res.json(ordersWithWhatsapp);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   },

async getAllOrders(req, res) {
  try {
    const filters = {
      status_id: req.query.status_id,
      order_date: req.query.order_date,
      order_no: req.query.order_no,
      query: req.query.query,
    };

    // Convert 'true'/'false' string to boolean or null
    const isDeletedParam = req.query.is_deleted;
    const is_deleted = isDeletedParam === 'true' ? true
                      : isDeletedParam === 'false' ? false
                      : null;

    // Pass filters and is_deleted to model
    const orders = await Order.findAll(filters, is_deleted);

    // Generate WhatsApp message links
    const ordersWithWhatsapp = await Promise.all(
      orders.map(async (order) => {
        try {
          const message = await generateOrderMessage(order);
          const phone = order.customer_contact?.replace(/\D/g, '');
          const whatsappUrl = phone
            ? `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`
            : null;

          return {
            ...order,
            whatsappMessage: message,
            whatsappUrl,
          };
        } catch (err) {
          return {
            ...order,
            whatsappMessage: null,
            whatsappUrl: null,
            errorGeneratingMessage: err.message,
          };
        }
      })
    );

    res.json(ordersWithWhatsapp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},


  // ✅ Get single order by ID
  async getOrderById(req, res) {
    try {
      const includeDeleted = req.query.includeDeleted === 'true';
      const order = await Order.findById(req.params.id, includeDeleted);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // ✅ Update order and optionally send WhatsApp message if status changes
  async updateOrder(req, res) {
    try {
      const orderId = req.params.id;

      const oldOrder = await Order.findById(orderId);
      if (!oldOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const success = await Order.update(orderId, req.body);
      if (!success) {
        return res.status(400).json({ error: 'Failed to update order' });
      }

      const updatedOrder = await Order.findById(orderId);

      if (oldOrder.status_id !== updatedOrder.status_id) {
        const message = await generateOrderMessage(updatedOrder);
        const phone = updatedOrder.customer_contact?.replace(/\D/g, '');

        if (phone) {
          const whatsappUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
          return res.json({
            message: 'Order updated and status changed. WhatsApp message generated.',
            order: updatedOrder,
            whatsappMessage: message,
            whatsappUrl
          });
        }
      }

      res.json({
        message: 'Order updated successfully',
        order: updatedOrder
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // ✅ Soft delete order
  async deleteOrder(req, res) {
    try {
      const success = await Order.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Order not found or already deleted' });
      }
      res.json({ message: 'Order deleted successfully (soft deleted)' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

async restoreOrder(req, res) {
  try {
    const id = req.body.id || req.params.id || req.query.id;

    console.log('Restoring order with ID:', id, 
                'from params:', req.params.id, 
                'from query:', req.query.id,
                'from body:', req.body.id);

    if (!id) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid Order ID' });
    }

    const checkSql = 'SELECT id, is_deleted FROM orders WHERE id = ?';
    const orderCheck = await queryAsync(checkSql, [orderId]);

    if (orderCheck.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderCheck[0];

    if (order.is_deleted === 0 || order.is_deleted === '0') {
      return res.status(400).json({ error: 'Order is not deleted, cannot restore' });
    }

    const success = await Order.restore(orderId);
    console.log('Restore operation success:', success);

    if (!success) {
      return res.status(500).json({ error: 'Failed to restore order' });
    }

    res.json({ message: 'Order restored successfully' });

  } catch (error) {
    console.error('Error in restoreOrder:', error);
    res.status(500).json({ error: error.message });
  }
}


,

  // ✅ Export orders
  async exportOrders(req, res) {
    try {
      const filters = {
        status_id: req.query.status_id,
        order_date: req.query.order_date,
        order_no: req.query.order_no
      };

      const format = req.query.format || 'excel';
      const orders = await Order.findAll(filters);

      if (format === 'excel') {
        const excelBuffer = await generateExcelFile(orders, 'orders');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');
        res.send(excelBuffer);
      } else if (format === 'pdf') {
        const pdfBuffer = await generatePDFFile(orders, 'orders');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=orders.pdf');
        res.send(pdfBuffer);
      } else {
        res.status(400).json({ error: 'Unsupported export format' });
      }

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = orderController;
